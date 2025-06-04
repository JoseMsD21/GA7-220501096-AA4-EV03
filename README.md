# 🔐 Servicio Web de Autenticación

## GA7-220501096-AA4-EV03

Servicio web desarrollado para registro e inicio de sesión de usuarios con tecnologías modernas de seguridad.

## 🚀 Características

- ✅ Registro de usuarios con validación
- ✅ Inicio de sesión seguro
- ✅ Encriptación de contraseñas con bcrypt
- ✅ Autenticación con JSON Web Tokens (JWT)
- ✅ Validación de datos de entrada
- ✅ API RESTful
- ✅ Manejo de errores robusto

## 📋 Requisitos

- Node.js (versión 14 o superior)
- npm (gestor de paquetes de Node.js)

## 🛠️ Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/JoseMSD21/GA7-220501096-AA4-EV03.git
   cd GA7-220501096-AA4-EV03
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Crear archivo de variables de entorno (.env):**
   ```env
   PORT=3000
   JWT_SECRET=tu_clave_secreta_super_segura
   NODE_ENV=development
   ```

4. **Ejecutar el servidor:**
   ```bash
   npm start
   ```

## 📚 Endpoints de la API

### Registro de Usuario
```http
POST /api/registro
Content-Type: application/json

{
  "usuario": "juan123",
  "email": "juan@email.com",
  "password": "miPassword123"
}
```

### Inicio de Sesión
```http
POST /api/login
Content-Type: application/json

{
  "usuario": "juan123",
  "password": "miPassword123"
}
```

### Verificar Token
```http
GET /api/verificar-token
Authorization: Bearer tu_token_jwt_aqui
```

### Listar Usuarios (Solo desarrollo)
```http
GET /api/usuarios
```

## 🧪 Pruebas

1. **Abrir test.html** en un navegador web
2. **Asegurar** que el servidor esté corriendo en `http://localhost:3000`
3. **Probar** las funcionalidades desde la interfaz web

## 📁 Estructura del Proyecto

```
├── server.js           # Servidor principal con Express
├── package.json        # Dependencias y scripts
├── ejemplos-uso.js     # Ejemplos de implementación
├── test.html          # Página de pruebas
├── .env               # Variables de entorno (no incluido)
└── README.md          # Documentación
```

## 🔧 Tecnologías Utilizadas

- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **bcrypt** - Encriptación de contraseñas
- **jsonwebtoken** - Autenticación JWT
- **cors** - Manejo de CORS

## 📖 Documentación Adicional

Este proyecto fue desarrollado como parte del curso:
- **Diseño y desarrollo de servicios web**
- **Código:** GA7-220501096-AA4-EV03
- **Institución:** SENA

## 👤 Autor

- **Estudiante:** [Tu Nombre]
- **Código:** 220501096
- **Programa:** [Tu Programa de Estudio]

## 📄 Licencia

Este proyecto es de uso educativo para el SENA.

---

⭐ Si este proyecto te fue útil, no olvides darle una estrella en GitHub!
