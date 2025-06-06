// src/data/subcategories.js

/**
 * Array de subcategorías de tickets disponibles en el sistema de Mesa de Servicios.
 * Cada objeto de subcategoría contiene un ID único y un nombre descriptivo.
 * Estos IDs son necesarios al crear nuevos tickets para su correcta clasificación.
 */
const subcategories = [
  { id: "b2fec031-eb07-48e8-8fed-11d342589683", name: "Bloqueo de usuario" },
  { id: "091f7e27-8cf5-4f70-8dc2-53e69446f706", name: "Alerta de Antivirus" },
  { id: "436d0991-ecc7-4045-857a-55faf6203047", name: "Correo malicioso" },
  { id: "006fd7db-b4fd-4c05-861a-59fdc3d0c5be", name: "Problemas de navegacion" },
  { id: "67c21011-bc3b-4fdf-a984-abd3a1624934", name: "Error de login" },
  { id: "1df7faca-e205-4518-bf40-f7615c954e42", name: "Error del ingreso" },
  { id: "263dbaa2-1ddb-4f17-a9b8-9098f97111f9", name: "Error de la pagina" },
  { id: "464bf0fe-1120-4e71-985d-c5ce02978e16", name: "Errores generales (Aplicaciones)" },
  { id: "bee7dd33-79ef-4f5b-b3b4-db53c024b644", name: "Errores generales (Equipos)" },
  { id: "37edf541-79f3-43a8-af46-42312777b1c5", name: "Errores generales (Datacredito)" }
];

/**
 * Busca una subcategoría por su nombre.
 * @param {string} name - El nombre de la subcategoría a buscar.
 * @returns {Object | undefined} El objeto de la subcategoría si se encuentra, o undefined.
 */
export const getSubcategoryByName = (name) => {
  return subcategories.find(subcat => subcat.name.toLowerCase() === name.toLowerCase());
};

/**
 * Busca una subcategoría por su ID.
 * @param {string} id - El ID de la subcategoría a buscar.
 * @returns {Object | undefined} El objeto de la subcategoría si se encuentra, o undefined.
 */
export const getSubcategoryById = (id) => {
  return subcategories.find(subcat => subcat.id === id);
};

export default subcategories;
