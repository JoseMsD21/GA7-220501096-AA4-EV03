// EJEMPLOS DE USO DEL SERVICIO DE AUTENTICACIÓN
// ===============================================

// INSTALACIÓN Y CONFIGURACIÓN
// ===========================
// 1. Instalar dependencias: npm install
// 2. Ejecutar servidor: npm start o npm run dev
// 3. El servidor correrá en http://localhost:3000

// EJEMPLO 1: REGISTRO DE USUARIO
// =============================
// Método: POST
// URL: http://localhost:3000/api/registro
// Headers: Content-Type: application/json

// Ejemplo con fetch (JavaScript)
async function registrarUsuario() {
    try {
        const response = await fetch('http://localhost:3000/api/registro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                usuario: 'juan123',
                email: 'juan@email.com',
                password: 'miPassword123'
            })
        });

        const data = await response.json();
        console.log('Respuesta de registro:', data);
        
        if (data.success) {
            console.log('✅ Usuario registrado exitosamente');
        } else {
            console.log('❌ Error en registro:', data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Ejemplo con curl (Terminal/CMD)
// curl -X POST http://localhost:3000/api/registro \
//      -H "Content-Type: application/json" \
//      -d '{"usuario":"juan123","email":"juan@email.com","password":"miPassword123"}'

// EJEMPLO 2: INICIO DE SESIÓN
// ===========================
// Método: POST
// URL: http://localhost:3000/api/login
// Headers: Content-Type: application/json

// Ejemplo con fetch (JavaScript)
async function iniciarSesion() {
    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                usuario: 'juan123', // o email: 'juan@email.com'
                password: 'miPassword123'
            })
        });

        const data = await response.json();
        console.log('Respuesta de login:', data);
        
        if (data.success) {
            console.log('✅ Autenticación satisfactoria');
            console.log('Token JWT:', data.data.token);
            
            // Guardar token para usar en peticiones protegidas
            localStorage.setItem('token', data.data.token);
        } else {
            console.log('❌ Error en autenticación:', data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Ejemplo con curl (Terminal/CMD)
// curl -X POST http://localhost:3000/api/login \
//      -H "Content-Type: application/json" \
//      -d '{"usuario":"juan123","password":"miPassword123"}'

// EJEMPLO 3: VERIFICAR TOKEN (Opcional)
// ====================================
// Método: GET
// URL: http://localhost:3000/api/verificar-token
// Headers: Authorization: Bearer TOKEN_JWT

// Ejemplo con fetch (JavaScript)
async function verificarToken() {
    try {
        const token = localStorage.getItem('token');
        
        const response = await fetch('http://localhost:3000/api/verificar-token', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        console.log('Verificación de token:', data);
        
        if (data.success) {
            console.log('✅ Token válido');
        } else {
            console.log('❌ Token inválido:', data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Ejemplo con curl (Terminal/CMD)
// curl -X GET http://localhost:3000/api/verificar-token \
//      -H "Authorization: Bearer TU_TOKEN_JWT_AQUI"

// EJEMPLO 4: LISTAR USUARIOS (Solo para desarrollo)
// ================================================
// Método: GET
// URL: http://localhost:3000/api/usuarios

// Ejemplo con fetch (JavaScript)
async function listarUsuarios() {
    try {
        const response = await fetch('http://localhost:3000/api/usuarios');
        const data = await response.json();
        console.log('Usuarios registrados:', data);
    } catch (error) {
        console.error('Error:', error);
    }
}

// POSIBLES RESPUESTAS DEL SERVIDOR
// ===============================

// Registro exitoso:
/*
{
    "success": true,
    "message": "Usuario registrado exitosamente",
    "data": {
        "id": 1,
        "usuario": "juan123",
        "email": "juan@email.com",
        "fechaRegistro": "2025-06-03T10:30:00.000Z"
    }
}
*/

// Login exitoso:
/*
{
    "success": true,
    "message": "Autenticación satisfactoria",
    "data": {
        "usuario": "juan123",
        "email": "juan@email.com",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
}
*/

// Error de autenticación:
/*
{
    "success": false,
    "message": "Error en la autenticación: contraseña incorrecta"
}
*/

// Error de validación:
/*
{
    "success": false,
    "message": "Todos los campos son requeridos: usuario, email y password"
}
*/

// CÓDIGOS DE ESTADO HTTP
// =====================
// 200 - OK (Login exitoso, verificación de token exitosa)
// 201 - Created (Registro exitoso)
// 400 - Bad Request (Datos faltantes o inválidos)
// 401 - Unauthorized (Credenciales incorrectas)
// 403 - Forbidden (Token inválido o expirado)
// 404 - Not Found (Endpoint no encontrado)
// 409 - Conflict (Usuario ya existe)
// 500 - Internal Server Error (Error del servidor)

// FUNCIONES ÚTILES PARA TESTING
// ============================

// Función completa para probar registro y login
async function probarServicoCompleto() {
    console.log('🧪 Iniciando pruebas del servicio...');
    
    // 1. Registrar usuario
    console.log('\n1. Registrando usuario...');
    await registrarUsuario();
    
    // 2. Iniciar sesión
    console.log('\n2. Iniciando sesión...');
    await iniciarSesion();
    
    // 3. Verificar token
    console.log('\n3. Verificando token...');
    await verificarToken();
    
    // 4. Listar usuarios
    console.log('\n4. Listando usuarios...');
    await listarUsuarios();
    
    console.log('\n✅ Pruebas completadas');
}

// Ejecutar pruebas (descomenta la siguiente línea para probar)
// probarServicoCompleto();

// SEGURIDAD Y MEJORES PRÁCTICAS
// =============================
// 1. En producción, usar variables de entorno para JWT_SECRET
// 2. Implementar rate limiting para prevenir ataques de fuerza bruta
// 3. Usar HTTPS en producción
// 4. Implementar validación adicional de entrada
// 5. Usar una base de datos real (MongoDB, PostgreSQL, etc.)
// 6. Implementar logs de seguridad
// 7. Considerar implementar 2FA (autenticación de dos factores)