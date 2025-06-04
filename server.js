// Importación de dependencias necesarias
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

// Inicialización de la aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// Clave secreta para JWT (en producción debe estar en variables de entorno)
const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_super_segura';

// Configuración de middlewares
app.use(express.json()); // Para parsear JSON en las peticiones
app.use(cors()); // Para permitir CORS

// Base de datos simulada en memoria (en producción usar una base de datos real)
let usuarios = [];

// Función auxiliar para validar formato de email
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Función auxiliar para validar fortaleza de contraseña
function validarPassword(password) {
    // Mínimo 6 caracteres, al menos una letra y un número
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;
    return regex.test(password);
}

// ENDPOINT PARA REGISTRO DE USUARIOS
app.post('/api/registro', async (req, res) => {
    try {
        // Extraer datos del cuerpo de la petición
        const { usuario, email, password } = req.body;

        // Validación de campos requeridos
        if (!usuario || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos son requeridos: usuario, email y password'
            });
        }

        // Validación de formato de email
        if (!validarEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'El formato del email no es válido'
            });
        }

        // Validación de fortaleza de contraseña
        if (!validarPassword(password)) {
            return res.status(400).json({
                success: false,
                message: 'La contraseña debe tener al menos 6 caracteres, una letra y un número'
            });
        }

        // Verificar si el usuario ya existe
        const usuarioExistente = usuarios.find(u => u.usuario === usuario || u.email === email);
        if (usuarioExistente) {
            return res.status(409).json({
                success: false,
                message: 'El usuario o email ya está registrado'
            });
        }

        // Encriptar la contraseña usando bcrypt
        const saltRounds = 10;
        const passwordEncriptada = await bcrypt.hash(password, saltRounds);

        // Crear nuevo usuario
        const nuevoUsuario = {
            id: usuarios.length + 1,
            usuario: usuario,
            email: email,
            password: passwordEncriptada,
            fechaRegistro: new Date().toISOString()
        };

        // Agregar usuario a la "base de datos"
        usuarios.push(nuevoUsuario);

        // Respuesta exitosa (no incluir la contraseña en la respuesta)
        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            data: {
                id: nuevoUsuario.id,
                usuario: nuevoUsuario.usuario,
                email: nuevoUsuario.email,
                fechaRegistro: nuevoUsuario.fechaRegistro
            }
        });

    } catch (error) {
        // Manejo de errores del servidor
        console.error('Error en registro:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// ENDPOINT PARA INICIO DE SESIÓN
app.post('/api/login', async (req, res) => {
    try {
        // Extraer credenciales del cuerpo de la petición
        const { usuario, password } = req.body;

        // Validación de campos requeridos
        if (!usuario || !password) {
            return res.status(400).json({
                success: false,
                message: 'Usuario y contraseña son requeridos'
            });
        }

        // Buscar usuario en la base de datos (puede ser por usuario o email)
        const usuarioEncontrado = usuarios.find(u => 
            u.usuario === usuario || u.email === usuario
        );

        // Si no se encuentra el usuario
        if (!usuarioEncontrado) {
            return res.status(401).json({
                success: false,
                message: 'Error en la autenticación: usuario no encontrado'
            });
        }

        // Verificar la contraseña usando bcrypt
        const passwordValida = await bcrypt.compare(password, usuarioEncontrado.password);

        // Si la contraseña no es válida
        if (!passwordValida) {
            return res.status(401).json({
                success: false,
                message: 'Error en la autenticación: contraseña incorrecta'
            });
        }

        // Generar token JWT para la sesión
        const token = jwt.sign(
            { 
                id: usuarioEncontrado.id, 
                usuario: usuarioEncontrado.usuario,
                email: usuarioEncontrado.email
            },
            JWT_SECRET,
            { expiresIn: '24h' } // Token expira en 24 horas
        );

        // Respuesta de autenticación exitosa
        res.status(200).json({
            success: true,
            message: 'Autenticación satisfactoria',
            data: {
                usuario: usuarioEncontrado.usuario,
                email: usuarioEncontrado.email,
                token: token
            }
        });

    } catch (error) {
        // Manejo de errores del servidor
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// ENDPOINT PARA VERIFICAR TOKEN (opcional, para proteger rutas)
app.get('/api/verificar-token', (req, res) => {
    try {
        // Obtener token del header Authorization
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token de acceso requerido'
            });
        }

        // Verificar el token
        jwt.verify(token, JWT_SECRET, (error, decoded) => {
            if (error) {
                return res.status(403).json({
                    success: false,
                    message: 'Token inválido o expirado'
                });
            }

            // Token válido
            res.status(200).json({
                success: true,
                message: 'Token válido',
                data: {
                    usuario: decoded.usuario,
                    email: decoded.email
                }
            });
        });

    } catch (error) {
        console.error('Error en verificación de token:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// ENDPOINT PARA LISTAR USUARIOS (solo para pruebas - remover en producción)
app.get('/api/usuarios', (req, res) => {
    // Retornar usuarios sin las contraseñas
    const usuariosSinPassword = usuarios.map(u => ({
        id: u.id,
        usuario: u.usuario,
        email: u.email,
        fechaRegistro: u.fechaRegistro
    }));

    res.status(200).json({
        success: true,
        message: 'Lista de usuarios registrados',
        data: usuariosSinPassword
    });
});

// Middleware para manejar rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint no encontrado'
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`📝 Endpoints disponibles:`);
    console.log(`   POST /api/registro - Registrar nuevo usuario`);
    console.log(`   POST /api/login - Iniciar sesión`);
    console.log(`   GET  /api/verificar-token - Verificar token JWT`);
    console.log(`   GET  /api/usuarios - Listar usuarios (solo desarrollo)`);
});

module.exports = app;