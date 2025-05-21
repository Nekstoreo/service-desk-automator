// src/data/subcategories.js

/**
 * Array de subcategorías de tickets disponibles en el sistema de Mesa de Servicios.
 * Cada objeto de subcategoría contiene un ID único y un nombre descriptivo.
 * Estos IDs son necesarios al crear nuevos tickets para su correcta clasificación.
 */
const subcategories = [
  { id: "c96682f2-8e29-44d3-865a-6dd286303536", name: "Bloqueo de usuario" },
  { id: "8e175388-68fe-4dc1-b971-762a67b08c3e", name: "Alerta de Antivirus" },
  { id: "c8dccb84-17a7-4ede-a694-24a044a37aee", name: "Correo malicioso" },
  { id: "acb8bed3-8800-4559-ac78-2e3a27c376b9", name: "Problemas de navegacion" },
  { id: "79f23a5a-590c-4327-a6d4-a1465b32149c", name: "Error de login" },
  { id: "a243a18c-5c68-43db-a04d-09b6e085d3d7", name: "Error de ingreso" },
  { id: "19cf22e1-ae53-4780-bc93-b7dfc44c5ba4", name: "Error de la pagina" },
  { id: "2c43a9d7-3cad-4f94-80dc-57b7193e92c7", name: "Errores generales (Aplicaciones)" },
  { id: "7c052e28-3061-4d52-8ef9-8972d72bdc1a", name: "Errores generales (Equipos)" },
  { id: "325a3763-b1a5-4fca-af2b-b533c571b9cd", name: "Errores generales (Datacredito)" },
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
