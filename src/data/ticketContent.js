// src/data/ticketContent.js

/**
 * Títulos predefinidos para los tickets, agrupados por el nombre de la subcategoría.
 * Se utilizarán para generar asuntos realistas y variados para los tickets.
 * Cada clave del objeto corresponde al nombre de una subcategoría, y su valor
 * es un array de posibles títulos para esa subcategoría.
 */
export const TITLES = {
  "Bloqueo de usuario": [
    "No puedo acceder al sistema desde ayer por la tarde",
    "Cuenta bloqueada inesperadamente después de cambio de contraseña",
    "Usuario bloqueado sin motivo aparente, necesito acceso urgente",
    "Imposible ingresar a mi cuenta corporativa desde hace dos horas",
    "Acceso denegado a mi usuario desde esta mañana - mensaje de bloqueo",
    "Sistema me indica que mi cuenta está bloqueada sin razón aparente",
    "Problemas para ingresar con mis credenciales tras actualización",
    "¡Ayuda! Mi usuario quedó bloqueado y tengo una entrega pendiente",
    "Usuario bloqueado - Mensaje de error al intentar acceder",
    "No puedo entrar a mi cuenta desde ayer, aparece como bloqueada",
    "Urgente: Usuario bloqueado justo antes de reunión importante",
    "Sistema dice que excedí intentos de ingreso pero no es cierto",
  ],
  "Alerta de Antivirus": [
    "Antivirus detectó amenaza en mi equipo y no puedo cerrar la alerta",
    "Pop-up constante de alerta de virus cada 5 minutos aproximadamente",
    "Advertencia de malware en mi computadora - aparece constantemente",
    "Notificación persistente del antivirus que interrumpe mi trabajo",
    "Alerta de seguridad no se puede cerrar - ventana roja constante",
    "Aviso de posible infección en mi equipo que apareció al abrir un correo",
    "El antivirus bloquea mi aplicación de uso diario sin razón aparente",
    "Mensaje alarmante del antivirus sobre posible ransomware",
    "Alerta repetitiva de virus que no desaparece ni reiniciando",
    "Antivirus enloquecido: muestra alerta tras alerta sin parar",
    "¿Falsa alarma? Antivirus detecta amenaza en archivo de sistema",
    "Ventana emergente de antivirus interrumpe constantemente mi trabajo",
  ],
  "Correo malicioso": [
    "Correo sospechoso recibido - posible phishing con enlaces extraños",
    "Email extraño con adjuntos desconocidos que parecen peligrosos",
    "Phishing en bandeja de entrada con enlaces sospechosos a sitios falsos",
    "Correo con remitente falso recibido esta mañana - ¿qué debo hacer?",
    "Email fraudulento solicitando credenciales de acceso corporativo",
    "Posible suplantación de identidad por correo de supuesto banco",
    "Recibí un email que parece ser malicioso con asunto alarmante",
    "Correo dudoso que dice ser de RRHH pero desde dominio externo",
    "Email sospechoso con urgencia falsa pidiendo actualizar datos",
    "Varios compañeros recibimos el mismo correo fraudulento hoy",
    "Correo con faltas de ortografía solicitando información bancaria",
    "Alerta: correo electrónico pide cambiar contraseña con enlace raro",
  ],
  "Problemas de navegacion": [
    "Lentitud extrema al cargar sitios web desde esta mañana",
    "Errores constantes en redirecciones de páginas de la intranet",
    "Imposible acceder a ciertos sitios corporativos desde mi equipo",
    "Navegador se congela al abrir aplicaciones web internas",
    "Páginas web no cargan correctamente - solo muestra encabezados",
    "Problemas de acceso a la intranet tras la actualización de ayer",
    "Error de conexión en sitios internos pero externos funcionan bien",
    "Navegación web extremadamente lenta solo en mi computadora",
    "No puedo cargar páginas importantes para mi trabajo diario",
    "Navegador muestra errores 404 en enlaces que funcionaban ayer",
    "Imposible navegar correctamente - páginas se quedan a mitad de carga",
    "Acceso web intermitente: a veces carga, a veces da timeout",
  ],
  "Error de login": [
    "No puedo iniciar sesión aunque la contraseña es correcta, ya intenté 5 veces",
    "Error de autenticación en máquina virtual tras actualización",
    "Problemas con el inicio de sesión en el portal de reportes",
    "Credenciales rechazadas sin motivo aunque las cambié recientemente",
    "Sistema no reconoce mi usuario al ingresar después del mantenimiento",
    "Fallo en la validación de credenciales - mensaje de error confuso",
    "Error al intentar acceder con mi usuario habitual desde ayer",
    "Login fallido repetidamente: mensaje dice 'credenciales inválidas'",
    "Imposible entrar al sistema con mis datos correctos de acceso",
    "Sistema rechaza contraseña recién cambiada esta mañana",
    "Acceso denegado a plataforma virtual sin explicación clara",
    "Pantalla de login me regresa al inicio sin mensaje de error",
  ],
  "Error de ingreso": [
    "Fallo al ingresar datos en el formulario de clientes nuevos",
    "Error al acceder al portal de clientes tras la actualización",
    "Sistema rechaza la información ingresada sin explicación",
    "No puedo completar el registro de datos importantes y urgentes",
    "Formulario se bloquea al enviar información y pierdo todo lo ingresado",
    "Error de validación al guardar datos en sistema de facturación",
    "Imposible ingresar nuevos registros en la plataforma actualizada",
    "Datos rechazados por sistema aunque cumplen todos los requisitos",
    "Formulario web pierde información al intentar guardar",
    "Error inexplicable al cargar información en portal de reportes",
    "Sistema dice 'datos inconsistentes' pero todo está correcto",
    "No puedo ingresar información al sistema desde esta mañana",
  ],
  "Error de la pagina": [
    "Pantalla en blanco al abrir página de reportes mensuales",
    "Sección de Workmanager no carga contenido desde ayer",
    "Página se queda cargando indefinidamente con círculo giratorio",
    "Error 404 en módulo que funcionaba ayer por la tarde",
    "Interfaz vacía al acceder a estadísticas de ventas",
    "Contenido no visible en portal de gestión tras actualización",
    "Datos no se muestran correctamente en la página de incidencias",
    "Pantalla queda completamente vacía al navegar a sección de informes",
    "Dashboard principal aparece sin información ni gráficos",
    "Página muestra solo encabezado pero sin contenido principal",
    "Error 'página no encontrada' en enlace de uso diario",
    "Sección importante del portal aparece totalmente en blanco",
  ],
  "Errores generales (Aplicaciones)": [
    "Aplicación se cierra sola al generar informe trimestral",
    "Programa se bloquea constantemente sin mostrar mensaje de error",
    "Software deja de responder al guardar archivos grandes",
    "Crash al iniciar el programa de gestión documental",
    "Aplicación muestra error sin explicación al procesar datos",
    "Programa no responde después de actualización de esta mañana",
    "Sistema se cuelga al procesar datos de clientes nuevos",
    "Aplicación se congela al intentar generar PDF de facturas",
    "Software contable falla al intentar importar datos externos",
    "Programa de edición pierde cambios sin previo aviso",
    "Aplicación crítica no inicia correctamente desde reinstalación",
    "Error inexplicable en programa de uso diario - no hay mensaje",
  ],
  "Errores generales (Equipos)": [
    "Pantalla azul recurrente en mi equipo cada pocas horas",
    "Reinicio inesperado del computador sin previo aviso",
    "Equipo se apaga solo sin razón aparente constantemente",
    "Laptop hace ruidos extraños y se congela durante reuniones",
    "Computadora extremadamente lenta desde ayer - casi inutilizable",
    "Problemas de rendimiento general del equipo tras actualización",
    "Fallo hardware: pantalla parpadea constantemente con líneas",
    "Equipo sobrecalentándose y apagándose inesperadamente",
    "PC emite pitidos extraños al encender por las mañanas",
    "Monitor muestra colores distorsionados y franjas horizontales",
    "Teclado responde intermitentemente a algunas teclas",
    "Computadora tarda 15 minutos en iniciar y abrir programas",
  ],
  "Errores generales (Datacredito)": [
    "Error al consultar reporte crediticio de cliente importante",
    "Fallo en integración con Datacredito - código 5023 sin explicación",
    "Sistema no muestra resultados de consulta crediticia",
    "Código de error 5023 en Datacredito tras actualización",
    "Exportación de informes falla a mitad de proceso y corrompe archivos",
    "Imposible completar consulta en Datacredito desde ayer",
    "No se puede acceder al módulo de reportes crediticios masivos",
    "Error inexplicable al intentar conexión con sistema Datacredito",
    "Consultas crediticias se quedan cargando indefinidamente",
    "Módulo de Datacredito rechaza parámetros de consulta válidos",
    "Reportes generados por Datacredito llegan incompletos",
    "Integración API con Datacredito devuelve errores constantes",
  ],
};

/**
 * Detalles predefinidos para las descripciones de los tickets, agrupados por el nombre de la subcategoría.
 * Se combinarán con prefijos y sufijos para generar descripciones completas y variadas.
 * Cada clave del objeto corresponde al nombre de una subcategoría, y su valor
 * es un array de posibles cuerpos de descripción para esa subcategoría.
 */
export const TICKET_DETAILS = {
  "Bloqueo de usuario": [
    "Desde ayer por la tarde no puedo ingresar con mis credenciales. Ya intenté reiniciar el equipo varias veces e incluso llamé a un compañero para confirmar si la red estaba funcionando bien.",
    "Mi cuenta aparece bloqueada aunque estoy seguro de haber ingresado la contraseña correcta. Necesito acceso urgente para terminar mi reporte que debo entregar hoy antes de las 3 PM.",
    "Después de actualizar mi contraseña como me pidieron la semana pasada, el sistema me dice que mi usuario está bloqueado. Ya esperé 30 minutos pero sigue igual. ¿Pueden ayudarme?",
    "No logro acceder a mi cuenta desde hace dos horas. El sistema me muestra un mensaje de 'usuario bloqueado' aunque estoy seguro de la contraseña. Lo raro es que ayer estaba funcionando perfectamente.",
    "Mi usuario quedó bloqueado justo cuando estaba en medio de una tarea importante. He probado varias veces y nada que funciona. Ya me está dando dolor de cabeza este problema...",
  ],
  "Alerta de Antivirus": [
    "Mi antivirus muestra una alerta constante sobre un archivo sospechoso en la carpeta de descargas, pero no he descargado nada recientemente. Es una ventana roja que aparece cada 5 minutos aproximadamente.",
    "Mientras trabajaba en Excel, apareció una alerta del antivirus. Dice algo sobre una amenaza de tipo 'troyano' pero no entiendo bien qué debo hacer. Adjunto captura de pantalla del mensaje.",
    "El antivirus detectó un archivo malicioso cuando abrí un correo. Ya cerré todo pero la alerta sigue apareciendo cada 5 minutos. No me deja trabajar tranquilo y tengo una reunión en 10 minutos.",
    "Desde esta mañana el antivirus muestra una ventana roja con una alerta. Intenté cerrarla pero vuelve a aparecer constantemente. Ya intenté reiniciar pero sigue igual de molesto.",
    "Estoy preocupado porque mi antivirus no para de mostrar alertas desde hace una hora. Dice algo sobre un 'ransomware'. ¿Es grave? ¿Debo apagar mi equipo?",
  ],
  "Correo malicioso": [
    "Recibí un correo de un remitente desconocido con un archivo adjunto que parece sospechoso. No lo he abierto pero quería reportarlo por seguridad. El asunto dice 'Factura pendiente de pago' pero yo no he comprado nada.",
    "Me llegó un email que dice ser del banco pidiendo actualizar mis datos con un enlace extraño. Parece phishing pero quería confirmarlo antes de eliminarlo. El correo tiene varios errores de ortografía, eso me pareció raro.",
    "Varios compañeros y yo recibimos un correo idéntico con un enlace sospechoso. El correo dice ser de recursos humanos pero la dirección es extraña (rrhh.empresa@gmail.com en lugar del dominio corporativo).",
    "Acabo de recibir un correo con un asunto alarmante sobre mi cuenta. Tiene adjuntos que no reconozco y el remitente parece falsificado. Me preocupa porque dice algo sobre mi último pago de nómina.",
    "¿Me podrían ayudar a verificar si este correo es legítimo? Me llegó supuestamente del departamento técnico, pero nunca antes me habían pedido cambiar mi contraseña por este medio.",
  ],
  "Problemas de navegacion": [
    "Las páginas web tardan mucho en cargar o simplemente no cargan. He revisado mi conexión y funciona bien con otras aplicaciones. Mi compañero de al lado no tiene este problema con el mismo sitio web.",
    "Cuando intento navegar en Chrome, las páginas se quedan cargando indefinidamente. Ya intenté borrar la caché pero el problema persiste. Es muy frustrante porque tengo que terminar un informe online urgente.",
    "Al hacer clic en cualquier enlace del portal interno, la redirección falla y me muestra un error. Esto ocurre desde esta mañana después de la actualización que nos avisaron por correo.",
    "Los sitios web corporativos están extremadamente lentos desde ayer. Incluso la intranet tarda más de un minuto en mostrar el contenido. Mis compañeros tienen el mismo problema.",
    "¿A alguien más le va super lento la navegación? No puedo trabajar así... He perdido como media hora esperando que cargue una simple página del portal de clientes.",
  ],
  "Error de login": [
    "Intento acceder a la plataforma virtual pero me rechaza la contraseña aunque estoy seguro que es correcta. Ya probé restablecerla sin éxito y estoy empezando a desesperarme.",
    "No puedo iniciar sesión en la máquina virtual. Ingreso mis credenciales correctamente pero la pantalla parpadea y vuelve al inicio. Llevo 40 minutos intentando y nada que funciona.",
    "Al intentar ingresar al sistema, aparece un mensaje de error que dice 'Credenciales no válidas', pero estoy usando los datos correctos. Tengo una presentación en 30 minutos y necesito estos archivos.",
    "Desde que cambiaron los servidores no puedo acceder con mi usuario habitual. El sistema acepta mis credenciales pero luego muestra un error. No entiendo nada de lo que dice el mensaje técnico que aparece.",
    "Estoy intentando entrar al sistema desde hace una hora y no hay manera. Mi contraseña es correcta, la acabo de cambiar esta mañana siguiendo el procedimiento que me indicaron.",
  ],
  "Error de ingreso": [
    "Cuando intento registrar los datos en el formulario y presiono 'Guardar', el sistema muestra un error y pierdo toda la información ingresada. ¡Ya me ha pasado tres veces y he perdido todo el trabajo!",
    "No puedo cargar la información en el portal de clientes. Completo todos los campos pero al enviar muestra un error sin explicación. No sé si los datos se están guardando o no.",
    "Estoy intentando ingresar un nuevo registro pero el sistema se queda procesando indefinidamente y nunca confirma si se guardó. Ya probé con diferentes navegadores y es el mismo problema.",
    "Al tratar de acceder al módulo de reportes, recibo un mensaje de error que dice 'Datos inconsistentes' y no me permite continuar. Nunca antes me había pasado esto y no he cambiado nada en mi configuración.",
    "Llevo toda la mañana peleando con el sistema. Cada vez que intento cargar datos nuevos me dice que hay un error pero no explica cuál. Ya no sé qué más hacer y estoy atrasado con mi trabajo.",
  ],
  "Error de la pagina": [
    "La pantalla del sistema queda completamente en blanco cuando intento abrir la sección de informes. Solo veo el encabezado pero sin contenido. He probado con Edge y Firefox y pasa exactamente lo mismo.",
    "Al hacer clic en el módulo de Workmanager, la página no carga los datos y muestra un espacio vacío donde deberían estar las tareas. Mis compañeros pueden ver sus tareas sin problema, solo me pasa a mí.",
    "La página de gestión de incidentes no carga correctamente. Se queda con el círculo girando permanentemente y no muestra la información. Necesito urgente revisar las incidencias asignadas a mi equipo.",
    "Cuando accedo a la sección de estadísticas, aparece un error 404 aunque ayer funcionaba perfectamente. ¿Movieron la página a otra dirección? No recibí ningún comunicado al respecto.",
    "¿Alguien más tiene problemas con la página del sistema de inventario? Me sale un mensaje raro con códigos y luego se congela todo. Ya perdí el informe que estaba haciendo dos veces por este problema.",
  ],
  "Errores generales (Aplicaciones)": [
    "La aplicación de gestión de proyectos se cierra inesperadamente cuando intento generar un informe. Ya la reinicié varias veces sin éxito y hasta probé reinstalándola completamente.",
    "El programa de contabilidad se bloquea constantemente al intentar importar datos. No muestra error, simplemente deja de responder. Llevo todo el día intentando terminar esto y ya estoy contra el tiempo.",
    "La herramienta de edición se cierra sola cada vez que intento guardar un archivo de más de 5MB. No recibo ningún mensaje de error, simplemente desaparece. Ya perdí varias horas de trabajo por esto.",
    "La aplicación de CRM se congeló mientras actualizaba información de clientes y ahora no puedo ni siquiera abrirla nuevamente. El icono aparece en la barra de tareas pero no responde cuando hago clic.",
    "No hay forma de que esta aplicación funcione bien. Se traba cada 5 minutos y tengo que estar reiniciándola constantemente. Es imposible avanzar así con el trabajo diario.",
  ],
  "Errores generales (Equipos)": [
    "Mi computadora muestra una pantalla azul con texto blanco y se reinicia automáticamente. Esto ha pasado tres veces hoy y temo perder información importante que no alcancé a guardar.",
    "El equipo se apaga inesperadamente mientras estoy trabajando, sin previo aviso. Parece un problema de sobrecalentamiento quizás, porque la base se siente muy caliente al tacto.",
    "Mi laptop hace un ruido extraño, como un ventilador obstruido, y luego se congela completamente. Tengo que forzar el apagado para poder usarla de nuevo. Ocurre cada vez más seguido.",
    "La pantalla de mi equipo parpadea constantemente con líneas horizontales y a veces se pone completamente negra por unos segundos. Es imposible trabajar así, me está dando dolor de cabeza.",
    "Mi equipo está más lento que nunca. Tarda como 10 minutos en encender y cualquier programa que abro se queda 'pensando' una eternidad. Ni siquiera puedo escribir un correo sin esperar.",
  ],
  "Errores generales (Datacredito)": [
    "Al consultar un reporte en Datacredito, el sistema muestra un error de conexión aunque puedo acceder a otras secciones sin problema. El cliente está esperando esta información y ya le he dicho tres veces que sigue sin funcionar.",
    "No logro completar la integración con Datacredito. La API devuelve un código de error 5023 sin explicación adicional. La documentación no menciona nada sobre este código de error específico.",
    "La consulta de reportes crediticios está fallando desde ayer. El sistema acepta los parámetros pero nunca devuelve resultados. Ya probé con diferentes números de identificación y pasa lo mismo.",
    "Al intentar exportar un informe de Datacredito, el proceso se interrumpe a mitad de camino y el archivo queda corrupto. Lo he intentado en diferentes momentos del día pensando que era un problema de carga, pero sigue igual.",
    "¿Alguien más tiene problemas con Datacredito hoy? Me muestra diferentes errores cada vez que intento consultar y ya probé con todos los trucos que me enseñaron en la capacitación. Necesito resolver esto hoy mismo.",
  ],
};

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
