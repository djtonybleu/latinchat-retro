const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Servir archivos estáticos
app.use(express.static(__dirname));

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Almacenar usuarios conectados
let users = {};
let rooms = {
    'general': [],
    'musica': [],
    'amor': []
};

// Conexiones WebSocket
io.on('connection', (socket) => {
    console.log('Usuario conectado:', socket.id);

    // Usuario se une al chat
    socket.on('join', (data) => {
        users[socket.id] = {
            nickname: data.nickname,
            room: data.room || 'general'
        };
        
        socket.join(data.room || 'general');
        rooms[data.room || 'general'].push(socket.id);
        
        // Notificar a todos en la sala
        socket.to(data.room || 'general').emit('userJoined', {
            nickname: data.nickname,
            users: getRoomUsers(data.room || 'general')
        });
        
        // Enviar lista de usuarios al nuevo usuario
        socket.emit('userList', getRoomUsers(data.room || 'general'));
    });

    // Enviar mensaje
    socket.on('message', (data) => {
        const user = users[socket.id];
        if (user) {
            io.to(user.room).emit('message', {
                nickname: user.nickname,
                text: data.text,
                timestamp: new Date().toLocaleTimeString()
            });
        }
    });

    // Cambiar de sala
    socket.on('changeRoom', (newRoom) => {
        const user = users[socket.id];
        if (user) {
            // Salir de la sala actual
            socket.leave(user.room);
            rooms[user.room] = rooms[user.room].filter(id => id !== socket.id);
            
            // Unirse a la nueva sala
            user.room = newRoom;
            socket.join(newRoom);
            rooms[newRoom].push(socket.id);
            
            // Notificar cambio
            socket.emit('roomChanged', {
                room: newRoom,
                users: getRoomUsers(newRoom)
            });
        }
    });

    // Usuario se desconecta
    socket.on('disconnect', () => {
        const user = users[socket.id];
        if (user) {
            rooms[user.room] = rooms[user.room].filter(id => id !== socket.id);
            socket.to(user.room).emit('userLeft', {
                nickname: user.nickname,
                users: getRoomUsers(user.room)
            });
            delete users[socket.id];
        }
        console.log('Usuario desconectado:', socket.id);
    });
});

function getRoomUsers(room) {
    return rooms[room].map(id => users[id]?.nickname).filter(Boolean);
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`LatinChat servidor corriendo en http://localhost:${PORT}`);
});