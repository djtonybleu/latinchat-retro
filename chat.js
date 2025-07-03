// LatinChat - Cliente WebSocket
let socket;
let currentUser = '';
let currentRoom = 'general';
let users = [];
let connected = false;

function connect() {
    if (!connected) {
        document.getElementById('loginModal').style.display = 'block';
    } else {
        disconnect();
    }
}

function login() {
    const nickname = document.getElementById('nickname').value.trim();
    if (nickname) {
        currentUser = nickname;
        socket = io();
        setupSocketListeners();
        socket.emit('join', { nickname, room: currentRoom });
        connected = true;
        updateStatus();
        closeModal();
        document.getElementById('connectBtn').value = 'Desconectar';
    }
}

function disconnect() {
    if (socket) {
        socket.disconnect();
    }
    connected = false;
    currentUser = '';
    users = [];
    updateStatus();
    updateUserList();
    document.getElementById('connectBtn').value = 'Conectar';
}

function setupSocketListeners() {
    socket.on('message', (data) => {
        addMessage(data.nickname, data.text, data.timestamp);
    });
    
    socket.on('userJoined', (data) => {
        addSystemMessage(`${data.nickname} se ha conectado`);
        users = data.users;
        updateUserList();
    });
    
    socket.on('userLeft', (data) => {
        addSystemMessage(`${data.nickname} se ha desconectado`);
        users = data.users;
        updateUserList();
    });
    
    socket.on('userList', (userList) => {
        users = userList;
        updateUserList();
    });
    
    socket.on('roomChanged', (data) => {
        currentRoom = data.room;
        users = data.users;
        updateUserList();
        addSystemMessage(`Has cambiado a la sala: ${data.room}`);
    });
}

function closeModal() {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('nickname').value = '';
}

function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (message && connected && socket) {
        socket.emit('message', { text: message });
        input.value = '';
    }
}

function addMessage(user, text, timestamp) {
    const messageDiv = document.createElement('div');
    messageDiv.innerHTML = `<b>[${timestamp || new Date().toLocaleTimeString()}] ${user}:</b> ${text}`;
    
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addSystemMessage(text) {
    const timestamp = new Date().toLocaleTimeString();
    const messageDiv = document.createElement('div');
    messageDiv.innerHTML = `<i style="color: #808080;">[${timestamp}] * ${text}</i>`;
    
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addUser(username) {
    if (!users.includes(username)) {
        users.push(username);
        updateUserList();
    }
}

function removeUser(username) {
    users = users.filter(user => user !== username);
    updateUserList();
}

function updateUserList() {
    const userList = document.getElementById('userList');
    userList.innerHTML = users.map(user => 
        `<div style="color: ${user === currentUser ? '#0000FF' : '#000000'}">${user}</div>`
    ).join('');
    document.getElementById('userCount').textContent = users.length;
}

function updateStatus() {
    const status = document.getElementById('status');
    if (connected) {
        status.textContent = `Conectado como ${currentUser}`;
        status.className = 'connected';
    } else {
        status.textContent = 'Desconectado';
        status.className = 'disconnected';
    }
}

function joinRoom(room) {
    if (connected && socket) {
        socket.emit('changeRoom', room);
    }
}

// Event listeners
document.getElementById('messageInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Inicializar
window.onload = function() {
    addSystemMessage('Bienvenido a LatinChat! Haz clic en "Conectar" para empezar.');
};