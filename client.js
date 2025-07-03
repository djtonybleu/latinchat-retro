// Cliente JavaScript para LatinChat - Estilo años 90s/2000s
let socket;
let currentUsername = '';
let currentRoom = '';
let messageCount = 0;
let isConnected = false;

// Colores para mensajes
const chatColors = ["#FF0000", "#0000FF", "#008000", "#800080", "#FF8000", "#008080"];

// Inicializar cuando carga la página
window.onload = function() {
    updateVisitCounter();
    
    // Efecto de parpadeo para el título
    setInterval(function() {
        const blinkElements = document.querySelectorAll('blink');
        blinkElements.forEach(element => {
            element.style.visibility = element.style.visibility === 'hidden' ? 'visible' : 'hidden';
        });
    }, 500);
    
    // Conectar a Socket.IO
    socket = io();
    setupSocketListeners();
};

function setupSocketListeners() {
    socket.on('connect', () => {
        console.log('Conectado al servidor');
        isConnected = true;
    });
    
    socket.on('disconnect', () => {
        console.log('Desconectado del servidor');
        isConnected = false;
        addSystemMessage('Conexión perdida. Intentando reconectar...');
    });
    
    socket.on('newMessage', (message) => {
        addMessageToChat(message);
        messageCount++;
        updateStats();
    });
    
    socket.on('messageHistory', (messages) => {
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.innerHTML = '';
        messages.forEach(message => {
            addMessageToChat(message);
        });
    });
    
    socket.on('updateUsers', (users) => {
        updateOnlineUsers(users);
    });
    
    socket.on('userJoined', (username) => {
        console.log(`${username} se unió a la sala`);
    });
    
    socket.on('userLeft', (username) => {
        console.log(`${username} salió de la sala`);
    });
}

function enterChat() {
    const username = document.getElementById('usernameInput').value.trim();
    const room = document.getElementById('roomSelect').value;
    
    if (!username || username === '') {
        alert('¡Debes ingresar un nick!');
        return;
    }
    
    if (username.length > 20) {
        alert('El nick es muy largo (máximo 20 caracteres)');
        return;
    }
    
    currentUsername = username;
    currentRoom = room;
    
    // Ocultar modal
    document.getElementById('loginModal').style.display = 'none';
    
    // Actualizar interfaz
    document.getElementById('currentNick').textContent = username;
    document.getElementById('currentRoom').textContent = getRoomDisplayName(room);
    document.getElementById('messageInput').disabled = false;
    document.getElementById('sendBtn').disabled = false;
    
    // Unirse a la sala
    socket.emit('joinRoom', { username, room });
    
    addSystemMessage(`Te has conectado como ${username} en la sala ${getRoomDisplayName(room)}`);
}

function changeRoom(newRoom) {
    if (!isConnected || !currentUsername) {
        alert('Debes estar conectado para cambiar de sala');
        return;
    }
    
    currentRoom = newRoom;
    document.getElementById('currentRoom').textContent = getRoomDisplayName(newRoom);
    
    socket.emit('joinRoom', { username: currentUsername, room: newRoom });
    
    // Limpiar chat
    document.getElementById('chatMessages').innerHTML = '';
    addSystemMessage(`Has cambiado a la sala ${getRoomDisplayName(newRoom)}`);
}

function getRoomDisplayName(room) {
    const roomNames = {
        'General': '🌟 Sala General',
        'Amor': '💕 Busco Amor',
        'Amistad': '👫 Solo Amistad',
        'Mexico': '🇲🇽 México',
        'Argentina': '🇦🇷 Argentina',
        'Colombia': '🇨🇴 Colombia',
        'España': '🇪🇸 España',
        'Musica': '🎵 Música Latina',
        'Mayores': '🔞 Solo +18'
    };
    return roomNames[room] || room;
}

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (!isConnected) {
        alert('No estás conectado al servidor');
        return;
    }
    
    if (message === '') {
        alert('¡Escribe un mensaje!');
        return;
    }
    
    if (message.length > 200) {
        alert('El mensaje es muy largo (máximo 200 caracteres)');
        return;
    }
    
    // Enviar mensaje
    socket.emit('sendMessage', {
        message: message,
        color: getRandomColor()
    });
    
    // Limpiar input
    messageInput.value = '';
    messageInput.focus();
}

function addMessageToChat(messageData) {
    const chatMessages = document.getElementById('chatMessages');
    const chatWindow = document.getElementById('chatWindow');
    
    let colorClass = '';
    let prefix = '';
    
    if (messageData.isSystem) {
        prefix = '[SISTEMA]';
        colorClass = 'color: #FF0000; font-weight: bold;';
    } else if (messageData.isBot) {
        colorClass = `color: ${messageData.color}; font-weight: bold;`;
    } else {
        colorClass = `color: ${messageData.color}; font-weight: bold;`;
    }
    
    const messageHtml = `
        <font style="${colorClass}">
            <b>[${messageData.timestamp}] ${prefix}${messageData.username}:</b>
        </font> 
        <font color="#000000">${messageData.message}</font><br>
    `;
    
    chatMessages.innerHTML += messageHtml;
    
    // Auto-scroll
    chatWindow.scrollTop = chatWindow.scrollHeight;
    
    // Limitar mensajes (mantener solo los últimos 50)
    const messages = chatMessages.getElementsByTagName('br');
    if (messages.length > 100) {
        const lines = chatMessages.innerHTML.split('<br>');
        chatMessages.innerHTML = lines.slice(-50).join('<br>');
    }
}

function addSystemMessage(message) {
    addMessageToChat({
        username: 'SISTEMA',
        message: message,
        timestamp: new Date().toLocaleTimeString(),
        isSystem: true,
        color: '#FF0000'
    });
}

function updateOnlineUsers(users) {
    const usersList = document.getElementById('onlineUsers');
    
    if (!users || users.length === 0) {
        usersList.innerHTML = 'No hay usuarios conectados';
        return;
    }
    
    let html = '';
    users.forEach(user => {
        const status = Math.random() > 0.7 ? '🔴' : '🟢';
        html += `${status} ${user}<br>`;
    });
    
    usersList.innerHTML = html;
    document.getElementById('totalUsers').textContent = users.length;
}

function updateStats() {
    document.getElementById('messageCount').textContent = messageCount;
}

function getRandomColor() {
    return chatColors[Math.floor(Math.random() * chatColors.length)];
}

function clearChat() {
    if (confirm('¿Estás seguro de que quieres limpiar el chat?')) {
        document.getElementById('chatMessages').innerHTML = '';
        addSystemMessage('Chat limpiado');
    }
}

function updateVisitCounter() {
    const visitCount = Math.floor(Math.random() * 999999) + 100000;
    document.getElementById('visitCounter').textContent = visitCount.toString().padStart(6, '0');
}

// Detectar Enter en el campo de mensaje
document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        messageInput.addEventListener('keypress', function(e) {
            if (e.keyCode === 13) {
                sendMessage();
            }
        });
    }
    
    const usernameInput = document.getElementById('usernameInput');
    if (usernameInput) {
        usernameInput.addEventListener('keypress', function(e) {
            if (e.keyCode === 13) {
                enterChat();
            }
        });
    }
});

// Efectos retro adicionales
function addRetroEffects() {
    setInterval(function() {
        if (Math.random() > 0.98) {
            document.body.style.backgroundColor = document.body.style.backgroundColor === 'rgb(0, 0, 128)' ? '#000080' : '#000040';
            setTimeout(function() {
                document.body.style.backgroundColor = '#000080';
            }, 200);
        }
    }, 5000);
}

setTimeout(addRetroEffects, 1000);