# Guía: Cómo Integrar un Nuevo Commodity List

Esta guía detalla el proceso estándar y las mejores prácticas para agregar un nuevo commodity al sistema, basándose en el historial de integraciones (como la de Canadian Beef).

## Pasos para la Implementación Completa

1. **Gestión de Recursos Multimedia (Imágenes)**
   - Si recibes un folder externo con los recursos para el nuevo commodity del cliente, lo primero es reubicar esos recursos al directorio público del framework `Next.js`.
   - Crea un nuevo subdirectorio bajo `public/images/`: `C:\Users\HOMEPC\Desktop\JULISSA\public\images\[slug-del-commodity]`.
   - Copia todas las imágenes desde la fuente externa a este folder público. 
   - *Nota Importante*: Mantén el nombre real (por ejemplo, con espacios) de las imágenes como aparecen en filesystem, ya que ese nombre es el que debe coincidir dentro de Next.js.

2. **Creación de la Página del Commodity**
   - Crea `src/app/commodities/[slug-del-commodity]/page.tsx` utilizando la misma estructura visual (Tailwind y componentes) que los commodities preexistentes (`beef`, `pork`, etc.).
   - Utiliza la fuente más verídica (como el `index.html` original en caso de que existan varios archivos JSON) para extraer la data base (ID, nombre, descripción y filename).
   - **Mejor Práctica**: Ya no se recomiendan los archivos JSON en `/src/data/commodities`. Extrae y *hardcodea* directamente la lista de productos como un arreglo de objetos en `page.tsx`.
   - Al cargar las imágenes dinamicamente desde `public/` usando el componente `next/image` y codificándolas (`encodeURIComponent(product.filename)`), asegúrate de que exista correspondencia exacta nombre-espacios.

3. **Inclusión en el Buscador / Formulario de Cotización**
   - Archivo Pripcipal: `src/components/jhi/ContactSection.tsx`
   - Agrega tu nuevo slug al objeto `commodityCatalog`.
   - El valor de este nuevo slug debe ser un arreglo que contenga exactamente los mismos nombres (strings) de los productos definidos en el listado del paso 2. Esto poblará automáticamente los sub-selects dinámicos al escoger la categoría principal.

4. **Integración de Navegación del Catálogo Principal**
   - Archivo Principal: `src/components/jhi/CommoditiesSection.tsx`
   - Navega a los listados de la constante `commodities` y agrégale o modifica la propiedad `href: '/commodities/[slug-del-commodity]'` en la tarjeta correspondiente. Esto habilitará el cliqueo visual desde el Landing Page hacia la nueva ruta implementada.

5. **Limpieza Final**
   - Una vez comprobada la carga de imágenes, importación y flujos de navegación, no olvides eliminar las carpetas/archivos de recursos crudos externos (ej. la carpeta en el escritorio que sirvió de fuente original de datos) para mantener el proyecto limpio.
