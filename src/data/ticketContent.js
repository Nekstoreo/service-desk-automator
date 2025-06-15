// src/data/ticketContent.js

/**
 * Títulos predefinidos para los tickets, agnósticos a la subcategoría.
 * Se utilizarán para generar asuntos realistas y variados para los tickets.
 * Es un array de posibles títulos genéricos.
 */
export const TITLES = [
  "Error inesperado al intentar realizar una tarea habitual",
  "Solicitud de soporte para inconveniente técnico reciente",
  "No puedo completar una acción importante en la plataforma",
  "El sistema muestra mensajes de error sin explicación clara",
  "Necesito ayuda con una función que no responde correctamente",
  "Problema recurrente que afecta mi productividad diaria",
  "Dificultad para acceder a una herramienta esencial",
  "El sistema se comporta de manera inusual desde hoy",
  "Solicito revisión por mal funcionamiento de una aplicación",
  "No puedo avanzar por un fallo técnico inesperado",
  "Inconveniente al intentar guardar o enviar información",
  "La plataforma no permite completar procesos habituales",
  "Error al cargar archivos o documentos en el sistema",
  "Fallo en la autenticación o acceso a mi cuenta",
  "El sistema se congela o responde muy lento",
  "Solicito restablecimiento de acceso o funcionalidad",
  "Problema con la visualización de datos o reportes",
  "Dificultad para instalar o actualizar una aplicación",
  "Error al intentar conectar con un servicio externo",
  "El sistema no reconoce mis acciones o comandos"
];

/**
 * Detalles predefinidos para las descripciones de los tickets, agnósticos a la subcategoría.
 * Se combinarán con prefijos y sufijos para generar descripciones completas y variadas.
 * Es un array de posibles cuerpos de descripción genéricos.
 */
export const TICKET_DETAILS = [
  "He intentado varias veces realizar la acción y el error persiste, incluso después de reiniciar el sistema.",
  "El inconveniente comenzó hoy y afecta directamente mis tareas diarias, impidiendo avanzar normalmente.",
  "He seguido los pasos habituales pero la plataforma no responde como de costumbre.",
  "El mensaje de error que aparece no da detalles claros sobre la causa del problema.",
  "Probé desde diferentes dispositivos y el inconveniente se repite en todos ellos.",
  "El sistema funcionaba correctamente hasta hace unas horas, pero ahora no permite completar procesos básicos.",
  "He verificado mi conexión y configuraciones, pero el problema continúa.",
  "El error ocurre de forma intermitente, dificultando la continuidad de mi trabajo.",
  "No he realizado cambios recientes en mi equipo, por lo que desconozco el origen del fallo.",
  "Solicito orientación para poder resolver este inconveniente lo antes posible.",
  "El soporte automático no logró solucionar el problema, por eso recurro a ustedes.",
  "El error afecta tanto a la carga de archivos como a la visualización de información.",
  "He intentado cerrar sesión y volver a ingresar, pero el inconveniente persiste.",
  "El sistema muestra lentitud extrema o se congela al intentar realizar tareas simples.",
  "No puedo acceder a ciertas funciones que antes estaban disponibles.",
  "El problema afecta a otros compañeros también, por lo que podría ser generalizado.",
  "He intentado actualizar la aplicación pero el error sigue ocurriendo.",
  "El inconveniente se presenta tanto en la versión web como en la de escritorio.",
  "No recibo notificaciones ni confirmaciones al completar acciones importantes.",
  "Agradezco cualquier ayuda para restablecer el funcionamiento normal del sistema."
];

/**
 * Prefijos para iniciar las descripciones de los tickets.
 * Se seleccionará uno aleatoriamente y se concatenará con un detalle y un sufijo.
 * La variable `username` se reemplazará dinámicamente con el nombre del empleado que crea el ticket.
 */
export const PREFIXES = [
  `Hola equipo de soporte, soy {username} y estoy experimentando el siguiente problema: `,
  `Buenos días. Me comunico porque tengo un inconveniente bastante molesto. `,
  `Necesito ayuda urgente con un problema que está afectando mi trabajo. `,
  `Estoy teniendo problemas con el sistema desde hace unas horas. `,
  `Les escribo porque estoy enfrentando un inconveniente que no me permite continuar con mis tareas. `,
  `Solicito su apoyo para resolver un problema que estoy experimentando desde ayer. `,
  `Hola, ¿cómo están? Les escribo porque tengo un problema con mi equipo/sistema. `,
  `Buen día equipo de soporte. Lamento molestarles, pero tengo un problema que no he podido resolver. `,
  `Les contacto porque estoy enfrentando una situación que requiere de su ayuda técnica. `,
  `Saludos. Espero me puedan ayudar con un problema técnico que me tiene detenido hace rato. `,
];

/**
 * Sufijos para finalizar las descripciones de los tickets.
 * Se seleccionará uno aleatoriamente y se concatenará después del prefijo y el detalle.
 */
export const SUFFIXES = [
  ` Agradezco su pronta atención a este caso.`,
  ` Necesito una solución lo antes posible pues estoy contra el tiempo.`,
  ` Por favor, indíquenme si necesitan más información para diagnosticar el problema.`,
  ` Quedo atento a su respuesta y agradezco de antemano su ayuda.`,
  ` Gracias de antemano por su ayuda y comprensión.`,
  ` Les agradecería mucho si pueden darle prioridad a este caso.`,
  ` Espero su pronta respuesta ya que esto está afectando mi productividad.`,
  ` Cualquier solución, aunque sea temporal, sería de gran ayuda mientras resuelven el problema de fondo.`,
  ` Muchas gracias por su atención y apoyo.`,
  ``, // Un sufijo vacío para mayor variedad
];
