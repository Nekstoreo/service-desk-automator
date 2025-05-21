// src/data/knowledgeBaseContent.js

/**
 * Definiciones para las categorías de la Base de Conocimientos (KB).
 * Cada objeto contiene el nombre y la descripción de la categoría.
 */
export const KB_CATEGORIES = [
  {
    name: 'Configuración de Correo',
    description: 'Guías y soluciones para configurar clientes de correo electrónico corporativo.'
  },
  {
    name: 'Problemas de Red',
    description: 'Solución de incidencias y guías para problemas de conectividad y VPN.'
  },
  {
    name: 'Software Empresarial',
    description: 'Documentación y ayuda sobre aplicaciones empresariales utilizadas en la organización.'
  },
  {
    name: 'Hardware y Periféricos',
    description: 'Soporte y procedimientos para equipos, impresoras y otros periféricos.'
  },
  {
    name: 'Seguridad Informática',
    description: 'Buenas prácticas, alertas y procedimientos de seguridad TI.'
  }
];

/**
 * Definiciones para los artículos de la Base de Conocimientos (KB),
 * agrupados por el nombre de su categoría.
 * Cada artículo tiene un título, contenido y palabras clave.
 */
export const KB_ARTICLES = {
  'Configuración de Correo': [
    {
      title: 'Configurar Outlook con Exchange',
      content: `Guía paso a paso para configurar Outlook con Exchange en Windows y Mac. Incluye capturas de pantalla y recomendaciones de seguridad.\n\n1. Abre Outlook y selecciona "Agregar cuenta".\n2. Ingresa tu correo corporativo y sigue las instrucciones del asistente.\n3. Verifica la conexión y realiza una prueba de envío.\n4. Consulta el área de TI si encuentras errores de autenticación.\n5. Revisa las políticas de seguridad para contraseñas.`,
      keywords: ['outlook', 'exchange', 'correo']
    },
    {
      title: 'Configurar correo en dispositivos móviles',
      content: `Pasos para agregar tu cuenta de correo corporativo en Android y iOS.\n\n- Descarga la app de Outlook o usa la app nativa.\n- Ingresa tu usuario y contraseña.\n- Acepta los permisos de seguridad.\n- Sincroniza tu calendario y contactos.`,
      keywords: ['correo', 'móvil', 'configuración']
    },
    {
      title: 'Solución a errores comunes de envío/recepción',
      content: `Soluciones para los errores más frecuentes al enviar o recibir correos.\n\n- Verifica la conexión a Internet.\n- Revisa la configuración del servidor SMTP/IMAP.\n- Consulta el soporte si el problema persiste.`,
      keywords: ['errores', 'smtp', 'soporte']
    }
  ],
  'Problemas de Red': [
    {
      title: 'Solucionar conexión VPN',
      content: `Diagnóstico y solución para problemas de conexión VPN.\n\n- Verifica usuario y contraseña.\n- Reinstala el cliente VPN si es necesario.\n- Consulta logs para mensajes de error.\n- Contacta a soporte si el acceso sigue fallando.`,
      keywords: ['vpn', 'conexión', 'red']
    },
    {
      title: 'Restablecer red local',
      content: `Pasos para restablecer la red local en caso de pérdida de conectividad.\n\n- Reinicia el router y el equipo.\n- Ejecuta diagnósticos de red.\n- Comprueba cables y puntos de acceso.`,
      keywords: ['red', 'local', 'diagnóstico']
    },
    {
      title: 'Configurar Wi-Fi seguro',
      content: `Recomendaciones para configurar una red Wi-Fi segura en la oficina.\n\n- Cambia la contraseña por defecto.\n- Usa cifrado WPA2 o superior.\n- Limita el acceso a dispositivos autorizados.`,
      keywords: ['wifi', 'seguridad', 'oficina']
    }
  ],
  'Software Empresarial': [
    {
      title: 'Instalar y activar Office 365',
      content: `Guía para instalar y activar Office 365 en equipos corporativos.\n\n- Descarga desde el portal oficial.\n- Usa tu cuenta institucional para activar.\n- Consulta licencias disponibles con TI.`,
      keywords: ['office', 'licencia', 'instalación']
    },
    {
      title: 'Solución a errores de SAP',
      content: `Pasos para resolver errores comunes en SAP.\n\n- Revisa logs de error.\n- Reinicia el cliente SAP.\n- Contacta a soporte si el error persiste.`,
      keywords: ['sap', 'errores', 'soporte']
    },
    {
      title: 'Actualizar software empresarial',
      content: `Procedimiento para actualizar aplicaciones empresariales.\n\n- Consulta con TI antes de actualizar.\n- Realiza respaldo de información.\n- Sigue las instrucciones del instalador.`,
      keywords: ['actualización', 'software', 'empresa']
    }
  ],
  'Hardware y Periféricos': [
    {
      title: 'Instalar impresora de red',
      content: `Guía para instalar impresoras de red en Windows y Mac.\n\n- Descarga el driver adecuado.\n- Agrega la impresora desde configuración del sistema.\n- Realiza una impresión de prueba.`,
      keywords: ['impresora', 'driver', 'red']
    },
    {
      title: 'Solución a problemas de teclado y mouse',
      content: `Pasos para diagnosticar y solucionar fallos en teclado y mouse.\n\n- Revisa conexiones USB.\n- Cambia pilas si son inalámbricos.\n- Prueba en otro equipo.`,
      keywords: ['teclado', 'mouse', 'hardware']
    },
    {
      title: 'Configurar proyector en sala de reuniones',
      content: `Instrucciones para conectar y configurar proyectores.\n\n- Usa el cable adecuado (HDMI/VGA).\n- Selecciona la fuente correcta en el proyector.\n- Ajusta la resolución desde el equipo.`,
      keywords: ['proyector', 'sala', 'conexión']
    }
  ],
  'Seguridad Informática': [
    {
      title: 'Buenas prácticas de contraseñas',
      content: `Recomendaciones para crear y mantener contraseñas seguras.\n\n- Usa combinaciones de letras, números y símbolos.\n- Cambia tu contraseña periódicamente.\n- No compartas tus credenciales.`,
      keywords: ['contraseña', 'seguridad', 'prácticas']
    },
    {
      title: 'Detectar correos de phishing',
      content: `Cómo identificar y reportar correos electrónicos sospechosos.\n\n- Revisa el remitente y enlaces.\n- No descargues adjuntos de dudosa procedencia.\n- Reporta a TI cualquier sospecha.`,
      keywords: ['phishing', 'correo', 'alerta']
    },
    {
      title: 'Actualizar antivirus corporativo',
      content: `Pasos para mantener actualizado el antivirus institucional.\n\n- Verifica actualizaciones automáticas.\n- Realiza análisis periódicos.\n- Contacta a soporte si detectas amenazas.`,
      keywords: ['antivirus', 'actualización', 'protección']
    }
  ]
};
