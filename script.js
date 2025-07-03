// JavaScript retro para LatinChat - Estilo años 90s/2000s

var currentRoom = "General";
var nickname = "Usuario";
var messageCount = 0;
var visitCount = 1;

// Lista de usuarios simulados
var fakeUsers = [
    "Corazón_Latino", "Chica_Rebelde", "Romeo_2000", "Princesa_Virtual", 
    "Galán_Digital", "Mariposa_Net", "Tigre_Salvaje", "Dulce_Veneno",
    "Ángel_Caído", "Fuego_Pasión", "Luna_Plateada", "Estrella_Fugaz",
    "Lobo_Solitario", "Rosa_Roja", "Viento_Libre", "Alma_Gemela",
    "Corazón_Roto", "Sueño_Eterno", "Pasión_Ardiente", "Cielo_Azul"
];

var chatColors = ["#FF0000", "#0000FF", "#008000", "#800080", "#FF8000", "#008080"];

// Mensajes automáticos del sistema
var systemMessages = [
    "¡Bienvenido a LatinChat! El mejor lugar para conocer gente",
    "Recuerda respetar a todos los usuarios",
    "¿Buscas amor? ¡Aquí lo encontrarás!",
    "Conectando corazones latinos desde 1999",
    "¡No olvides visitar nuestras salas temáticas!"
];

// Inicializar cuando carga la página
window.onload = function() {
    updateVisitCounter();
    updateOnlineUsers();
    showSystemMessage();
    setInterval(addRandomMessage, 15000); // Mensaje cada 15 segundos
    setInterval(updateStats, 30000); // Actualizar stats cada 30 segundos
    
    // Efecto de parpadeo para el título
    setInterval(function() {
        var title = document.querySelector('blink');
        if (title) {
            title.style.visibility = title.style.visibility === 'hidden' ? 'visible' : 'hidden';
        }
    }, 500);
};

function updateVisitCounter() {
    visitCount = Math.floor(Math.random() * 999999) + 100000;
    document.getElementById('visitCounter').textContent = visitCount.toString().padStart(6, '0');
}

function updateOnlineUsers() {
    var usersList = document.getElementById('onlineUsers');
    var shuffled = fakeUsers.sort(() => 0.5 - Math.random());
    var selectedUsers = shuffled.slice(0, Math.floor(Math.random() * 8) + 5);
    
    var html = "";
    selectedUsers.forEach(function(user) {
        var status = Math.random() > 0.7 ? "🔴" : "🟢";
        html += status + " " + user + "<br>";
    });
    
    usersList.innerHTML = html;
    document.getElementById('totalUsers').textContent = Math.floor(Math.random() * 500) + 200;
}

function updateStats() {
    document.getElementById('totalUsers').textContent = Math.floor(Math.random() * 500) + 200;
    updateOnlineUsers();
}

function showSystemMessage() {
    var randomMsg = systemMessages[Math.floor(Math.random() * systemMessages.length)];
    addMessageToChat("SISTEMA", randomMsg, "#FF0000");
}

function joinRoom(roomName) {
    currentRoom = roomName;
    addMessageToChat("SISTEMA", "Has entrado a la sala: " + roomName, "#FF0000");
    
    // Simular usuarios en la sala
    setTimeout(function() {
        var welcomeMessages = [
            "¡Hola! ¿Cómo están todos?",
            "Buenas, ¿alguien de " + (Math.random() > 0.5 ? "México" : "Argentina") + "?",
            "¿Hay alguien aquí?",
            "Hola, soy nuevo/a ¿me ayudan?",
            "¡Qué tal la sala!"
        ];
        var randomUser = fakeUsers[Math.floor(Math.random() * fakeUsers.length)];
        var randomMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
        addMessageToChat(randomUser, randomMessage, getRandomColor());
    }, 2000);
}

function sendMessage() {
    var messageInput = document.getElementById('messageInput');
    var nicknameInput = document.getElementById('nickname');
    
    var message = messageInput.value.trim();
    var nick = nicknameInput.value.trim() || "Usuario";
    
    if (message === "") {
        alert("¡Escribe un mensaje!");
        return;
    }
    
    if (message.length > 200) {
        alert("El mensaje es muy largo (máximo 200 caracteres)");
        return;
    }
    
    // Agregar mensaje del usuario
    addMessageToChat(nick, message, "#000080");
    
    // Limpiar input
    messageInput.value = "";
    
    // Simular respuesta automática ocasional
    if (Math.random() > 0.7) {
        setTimeout(function() {
            var responses = [
                "¡Hola " + nick + "!",
                "¿De dónde eres " + nick + "?",
                "Interesante...",
                "jajaja",
                "¿En serio?",
                "Cuéntanos más",
                "¡Qué bueno!",
                "ASL? (Age/Sex/Location)",
                "¿Tienes MSN?",
                "¿Foto?"
            ];
            var randomUser = fakeUsers[Math.floor(Math.random() * fakeUsers.length)];
            var randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addMessageToChat(randomUser, randomResponse, getRandomColor());
        }, Math.random() * 3000 + 1000);
    }
}

function addRandomMessage() {
    var randomMessages = [
        "¿Alguien quiere chatear?",
        "Hola a todos",
        "¿Cómo están?",
        "Aburrido/a...",
        "¿Alguien de mi edad?",
        "Busco amistad sincera",
        "¿Hay alguien interesante aquí?",
        "Primera vez en este chat",
        "¿Recomiendan alguna sala?",
        "¡Este chat está genial!",
        "¿Alguien tiene webcam?",
        "Agreguen mi MSN",
        "¿Conocen otros chats?",
        "Saludos desde " + (Math.random() > 0.5 ? "México" : "España"),
        "¿Alguien quiere ser mi amigo/a virtual?"
    ];
    
    var randomUser = fakeUsers[Math.floor(Math.random() * fakeUsers.length)];
    var randomMessage = randomMessages[Math.floor(Math.random() * randomMessages.length)];
    addMessageToChat(randomUser, randomMessage, getRandomColor());
}

function addMessageToChat(username, message, color) {
    var chatMessages = document.getElementById('chatMessages');
    var timestamp = new Date().toLocaleTimeString();
    
    var messageHtml = '<font color="' + color + '"><b>[' + timestamp + '] ' + username + ':</b></font> ' + 
                     '<font color="#000000">' + message + '</font><br>';
    
    chatMessages.innerHTML += messageHtml;
    
    // Auto-scroll
    var chatWindow = document.getElementById('chatWindow');
    chatWindow.scrollTop = chatWindow.scrollHeight;
    
    messageCount++;
    
    // Limitar mensajes (mantener solo los últimos 50)
    var messages = chatMessages.getElementsByTagName('br');
    if (messages.length > 50) {
        var lines = chatMessages.innerHTML.split('<br>');
        chatMessages.innerHTML = lines.slice(-50).join('<br>');
    }
}

function getRandomColor() {
    return chatColors[Math.floor(Math.random() * chatColors.length)];
}

function clearChat() {
    if (confirm("¿Estás seguro de que quieres limpiar el chat?")) {
        document.getElementById('chatMessages').innerHTML = 
            '<font color="#FF0000"><b>[SISTEMA]</b></font> <font color="#000080">Chat limpiado</font><br>';
    }
}

// Efectos de sonido simulados (alerts)
function playSound(type) {
    if (type === "message") {
        // En los 90s/2000s se usaban alerts para simular sonidos
        console.log("*BEEP*");
    }
}

// Funciones para los enlaces del menú
function showHelp() {
    alert("AYUDA DE LATINCHAT\n\n" +
          "• Escribe tu mensaje y presiona ENTER o click en ENVIAR\n" +
          "• Cambia tu nick en el campo 'Tu Nick'\n" +
          "• Selecciona diferentes salas en el menú izquierdo\n" +
          "• Respeta a todos los usuarios\n" +
          "• ¡Diviértete conociendo gente nueva!\n\n" +
          "Para más ayuda visita nuestra página web");
}

// Detectar Enter en el campo de mensaje
document.addEventListener('DOMContentLoaded', function() {
    var messageInput = document.getElementById('messageInput');
    if (messageInput) {
        messageInput.addEventListener('keypress', function(e) {
            if (e.keyCode === 13) {
                sendMessage();
            }
        });
    }
});

// Efectos retro adicionales
function addRetroEffects() {
    // Cambiar colores de fondo ocasionalmente
    setInterval(function() {
        if (Math.random() > 0.95) {
            document.body.style.backgroundColor = document.body.style.backgroundColor === 'rgb(0, 0, 128)' ? '#000080' : '#000040';
            setTimeout(function() {
                document.body.style.backgroundColor = '#000080';
            }, 200);
        }
    }, 5000);
}

// Inicializar efectos retro
setTimeout(addRetroEffects, 1000);