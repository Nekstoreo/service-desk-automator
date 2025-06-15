// src/orchestrators/automationFlow.js
import logger from '../utils/logger.js';
import { delay, selectRandomElement, shuffleArray, getRandomInt } from '../utils/helpers.js';
import { initializeGlobalErrorHandlers, AppError } from '../utils/errorHandler.js';
import { initializeFileCache } from '../services/fileService.js';

import allUsersArray, { USER_ROLES, getUsersByRole } from '../data/users.js';

import * as authService from '../services/authService.js';
import * as userService from '../services/userService.js';
import * as ticketService from '../services/ticketLifecycleService.js'; 

// Constantes para la simulación (ajustables)
const TOTAL_TICKETS_TO_CREATE = 200; // Ahora configurable para pruebas de estrés

const REQUIRED_ANALYSTS = 2;
const TICKETS_TO_ASSIGN_PER_ANALYST = 10;
const TOTAL_TICKETS_TO_ASSIGN = TICKETS_TO_ASSIGN_PER_ANALYST * REQUIRED_ANALYSTS; // 20

// Estados de ciclo de vida para los tickets asignados a cada analista
const LIFECYCLE_DISTRIBUTION = {
  CLOSED: 2,
  RESOLVED: 2,
  LOCKED: 2,
  IN_PROGRESS_WITH_COMMENTS: 2,
  IN_PROGRESS_NO_COMMENTS: 2, // Total 10
};

/**
 * Función principal para ejecutar el flujo de automatización.
 */
async function runAutomation() {
  logger.separator('INICIO DE LA AUTOMATIZACIÓN DE MESA DE SERVICIOS');

  try {
    // Inicializaciones
    initializeGlobalErrorHandlers();
    await initializeFileCache();
    logger.info('Manejadores de errores globales y caché de archivos inicializados.');

    // Paso 1: Autenticación y Preparación de Usuarios
    logger.separator('PASO 1: AUTENTICACIÓN Y PREPARACIÓN DE USUARIOS');
    const authSuccessCount = await authService.authenticateAllUsers();
    if (authSuccessCount < allUsersArray.length) {
      logger.warn('No todos los usuarios pudieron ser autenticados. El flujo podría no completarse.');
    }
    if (authSuccessCount === 0) {
        throw new AppError('Fallo crítico: Ningún usuario pudo ser autenticado. Abortando.', 500, false);
    }

    // Obtener subcategorías activas desde la API y seleccionar 20 aleatorias
    logger.separator('OBTENIENDO SUBCATEGORÍAS ACTIVAS DESDE LA API');
    let apiSubcategories = [];
    let selectedSubcategories = [];
    const adminUser = getUsersByRole(USER_ROLES.ADMINISTRATOR).find(u => u.token && u.id);
    if (adminUser) {
      try {
        const axios = (await import('axios')).default;
        const config = (await import('../config/index.js')).default;
        const response = await axios.get(`${config.BASE_URL}/Subcategories`, {
          headers: { Authorization: `Bearer ${adminUser.token}` },
          timeout: config.API_TIMEOUT || 60000
        });
        apiSubcategories = response.data.filter(s => s.isActive);
        logger.info(`Subcategorías activas obtenidas de la API: ${apiSubcategories.length}`);
        // Seleccionar 20 aleatorias
        selectedSubcategories = shuffleArray(apiSubcategories).slice(0, 20);
        logger.info(`Se seleccionaron aleatoriamente ${selectedSubcategories.length} subcategorías para la creación de tickets.`);
      } catch (err) {
        logger.error('No se pudo obtener la lista de subcategorías desde la API.');
        throw err;
      }
    } else {
      logger.error('No se encontró un admin autenticado para obtener subcategorías desde la API.');
      throw new AppError('No se encontró un admin autenticado para obtener subcategorías desde la API.', 500, false);
    }

    await userService.fetchAndStoreUserIds(); // Sincronizar/verificar IDs
    await userService.promoteAnalysts();

    const employees = getUsersByRole(USER_ROLES.EMPLOYEE).filter(u => u.token && u.id);
    const analysts = getUsersByRole(USER_ROLES.ANALYST).filter(u => u.token && u.id);
    const admin = getUsersByRole(USER_ROLES.ADMINISTRATOR).filter(u => u.token && u.id)[0];

    if (employees.length === 0) throw new AppError('No hay empleados autenticados con ID para crear tickets.', 500, false);
    if (analysts.length < REQUIRED_ANALYSTS) throw new AppError(`Se requieren ${REQUIRED_ANALYSTS} analistas autenticados con ID. Encontrados: ${analysts.length}`, 500, false);
    if (!admin) throw new AppError('No se encontró un administrador autenticado con ID.', 500, false);

    logger.info(`Usuarios listos: ${employees.length} empleados, ${analysts.length} analistas, 1 admin.`);

    // Paso 2: Creación de Tickets (secuencial)
    logger.separator(`PASO 2: CREACIÓN DE ${TOTAL_TICKETS_TO_CREATE} TICKETS (secuencial)`);
    const createdTickets = [];
    for (let i = 0; i < TOTAL_TICKETS_TO_CREATE; i++) {
      const employee = employees[i % employees.length];
      const subcategory = selectedSubcategories[i % selectedSubcategories.length];
      const includeAttachmentOnCreation = Math.random() < 0.3;
      
      try {
        const newTicket = await ticketService.createTicket(employee.username, subcategory, includeAttachmentOnCreation);
        if (newTicket && newTicket.id) {
          createdTickets.push(newTicket);
          logger.info(`Ticket ${newTicket.id} creado por ${employee.username} para ${subcategory.name}`);
        } else {
          logger.warn(`No se pudo crear ticket para ${subcategory.name} por ${employee.username}.`);
        }
      } catch (error) {
        logger.error(`Error al crear ticket para ${employee.username} en subcategoría ${subcategory.name}: ${error.message}`);
      }
      
      // Pequeña pausa entre creaciones para no sobrecargar la API
      await delay(50);
    }
    logger.info(`Total de tickets creados exitosamente: ${createdTickets.length} de ${TOTAL_TICKETS_TO_CREATE} intentos.`);
    if (createdTickets.length < TOTAL_TICKETS_TO_ASSIGN) {
      throw new AppError(`No se crearon suficientes tickets (${createdTickets.length}) para la asignación requerida (${TOTAL_TICKETS_TO_ASSIGN}). Abortando.`, 500, false);
    }


    // Paso 3: Asignación de Tickets a Analistas
    logger.separator(`PASO 3: ASIGNACIÓN DE ${TOTAL_TICKETS_TO_ASSIGN} TICKETS A ANALISTAS`);
    const ticketsToAssign = shuffleArray(createdTickets.slice()).slice(0, TOTAL_TICKETS_TO_ASSIGN);
    const assignedTicketsByAnalyst = new Map(); // Map<analystUsername, ticket[]>

    for (let i = 0; i < analysts.length; i++) {
        assignedTicketsByAnalyst.set(analysts[i].username, []);
    }
    
    let ticketsAssignedCount = 0;
    for (let i = 0; i < ticketsToAssign.length; i++) {
      const ticket = ticketsToAssign[i];
      const analystToAssign = analysts[i % analysts.length]; // Distribuir equitativamente

      const assignmentResult = await ticketService.assignTicketToAnalyst(
        ticket.id,
        analystToAssign.username,
        admin.username // Admin asigna
      );
      if (assignmentResult) {
        assignedTicketsByAnalyst.get(analystToAssign.username).push(ticket); 
        ticketsAssignedCount++;
        logger.info(`Ticket ${ticket.id} asignado a ${analystToAssign.username}.`);
      } else {
        logger.warn(`No se pudo asignar el ticket ${ticket.id} a ${analystToAssign.username}.`);
      }
      // Sin espera artificial
    }
    logger.info(`Total de tickets asignados: ${ticketsAssignedCount}`);


    // Paso 4: Simulación del Ciclo de Vida de Tickets Asignados
    logger.separator('PASO 4: SIMULACIÓN DEL CICLO DE VIDA DE TICKETS ASIGNADOS');
    for (const [analystUsername, ticketsForAnalyst] of assignedTicketsByAnalyst) {
      if (ticketsForAnalyst.length === 0) {
        logger.info(`Analista ${analystUsername} no tiene tickets asignados para simular ciclo de vida.`);
        continue;
      }
      logger.info(`Simulando ciclo de vida para ${ticketsForAnalyst.length} tickets del analista ${analystUsername}`);
      
      const shuffledTickets = shuffleArray(ticketsForAnalyst.slice()); // Trabajar con una copia barajada
      let ticketIdx = 0;

      // Función auxiliar para procesar un tipo de ciclo de vida
      const processLifecycle = async (count, type, action) => {
        logger.info(`Procesando ${count} tickets como '${type}' para ${analystUsername}`);
        for (let i = 0; i < count; i++) {
          if (ticketIdx >= shuffledTickets.length) {
            logger.warn(`No hay suficientes tickets para ${analystUsername} para completar la simulación de tipo '${type}'.`);
            break;
          }
          const ticket = shuffledTickets[ticketIdx++];
          logger.info(`-- Ticket ${ticket.id} (${ticket.title}) -> ${type}`);
          try {
            await action(ticket, analystUsername);
          } catch (e) {
            logger.error(`Error al procesar ticket ${ticket.id} como ${type}: ${e.message}`);
          }
          // Sin espera artificial
        }
      };
      
      // Simulación de tickets CERRADOS
      await processLifecycle(LIFECYCLE_DISTRIBUTION.CLOSED, "CERRADO", async (ticket, currentAnalystUsername) => {
        // El ticket.creatorId es el ID del creador. Necesitamos su username.
        const creatorUser = allUsersArray.find(u => u.id === ticket.creatorId);
        if (!creatorUser) {
            logger.error(`No se pudo encontrar el usuario creador con ID ${ticket.creatorId} para el ticket ${ticket.id}. No se puede aceptar resolución.`);
            return; // Saltar este ticket si no se encuentra el creador
        }
        const creatorUsernameForAccept = creatorUser.username;

        const randomEmployee = selectRandomElement(employees.filter(e => e.id !== ticket.creatorId)) || selectRandomElement(employees);
        
        await ticketService.addCommentToTicket(ticket.id, currentAnalystUsername, selectRandomElement(ticketService.ANALYST_COMMENTS));
        // Sin espera artificial
        await ticketService.resolveTicket(ticket.id, currentAnalystUsername, Math.random() < 0.5); 
        // Sin espera artificial
        if (randomEmployee) {
             await ticketService.addCommentToTicket(ticket.id, randomEmployee.username, selectRandomElement(ticketService.USER_CLOSURE_COMMENTS)); 
             // Sin espera artificial
        }
        // Usar el username del creador para aceptar la resolución
        await ticketService.acceptTicketResolution(ticket.id, creatorUsernameForAccept); 
      });

      // Simulación de tickets RESUELTOS
      await processLifecycle(LIFECYCLE_DISTRIBUTION.RESOLVED, "RESUELTO", async (ticket, currentAnalystUsername) => {
        await ticketService.addCommentToTicket(ticket.id, currentAnalystUsername, selectRandomElement(ticketService.ANALYST_COMMENTS));
        // Sin espera artificial
        await ticketService.resolveTicket(ticket.id, currentAnalystUsername, Math.random() < 0.5);
      });

      // Simulación de tickets BLOQUEADOS
      await processLifecycle(LIFECYCLE_DISTRIBUTION.LOCKED, "BLOQUEADO", async (ticket, currentAnalystUsername) => {
        await ticketService.addCommentToTicket(ticket.id, currentAnalystUsername, selectRandomElement(ticketService.ANALYST_COMMENTS));
        // Sin espera artificial
        await ticketService.lockTicket(ticket.id, currentAnalystUsername);
      });

      // Simulación de tickets EN PROGRESO CON COMENTARIOS
      await processLifecycle(LIFECYCLE_DISTRIBUTION.IN_PROGRESS_WITH_COMMENTS, "EN PROGRESO CON COMENTARIOS", async (ticket, currentAnalystUsername) => {
        const randomEmployee = selectRandomElement(employees.filter(e => e.id !== ticket.creatorId)) || selectRandomElement(employees);
        await ticketService.addCommentToTicket(ticket.id, currentAnalystUsername, selectRandomElement(ticketService.ANALYST_COMMENTS), Math.random() < 0.3);
        await delay(20);
        if (randomEmployee) {
            await ticketService.addCommentToTicket(ticket.id, randomEmployee.username, selectRandomElement(ticketService.USER_COMMENTS), Math.random() < 0.2);
            await delay(20);
        }
        await ticketService.addCommentToTicket(ticket.id, currentAnalystUsername, selectRandomElement(ticketService.ANALYST_FOLLOWUP_COMMENTS));
      });
      
      // Tickets EN PROGRESO SIN COMENTARIOS ADICIONALES (ya están asignados)
      // No se necesita una acción específica aquí, solo se loguea.
      const remainingNoCommentCount = Math.min(LIFECYCLE_DISTRIBUTION.IN_PROGRESS_NO_COMMENTS, shuffledTickets.length - ticketIdx);
      if (remainingNoCommentCount > 0) {
          logger.info(`Procesando ${remainingNoCommentCount} tickets como 'EN PROGRESO SIN COMENTARIOS' para ${analystUsername}`);
          for(let k=0; k < remainingNoCommentCount; k++){
              if (ticketIdx >= shuffledTickets.length) break;
              const ticket = shuffledTickets[ticketIdx++];
              logger.info(`-- Ticket ${ticket.id} (${ticket.title}) -> EN PROGRESO SIN COMENTARIOS (solo asignado)`);
              // Sin espera artificial
          }
      }
    }

    logger.separator('FIN DE LA AUTOMATIZACIÓN');

  } catch (error) {
    logger.error('Error fatal durante la automatización:', error.message);
    if (error instanceof AppError && !error.isOperational) {
      logger.error('La automatización se detuvo debido a un error no operacional.');
    } else if (error instanceof AppError) {
      logger.error('La automatización encontró un error operacional:', error.context);
    }
  }
}

export { runAutomation };
