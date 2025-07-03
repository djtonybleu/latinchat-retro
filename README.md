# LatinChat - Chat Retro en Tiempo Real

## Instalación y Uso

### 1. Instalar dependencias
```bash
npm install
```

### 2. Ejecutar el servidor
```bash
npm start
```

### 3. Abrir en navegador
Visita: http://localhost:3000

## Características
- ✅ Chat en tiempo real con WebSockets
- ✅ Múltiples salas (General, Música, Amor)
- ✅ Lista de usuarios conectados
- ✅ Interfaz retro años 90
- ✅ Mensajes del sistema

## Despliegue en Producción

### Opciones gratuitas:
1. **Render.com** - Fácil despliegue
2. **Railway.app** - Simple y rápido
3. **Heroku** - Clásico (con limitaciones)

### Para desplegar:
1. Sube tu código a GitHub
2. Conecta tu repositorio en la plataforma elegida
3. La aplicación se desplegará automáticamente

## Estructura del Proyecto
```
LatinChatProyect/
├── server.js      # Servidor Node.js
├── index.html     # Interfaz del chat
├── styles.css     # Estilos retro
├── chat.js        # Cliente WebSocket
├── package.json   # Dependencias
└── README.md      # Este archivo
```