// src/data/commentContent.js

/**
 * Comentarios predefinidos para ser utilizados por los analistas al interactuar
 * inicialmente con un ticket o al solicitar más información.
 */
export const ANALYST_COMMENTS = [
  "Estoy revisando su caso. ¿Podría proporcionarme la versión exacta del navegador que está utilizando? Esto nos ayudará a replicar el problema en nuestro entorno de pruebas.",
  "He identificado el problema y estoy trabajando en la solución. Le mantendré informado del progreso. Estimo tener una actualización para usted en aproximadamente una hora.",
  "Necesito algunos datos adicionales para continuar con la revisión. ¿Cuándo comenzó exactamente a experimentar este problema? ¿Ocurrió después de alguna actualización?",
  "Estamos analizando el comportamiento reportado. ¿Ha intentado borrar la caché y las cookies del navegador? En ocasiones estos datos temporales pueden causar conflictos.",
  "Según nuestro análisis inicial, parece ser un problema relacionado con los permisos de usuario. Estoy verificando su configuración en el directorio activo.",
  "Acabo de revisar su caso y estoy coordinando con el equipo de infraestructura para resolver el inconveniente lo antes posible. Le agradezco su paciencia.",
  "Gracias por reportar este problema. He replicado el error en nuestro ambiente de pruebas y estamos trabajando en una solución. Le tendré noticias pronto.",
  "Estoy verificando los registros del sistema para identificar la causa raíz del problema que menciona. Esto nos ayudará a prevenir que vuelva a ocurrir.",
  "He escalado su caso al equipo especializado. Ellos se pondrán en contacto pronto con más información. Tienen mayor experiencia con este tipo específico de incidencia.",
  "Ya estamos trabajando en una solución para este incidente. Esperamos tenerlo resuelto en las próximas horas. Le agradecemos su comprensión.",
  "Buenos días. Estoy asignado a su caso y ya comencé a analizar el problema reportado. Veo que es un tema bastante específico, pero no se preocupe, lo resolveremos.",
  "Hola, acabo de recibir su ticket. Entiendo que es urgente por lo que me pondré a trabajar en ello inmediatamente. Le mantendré informado.",
  "Comprendo su situación. Vamos a solucionar esto lo antes posible. Mientras tanto, ¿hay alguna alternativa temporal que podamos implementar para que pueda continuar trabajando?",
  "Gracias por la información detallada. Me facilita mucho el trabajo. Ya estoy investigando y en breve le tendré una respuesta.",
];

/**
 * Comentarios de seguimiento para ser utilizados por los analistas para actualizar
 * al usuario sobre el progreso de la resolución de un ticket.
 */
export const ANALYST_FOLLOWUP_COMMENTS = [
  "He revisado a fondo el problema y encontré la causa. Estoy aplicando la solución en este momento. Debería estar listo en unos 30 minutos aproximadamente.",
  "Actualización: El equipo de seguridad está revisando su caso con prioridad alta. Esperamos tener novedades pronto. Le agradezco su paciencia.",
  "Después de analizar los logs, identificamos que el problema está relacionado con la última actualización. Estamos preparando un parche que debería resolver esta situación de manera definitiva.",
  "Hemos reproducido el error en nuestro entorno y estamos implementando una corrección que debería resolver el inconveniente. Haremos pruebas exhaustivas antes de confirmar la solución.",
  "Ya casi terminamos de resolver su caso. Estamos realizando pruebas finales para asegurar que todo funcione correctamente. En aproximadamente 20 minutos debería poder volver a trabajar normalmente.",
  "Estamos haciendo un seguimiento con el proveedor del servicio para solucionar este problema lo antes posible. Nos han indicado que están trabajando en una solución de su lado.",
  "He consultado con el equipo técnico y me confirman que es un problema conocido. La solución está programada para implementarse hoy en la tarde. Le notificaré cuando esté disponible.",
  "Hemos identificado la causa raíz y estamos implementando una solución permanente para evitar que vuelva a ocurrir. Agradecemos su paciencia durante este proceso.",
  "Gracias por su respuesta. Con esa información adicional ya pude identificar mejor el problema. Estoy implementando los cambios necesarios en este momento.",
  "Disculpe la demora en mi respuesta. Estuve trabajando con el equipo de infraestructura para resolver su caso. Tengo buenas noticias, estamos en la fase final de la solución.",
  "Acabo de probar algunas configuraciones diferentes y parece que encontramos la solución. Voy a implementarla en su equipo ahora mismo si me lo permite.",
  "¿Le parece si programamos una breve llamada? Creo que podríamos resolver esto más rápido si puedo ver directamente lo que está ocurriendo. Tengo disponibilidad en los próximos 30 minutos.",
];

/**
 * Comentarios utilizados por los analistas al marcar un ticket como resuelto.
 * Estos comentarios explican la solución aplicada.
 */
export const RESOLUTION_COMMENTS = [
  "He implementado la solución necesaria y realizado pruebas exhaustivas. El problema ha sido resuelto. Por favor confirme si todo funciona correctamente ahora. No dude en contactarnos si surge algún inconveniente adicional.",
  "Después de aplicar los cambios recomendados por el equipo técnico, el sistema está funcionando normalmente. Por favor verifique y confirme. Estaré atento por si necesita alguna aclaración adicional.",
  "Hemos restablecido los permisos de su cuenta y corregido la configuración que causaba el problema. Por favor intente acceder nuevamente y confirme que todo funciona como esperaba. En caso contrario, no dude en responder a este ticket.",
  "El problema ha sido resuelto mediante la instalación de un parche de seguridad. Recomendamos reiniciar su equipo para completar el proceso. Después de reiniciar, todas las funcionalidades deberían estar disponibles nuevamente.",
  "Hemos solucionado el inconveniente reportado. La causa fue un conflicto con una actualización reciente que ya ha sido corregido en el servidor. El sistema debería responder correctamente a partir de ahora.",
  "Problema resuelto. Se trataba de un error temporal en el servidor de autenticación que ya ha sido corregido por el equipo de infraestructura. Agradecemos su paciencia durante este proceso.",
  "Hemos completado las correcciones necesarias en su perfil de usuario. Por favor intente acceder nuevamente y confirme que todo funciona correctamente. Si tiene alguna duda adicional, estamos a su disposición.",
  "La solución ha sido implementada exitosamente. El error fue causado por datos corruptos en la caché que hemos limpiado completamente. Recomendamos realizar esta limpieza periódicamente para evitar futuros inconvenientes.",
  "¡Buenas noticias! Hemos podido solucionar completamente el problema reportado. La causa principal era un conflicto entre la última actualización y su configuración específica. Todo debería funcionar correctamente ahora.",
  "Acabo de implementar la solución definitiva. Estuve haciendo varias pruebas y el sistema responde perfectamente en todas ellas. Por favor, intente utilizar nuevamente la aplicación y confirme si todo está funcionando como esperaba.",
  "El equipo de desarrollo acaba de lanzar una corrección que resuelve este problema específico. Ya la hemos aplicado en su caso y debería estar funcionando correctamente. Agradecemos su comprensión y paciencia.",
  "Después de un análisis profundo, identificamos que el problema estaba relacionado con un componente de seguridad que bloqueaba ciertas funciones. Lo hemos reconfigurando manteniendo la seguridad pero permitiendo su operación normal.",
];

/**
 * Comentarios predefinidos para ser utilizados por los empleados (usuarios)
 * al responder a un analista o al interactuar inicialmente con un ticket.
 */
export const USER_COMMENTS = [
  "Gracias por la rápida respuesta. Estaré atento a la solución. Este problema está afectando bastante mi trabajo diario.",
  "Muchas gracias por la atención. El problema es urgente, espero puedan resolverlo pronto. Tengo una entrega importante mañana.",
  "Agradezco su ayuda. He verificado y efectivamente el problema persiste. Quedo atento a sus indicaciones. ¿Hay algo más que pueda hacer mientras tanto?",
  "Gracias por avisarme. Necesito una solución urgente ya que esto está afectando mi trabajo diario. No puedo avanzar con las tareas asignadas por este problema.",
  "Les agradezco la atención. ¿Tienen alguna estimación de cuánto tiempo tomará resolver este inconveniente? Necesito organizar mi agenda en consecuencia.",
  "Muchas gracias. Intenté lo que me sugirieron pero sigue fallando. ¿Hay algo más que pueda intentar mientras tanto? Estoy contra el tiempo con este proyecto.",
  "Gracias por la pronta respuesta. Les confirmo que probaré la solución que me indican y les avisaré el resultado. Espero que funcione esta vez.",
  "Agradezco su gestión. Este problema está afectando a varios compañeros de mi departamento también. Sería bueno una solución que aplique para todos nosotros.",
  "Entiendo, gracias por explicarme. Voy a esperar su solución. Por favor manténganme informado de cualquier avance, es bastante importante para mí.",
  "Perfecto, muchas gracias por su atención. Mientras tanto seguiré trabajando con la solución temporal que me sugirieron, aunque es bastante incómoda.",
  "Comprendo la situación. Esperaré su respuesta entonces. Por favor, si necesitan más información de mi parte no duden en pedirla.",
  "Qué bueno que ya están trabajando en ello. La verdad es que me tiene bastante estresado este problema, ojalá se pueda resolver pronto.",
];

/**
 * Comentarios de seguimiento para ser utilizados por los empleados (usuarios)
 * para solicitar actualizaciones sobre el estado de sus tickets.
 */
export const USER_FOLLOWUP_COMMENTS = [
  "Quería consultar si hay alguna novedad sobre mi caso. Ya pasaron dos días y sigo con el mismo problema. Está afectando seriamente mi productividad.",
  "Solo escribo para saber cómo va la solución de mi ticket. Necesito una actualización por favor. No he recibido información desde ayer.",
  "¿Hay algún avance con la solución? Este problema está retrasando la entrega de mi informe mensual y mi jefe ya está preguntando por él.",
  "Actualización: Ahora el error aparece con más frecuencia. ¿Podemos acelerar la resolución? Cada vez es más difícil trabajar así.",
  "Escribo nuevamente porque el problema persiste. ¿Necesitan información adicional de mi parte? Estoy disponible para cualquier prueba que necesiten realizar.",
  "Pasó un día y no he recibido actualizaciones. ¿Podrían indicarme en qué estado está mi solicitud? Necesito planificar mi trabajo de los próximos días.",
  "Quería confirmar si recibieron mi respuesta anterior con los detalles solicitados para resolver el problema. No he tenido noticias desde entonces.",
  "Disculpen la insistencia, pero este problema me está generando muchos retrasos. ¿Hay alguna forma de darle prioridad a mi caso?",
  "Buenos días. Sigo a la espera de una solución para mi caso. ¿Han podido avanzar en algo? Estoy disponible si necesitan que haga alguna verificación.",
  "El problema sigue presente y ahora está afectando también otras aplicaciones. ¿Hay alguna novedad sobre la solución?",
  "Hola de nuevo. Quería saber si necesitan que les envíe algún tipo de log o información adicional para resolver mi caso. Estoy dispuesto a colaborar con lo que sea necesario.",
  "Acabo de intentarlo nuevamente y sigue sin funcionar. ¿Tienen alguna estimación de cuándo estará resuelto? Necesito darle una respuesta a mi supervisor.",
];

/**
 * Comentarios utilizados por los empleados (usuarios) al aceptar la resolución
 * de un ticket y marcarlo como cerrado.
 */
export const USER_CLOSURE_COMMENTS = [
  "Confirmo que la solución funciona perfectamente. Muchas gracias por su ayuda y profesionalismo. Ha sido un excelente servicio.",
  "¡Problema resuelto! Gracias por la asistencia y la rápida solución. Ahora puedo continuar con mi trabajo normalmente. Se los agradezco mucho.",
  "Todo funciona correctamente ahora. Agradezco mucho su tiempo y dedicación para resolver este inconveniente. Ha sido una atención excelente.",
  "Excelente servicio. El sistema ya funciona normalmente, gracias por resolverlo tan rápido. Lo probaré durante el día y les aviso si surge algo más.",
  "Confirmo que ya puedo trabajar normalmente. Muchas gracias por la asistencia brindada y por mantenerme informado durante todo el proceso.",
  "La solución fue efectiva. Ya puedo continuar con mis actividades sin problemas. Gracias por el seguimiento y la dedicación a mi caso.",
  "Todo en orden ahora. Agradezco la rapidez y profesionalismo en la atención. Espero no molestarlos pronto con otro problema, jaja.",
  "Ya está funcionando todo perfecto. Muchas gracias por su ayuda. La solución fue más rápida de lo que esperaba y eso me ha permitido recuperar el tiempo perdido.",
  "Problema solucionado. Les agradezco enormemente su atención y paciencia. El sistema funciona incluso mejor que antes.",
  "Confirmado, todo está funcionando correctamente ahora. Muchas gracias por su eficiencia y por explicarme la causa del problema. Ahora entiendo qué pasó.",
  "¡Perfecto! La solución implementada resolvió completamente el problema. Gracias por su atención y profesionalismo. Espero no tener que molestarlos pronto.",
  "Muchas gracias, efectivamente el problema está resuelto. Aprecio mucho la rapidez con la que atendieron mi caso a pesar de ser viernes por la tarde.",
];

/**
 * Razones predefinidas para ser utilizadas cuando un analista bloquea un ticket,
 * indicando por qué el ticket no puede progresar temporalmente.
 */
export const LOCK_REASONS = [
  "Estamos a la espera de una respuesta del proveedor externo para continuar con la solución. Hemos escalado el caso con prioridad alta.",
  "Este caso requiere una actualización de firmware que está programada para el próximo mantenimiento. Nos comprometemos a resolver su caso tan pronto esté disponible la actualización.",
  "Caso en espera - Aguardando autorización de seguridad para implementar la solución debido a los protocolos establecidos en nuestra política de seguridad.",
  "Pendiente de respuesta del usuario para continuar con el diagnóstico. Hemos enviado un correo adicional solicitando la información necesaria.",
  "Ticket en pausa mientras se implementa la solución definitiva en el próximo despliegue programado para este jueves a las 22:00 horas.",
  "En espera de aprobación por parte del departamento de seguridad para continuar. El caso ha sido presentado con carácter prioritario dada la urgencia manifestada.",
  "Caso bloqueado temporalmente mientras se resuelve un problema en el servidor principal relacionado. El equipo de infraestructura está trabajando activamente en ello.",
  "Esperando la llegada del componente de hardware necesario para la sustitución. El pedido ya está en proceso con entrega estimada para mañana.",
  "Ticket en pausa por solicitud del usuario hasta su regreso de vacaciones el próximo lunes. Retomaremos entonces la solución.",
  "Caso en espera mientras el equipo de desarrollo analiza la posible modificación del código fuente para resolver este problema específico.",
  "Esperando confirmación de la matriz para implementar el cambio solicitado, ya que afecta a sistemas críticos de la organización.",
  "Ticket bloqueado temporalmente mientras se coordina una ventana de mantenimiento adecuada para implementar la solución sin afectar a otros usuarios.",
];

/**
 * Comentarios predefinidos para ser utilizados al asignar un ticket a un analista.
 */
export const ASSIGN_COMMENTS = [
  "Asignando ticket al especialista correspondiente para su análisis y pronta resolución.",
  "Redirigiendo caso al analista con experiencia en este tipo de incidencias para su atención.",
  "Ticket asignado al técnico especializado en esta categoría de problemas.",
  "Derivando el caso al área correspondiente para su evaluación y resolución.",
  "Asignando incidencia al equipo técnico especializado en este tipo de situaciones.",
  "Ticket en proceso de asignación al analista con conocimientos específicos en el área.",
  "Canalizando su solicitud al especialista adecuado para brindarle la mejor atención.",
  "Caso dirigido al analista con experiencia en la resolución de este tipo de problemas.",
  "Asignando su caso a un técnico que ha resuelto situaciones similares anteriormente.",
  "Su ticket ha sido asignado al especialista del área para su pronta atención.",
];

/**
 * Textos de comentarios genéricos organizados por rol (analista, empleado) y
 * tipo de comentario (inicial, seguimiento, cierre).
 * Puede ser útil como fallback o para situaciones muy genéricas.
 */
export const COMMENT_TEXTS = {
  analyst: {
    initial: [
      'Estimado usuario, hemos recibido su solicitud y estamos revisando el caso.',
      'Gracias por reportar el inconveniente, procederé a analizarlo.',
      'He recibido su ticket y comenzaré la revisión en breve.'
    ],
    followup: [
      '¿Podría proporcionar más detalles sobre el problema?',
      'Estamos trabajando en su caso, le avisaremos cualquier novedad.',
      'Seguimos investigando la incidencia, gracias por su paciencia.'
    ],
    closure: [
      'El ticket ha sido resuelto, por favor confirme si todo está correcto.',
      'Damos por cerrado el caso, quedamos atentos a cualquier otra consulta.',
      'La incidencia fue solucionada, gracias por contactarnos.'
    ]
  },
  employee: {
    initial: [
      'Tengo un problema con el sistema, agradecería su ayuda.',
      'No puedo acceder a mi cuenta, ¿pueden ayudarme?',
      'Solicito soporte para resolver un inconveniente.'
    ],
    followup: [
      'Adjunto la información solicitada.',
      'Sigo teniendo el mismo problema, ¿alguna novedad?',
      '¿Hay algún avance con mi caso?'
    ],
    closure: [
      'Gracias, el problema ha sido resuelto.',
      'Confirmo que ya funciona correctamente.',
      'Todo está en orden, pueden cerrar el ticket.'
    ]
  }
};
