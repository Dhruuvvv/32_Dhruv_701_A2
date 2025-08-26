const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('chat message', (msg) => {
        console.log('Message received:', msg);

        // Simple bot response
        let botReply = `You said: "${msg}"`;
        const lowerMsg = msg.toLowerCase();

        if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
            botReply = 'Hi there! How can I help you today?';
        } else if (lowerMsg.includes('time')) {
            botReply = `Current time is ${new Date().toLocaleTimeString()}`;
        } else if (lowerMsg.includes('name')) {
            botReply = `I'm your friendly chatbot!`;
        } else if (lowerMsg.includes('weather')) {
            botReply = `I can't check the weather yet, but I can learn!`;
        } else if (lowerMsg.includes('date')) {
            botReply = `Today's date is ${new Date().toLocaleDateString()}`;
        } else if (lowerMsg.includes('bye')) {
            botReply = `Goodbye! Have a great day! 👋`;
        } else if (lowerMsg.includes('joke')) {
            botReply = `Why don't scientists trust atoms? Because they make up everything! 😄`;
        } else if (lowerMsg.includes('help')) {
            botReply = `You can ask me about time, date, jokes, or just say hello!`;
        } else if (lowerMsg.includes('who made you')) {
            botReply = `I was created by a developer using Node.js and Socket.IO!`;
        } else if (lowerMsg.includes('who created you')) {
            botReply = `Shweta invented me 💡`;
        } else if (lowerMsg.includes('surat')) {
            botReply = `Surat is a vibrant city in Gujarat, known for its textiles and diamond cutting!`;
        } else if (lowerMsg.includes('how are you')) {
            botReply = `I'm just code, but I'm running smoothly! How about you? 😊`;
        }


        socket.emit('bot reply', botReply);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});