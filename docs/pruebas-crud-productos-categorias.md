# Pruebas CRUD - Productos y Categorías (Sprint 2B)

Este documento detalla los casos de prueba a ejecutar en el entorno local antes del pase a producción.

## Pre-requisitos de Prueba
1. `NEXT_PUBLIC_DATA_SOURCE=static`
2. `ADMIN_WRITES_ENABLED=false`

## Casos de Prueba - Modo Solo Lectura (Actual)
- [ ] Entrar a `/admin/categorias` y confirmar que carga la lista desde Supabase.
- [ ] Buscar una categoría específica y confirmar filtro en cliente.
- [ ] Entrar a `/admin/productos` y confirmar que cargan los 14 productos sembrados.
- [ ] Probar cambiar estado, editar, eliminar o crear en ambos módulos.
- [ ] Confirmar visualización del mensaje: *"Las escrituras administrativas todavía no están habilitadas..."* sin romper la app.

## Casos de Prueba - Modo Escritura (Al habilitar `ADMIN_WRITES_ENABLED=true`)
1. **Categorías**:
   - Crear nueva categoría (Slug único).
   - Editar categoría existente (Nombre, Imagen).
   - Eliminar categoría vacía (Debería ser exitoso).
   - Eliminar categoría con productos (Debería fallar con el mensaje de restricción).
2. **Productos**:
   - Crear producto con 3 escalas de precio y 2 características.
   - Guardar y verificar que aparezca en el listado.
   - Editar el producto, agregar una especificación y borrar una imagen. Guardar y verificar.
   - Duplicar el producto. Comprobar que el clon aparece inactivo y con el sufijo "copia-xxxx".
   - Cambiar estado a inactivo en el clon.
   - Eliminar el clon.
3. **Validación Pública**:
   - Durante todas las pruebas anteriores, navegar a `localhost:3000/productos` y confirmar que nada se ha alterado y los datos estáticos siguen primando.
