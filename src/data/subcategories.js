// src/data/subcategories.js

/**
 * Array de subcategorías de tickets disponibles en el sistema de Mesa de Servicios.
 * Cada objeto de subcategoría contiene un ID único y un nombre descriptivo.
 * Estos IDs son necesarios al crear nuevos tickets para su correcta clasificación.
 */
const subcategories = [
  { id: "0a497798-9ba7-41c3-8f35-7e47b7161c30", name: "Bloqueo de usuario" },
  { id: "608c2b72-faa6-436b-bbda-ff9f0b5912e3", name: "Alerta de Antivirus" },
  { id: "93867388-877f-43db-bc27-ea0687b7a805", name: "Correo malicioso" },
  { id: "ff516ae1-90d2-4602-a9c3-588e7b01bc47", name: "Problemas de navegacion" },
  { id: "818c5de3-b03d-4ecc-bd1b-a5751441fd1f", name: "Error de login" },
  { id: "30bdd121-fffc-490a-a2cc-0c97a7a5e178", name: "Error de ingreso" },
  { id: "44f816fc-a244-4375-96ba-7c19fa08261b", name: "Error de la pagina" },
  { id: "b0aa08c9-6f96-425b-a583-8ce002708d57", name: "Errores generales (Aplicaciones)" },
  { id: "ec3fe74d-40c7-4c34-b789-daec29364118", name: "Errores generales (Equipos)" },
  { id: "694f8b5c-fcc4-48d2-beaf-943e4af17f3d", name: "Errores generales (Datacredito)" },
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
