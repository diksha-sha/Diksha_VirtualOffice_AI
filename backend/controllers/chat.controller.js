// chat.js
const messages = []; // In-memory storage for messages

function initChat(io) {
  io.on('connection', (socket) => {
    console.log('A user connected');

    // Send existing messages to newly connected user
    socket.emit('chatHistory', messages);

    // Listen for new messages
    socket.on('chatMessage', (msgData) => {
      const message = {
        username: msgData.username,
        text: msgData.text,
        time: new Date()
      };

      // Save message
      messages.push(message);

      // Remove messages older than 24 hours
      const cutoff = Date.now() - 24 * 60 * 60 * 1000;
      while (messages.length && new Date(messages[0].time).getTime() < cutoff) {
        messages.shift();
      }

      // Broadcast to everyone
      io.emit('chatMessage', message);
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
}

module.exports = initChat;
