# FerreArt - Tienda Online con Next.js y Supabase

## 📋 Descripción del Proyecto
FerreArt es una plataforma de comercio electrónico desarrollada con Next.js y Supabase que permite a los usuarios explorar productos y a los administradores gestionar el inventario de forma eficiente. La aplicación incluye autenticación por roles, un panel de administración completo y una API robusta.

## 🚀 Características Implementadas

### 1. Autenticación y Roles
- ✅ **Inicio de sesión seguro** con Supabase Auth.
- ✅ **Protección de rutas** basada en roles (solo los `admin` pueden acceder al dashboard).
- ✅ **Contexto de autenticación** para gestionar el estado del usuario en toda la aplicación.

### 2. Gestión de Productos (Panel de Admin)
- ✅ **CRUD Completo**: Creación, lectura, actualización y eliminación de productos a través de la interfaz.
- ✅ **Múltiples Imágenes**: Soporte para hasta 5 imágenes por producto, con subida y gestión en **Supabase Storage**.
- ✅ **Edición Avanzada**: Formularios para editar todos los detalles del producto, incluyendo la adición o eliminación de imágenes existentes.
- ✅ **Listado Paginado**: La tabla de productos muestra los resultados en páginas para un rendimiento óptimo con grandes volúmenes de datos.
- ✅ **Filtros y Búsqueda**:
    - Búsqueda en tiempo real por nombre o SKU.
    - Filtro dinámico por categoría de producto.
    - Filtro por estado de stock (En Stock / Agotado).
- ✅ **Rutas Protegidas**: Todas las funcionalidades de gestión de productos son exclusivas para usuarios con el rol de `admin`.

## 🛠️ Estructura del Proyecto

```
src/
├── app/
│   ├── (public-routes)/      # Rutas de acceso público
│   │   └── login/            # Página de inicio de sesión
│   ├── dashboard/            # Panel de administración (protegido)
│   │   └── products/
│   │       ├── new/          # Página para crear producto
│   │       └── edit/[id]/    # Página para editar producto
│   └── api/                  # Rutas de la API
│       ├── products/
│       │   ├── [id]/         # API para un producto específico (GET, PUT, DELETE)
│       │   └── categories/   # API para obtener todas las categorías
│       └── ...
├── context/                  # Contextos de React
│   └── auth-context.tsx      # Contexto para gestionar la autenticación
└── ...
```

## 💻 Tecnologías Utilizadas

- **Frontend**:
  - Next.js 14 (App Router)
  - React 18 & TypeScript
  - Tailwind CSS para el diseño
- **Backend & Base de Datos**:
  - Supabase (Auth, PostgreSQL, Storage)
  - Next.js API Routes para la lógica de servidor
  - Zod para validación de esquemas

## ⚙️ Configuración del Entorno

1.  **Variables de Entorno**
    Crea un archivo `.env.local` en la raíz del proyecto con tus credenciales de Supabase:
    ```
    NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
    NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
    SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio_de_supabase
    ```

2.  **Instalación de Dependencias**
    ```bash
    npm install
    ```

3.  **Ejecutar en Desarrollo**
    ```bash
    npm run dev
    ```
    La aplicación estará disponible en `http://localhost:3000`.

## 🔒 Base de Datos

La tabla principal para esta funcionalidad es `products`, que incluye campos como `name`, `sku`, `category`, `stock`, y un campo `images` de tipo `text[]` para almacenar los URLs de las imágenes.
   - `full_name` (text)
   - `avatar_url` (text, nullable)
   - `created_at` (timestamp)
   - `updated_at` (timestamp)

2. **resellers**
   - `id` (uuid, PK)

---

## 🛡️ Seguridad, Validación y Organización Backend (Resumen)

### 🔐 Middleware de Autenticación y Autorización
- Middleware `requireAuth` reutilizable para proteger endpoints sensibles.
- Verifica JWT y rol del usuario (`admin`, `reseller`, etc.).
- Solo permite acceso a recursos según el rol.
- Aplicado en todos los endpoints protegidos de `/api` (productos, usuarios, pedidos).

### ✅ Validación de Datos con Zod
- Todas las rutas sensibles usan validación estricta con Zod.
- Esquemas en `src/backFerre/types/zod-schemas.ts` para productos, usuarios y pedidos.
- Convierte campos opcionales a `null` para evitar errores de tipo y cumplir con la base de datos.

### 📦 CRUD de Productos
- Endpoints:
  - `GET /api/products` — Listar productos
  - `POST /api/products` — Crear producto
  - `PATCH /api/products/:id` — Editar producto
  - `DELETE /api/products/:id` — Eliminar producto
- Lógica centralizada en `product-service.ts`.
- Validación y protección de roles en todos los endpoints.

### 👥 CRUD de Usuarios (solo admin)
- Endpoints:
  - `GET /api/users` — Listar usuarios
  - `POST /api/users` — Crear usuario
  - `PATCH /api/users/:id` — Editar usuario
  - `DELETE /api/users/:id` — Eliminar usuario
- Solo accesible por administradores.
- Usa `user-service.ts` y validación con Zod.

### 🛒 CRUD de Pedidos
- Endpoints:
  - `POST /api/orders` — Crear pedido (público, sin login)
  - `GET /api/orders` — Listar pedidos (admin/reseller)
  - `GET /api/orders/:id` — Ver detalle
  - `PATCH /api/orders/:id` — Editar pedido (admin)
  - `DELETE /api/orders/:id` — Eliminar pedido (admin)
- Lógica en `order-service.ts`.
- Validación con Zod.
- Permite pedidos de consumidores finales y revendedores.
- **Email automático**: Cada pedido genera un email al admin y una confirmación al cliente.

### 🧩 Organización Modular
- Código backend organizado por funcionalidad:
  - `/api/products`, `/api/users`, `/api/orders`, `/api/auth`
  - Servicios: `product-service.ts`, `user-service.ts`, `order-service.ts`, `auth-service.ts`
- Todos los servicios usan `lib/supabase-client.ts` para conexión uniforme.

### 🐞 Manejo de Errores
- Uso de try/catch y manejo robusto de errores en endpoints y servicios.
- Respuestas claras y seguras ante errores de validación o permisos.

### 📬 Emails Automáticos
- Integración con Gmail vía Nodemailer.
- Variables de entorno para credenciales de email.
- Plantillas HTML personalizadas para notificar a admin y cliente por cada pedido.

### 🧪 Pruebas y Documentación
- Endpoints listos para ser probados con Postman o herramientas similares.
- Documentación en este README y sugerencia de agregar colección Postman y/o Swagger.

---

## 📚 Ejemplos de uso de la API

### Productos

#### Crear producto
```http
POST /api/products
Content-Type: application/json
Authorization: Bearer <TOKEN_ADMIN>

{
  "nombre": "Martillo",
  "precio": 100,
  "stock": 20,
  "categoria": "Herramientas",
  "codigo": "H001",
  "descripcion": "Martillo de acero",
  "precio_compra": 60
}
```
**Respuesta:**
```json
{
  "id": "abc123",
  "nombre": "Martillo",
  "precio": 100,
  "stock": 20,
  "categoria": "Herramientas",
  "codigo": "H001",
  "descripcion": "Martillo de acero",
  "precio_compra": 60,
  "imagen_url": null
}
```

#### Listar productos
```http
GET /api/products
Authorization: Bearer <TOKEN_RESELLER>
```
**Respuesta:**
```json
[
  { "id": "abc123", "nombre": "Martillo", ... },
  { "id": "def456", "nombre": "Destornillador", ... }
]
```

### Usuarios (solo admin)

#### Crear usuario
```http
POST /api/users
Content-Type: application/json
Authorization: Bearer <TOKEN_ADMIN>

{
  "email": "nuevo@correo.com",
  "password": "12345678",
  "full_name": "Nuevo Usuario",
  "role": "reseller"
}
```
**Respuesta:**
```json
{
  "id": "user789",
  "email": "nuevo@correo.com",
  "full_name": "Nuevo Usuario",
  "role": "reseller"
}
```

### Pedidos

#### Crear pedido (público, sin login)
```http
POST /api/orders
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "email": "juan@mail.com",
  "telefono": "1122334455",
  "shipping_address": "Calle Falsa 123",
  "payment_method": "Efectivo",
  "total": 2500,
  "items": [
    { "product_id": 1, "quantity": 2, "price": 1000 },
    { "product_id": 2, "quantity": 1, "price": 500 }
  ],
  "observaciones": "Entregar por la tarde"
}
```
**Respuesta:**
```json
{
  "success": true,
  "order": {
    "id": "pedido_123",
    "nombre": "Juan Pérez",
    "email": "juan@mail.com",
    "total": 2500,
    ...
  }
}
```

---

## 📦 Carga masiva de imágenes por SKU (asociación automática)

Permite subir muchas imágenes de productos y asociarlas automáticamente según el SKU/código del producto. Ideal para actualizar fotos de catálogo de forma rápida y ordenada.

### ¿Cómo funciona?
1. Prepara tus imágenes: cada archivo debe llamarse igual que el SKU/código del producto (ejemplo: `H001.jpg`, `A123.png`).
2. Desde el panel (o Postman), sube todas las imágenes usando el endpoint:
   - `POST /api/products/upload-images` (requiere rol admin o reseller)
   - Tipo de request: `multipart/form-data` (campo: `files`)
3. El backend:
   - Sube cada imagen a Supabase Storage (bucket `product-images`)
   - Busca el producto por el SKU (nombre del archivo sin extensión)
   - Si lo encuentra, actualiza el campo `imagen_url` con la URL pública
   - Devuelve un resumen de éxito/error por cada imagen

### Ejemplo de uso (Postman o Thunder Client)
- Selecciona método `POST`, URL `/api/products/upload-images`
- En "Body", elige `form-data`, clave: `files`, tipo: `File`, y agrega varias imágenes
- Agrega el header `Authorization: Bearer <TOKEN_ADMIN_O_RESELLER>`

**Respuesta:**
```json
{
  "results": [
    {
      "file": "H001.jpg",
      "sku": "H001",
      "success": true,
      "productId": "abc123",
      "imageUrl": "https://.../product-images/H001.jpg"
    },
    {
      "file": "Z999.jpg",
      "sku": "Z999",
      "success": false,
      "error": "Producto no encontrado"
    }
  ]
}
```

---

## 📥 Importación masiva de lista de precios (Excel)

Permite actualizar o cargar productos en lote a partir de un archivo Excel. Ideal para actualizar precios y stock de forma rápida.

### ¿Cómo funciona?
1. Prepara un archivo Excel (`.xlsx`) con columnas como:
   - `codigo` (SKU), `nombre`, `precio`, `stock`, `categoria`, `descripcion`, etc.
2. Desde el panel (o Postman), sube el archivo usando el endpoint:
   - `POST /api/products/import` (requiere rol admin)
   - Tipo de request: `multipart/form-data` (campo: `file`)
3. El backend:
   - Lee el archivo Excel y valida cada fila con Zod
   - Si el producto existe (por `codigo`), lo actualiza
   - Si no existe, lo crea
   - Devuelve un resumen de filas exitosas, errores y cambios aplicados

### Ejemplo de uso (Postman o Thunder Client)
- Método `POST`, URL `/api/products/import`
- "Body" → `form-data`, clave: `file`, tipo: `File`, selecciona tu Excel
- Header: `Authorization: Bearer <TOKEN_ADMIN>`

**Respuesta:**
```json
{
  "success": true,
  "updated": 12,
  "created": 3,
  "errors": [
    { "row": 5, "error": "Falta el campo precio" },
    { "row": 8, "error": "SKU duplicado" }
  ]
}
```

---

## 📑 Gestión de compras de inventario y control de stock/ganancias

### Registrar una compra (entrada de stock)
- **Endpoint:** `POST /api/purchases` _(solo admin)_
- **Body ejemplo:**
```json
{
  "fecha": "2025-06-23",
  "proveedor": "Ferretería Mayorista",
  "productos": [
    { "codigo": "H001", "cantidad": 10, "costo_unitario": 60 },
    { "codigo": "A123", "cantidad": 5, "costo_unitario": 200 }
  ],
  "observaciones": "Compra mensual"
}
```
- **Efecto:**
  - Suma la cantidad al stock actual de cada producto.
  - Actualiza el campo `precio_compra` si el costo cambió.
  - Registra la compra en la tabla `purchases` y cada ítem en `purchase_items`.

### Consultar historial de compras
- **Endpoint:** `GET /api/purchases` _(solo admin)_
- Devuelve lista de compras con detalles (fecha, proveedor, productos, total, observaciones).

### Control automático de stock por ventas/pedidos
- Cada vez que se crea un pedido (`POST /api/orders`), el sistema descuenta automáticamente el stock de cada producto vendido.
- Si el stock es insuficiente, rechaza el pedido o descuenta solo lo disponible (según la lógica de negocio).

### Ganancias y estadísticas
- **Ganancia por venta:**
  - Se calcula como: `(precio de venta - precio_compra) * cantidad vendida` para cada producto.
- **Endpoint:** `GET /api/stats/ganancias`
  - Devuelve ganancias totales, por producto, y productos más vendidos.
  - Puedes filtrar y analizar la rentabilidad de tu negocio fácilmente.

#### Ejemplo de uso (Postman o navegador)
- Método: `GET`
- URL: `/api/stats/ganancias`
- (Opcional: puedes protegerlo solo para admin agregando autenticación)

#### Ejemplo de respuesta
```json
{
  "total_ganancias": 35000,
  "productos": [
    { "codigo": "H001", "nombre": "Martillo", "ganancia": 12000, "vendidos": 40 },
    { "codigo": "A123", "nombre": "Destornillador", "ganancia": 8000, "vendidos": 20 }
  ]
}
```

---

    - `user_id` (uuid, FK a auth.users)
    - `business_name` (text, nullable)
    - `tax_id` (text)
   - `tax_regime` (text)
   - `status` (text)
   - `created_at` (timestamp)
   - `updated_at` (timestamp)

3. **products**
   - `id` (uuid, PK)
   - `name` (text)
   - `description` (text, nullable)
   - `price` (numeric)
   - `stock` (integer)
   - `category_id` (uuid, FK a categories)
   - `is_active` (boolean)
   - `created_at` (timestamp)
   - `updated_at` (timestamp)

## 🔄 Flujos de Trabajo

### Registro de Revendedor
1. El usuario completa el formulario de registro
2. Se valida la información y se crea la cuenta en Supabase Auth
3. Se crea un perfil en la tabla `profiles`
4. Se crea un registro en la tabla `resellers`
5. Se envía un correo de verificación
6. El administrador debe aprobar la cuenta

### Inicio de Sesión
1. El usuario ingresa email y contraseña
2. Se valida la autenticación con Supabase
3. Se redirige según el rol del usuario
   - Admin: `/admin`
   - Revendedor: `/revendedor`
   - Usuario sin rol: `/`

## 🚧 Próximos Pasos

### Mejoras Pendientes
- [ ] Implementar sistema de pedidos
- [ ] Panel de administración completo
- [ ] Dashboard de revendedor con estadísticas
- [ ] Integración con pasarela de pago
- [ ] Sistema de notificaciones
- [ ] Página de perfil de usuario
- [ ] Búsqueda y filtrado de productos

## 📝 Notas de Desarrollo

### Problemas Conocidos
- La verificación de correo electrónico requiere configuración adicional en Supabase
- Algunos tipos TypeScript pueden necesitar ajustes según la estructura exacta de la base de datos

### Dependencias Principales
- `@supabase/supabase-js`: Cliente de Supabase
- `@supabase/auth-helpers-nextjs`: Utilidades de autenticación
- `react-hook-form`: Manejo de formularios
- `yup`: Validación de esquemas
- `@hookform/resolvers`: Integración entre react-hook-form y yup

## 📄 Licencia
Este proyecto está bajo la licencia MIT.
