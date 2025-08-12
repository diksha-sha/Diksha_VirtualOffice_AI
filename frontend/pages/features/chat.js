const socket = io("http://localhost:5000");

const chatBox = document.getElementById("chat-box");
const usernameInput = document.getElementById("username");
const messageInput = document.getElementById("message");
const sendBtn = document.getElementById("sendBtn");

//load history
fetch("http://localhost:5000/api/chat/history")
    .then(res => res.json())
    .then(messages => {
        messages.forEach(msg => addMessage(msg.author, msg.message));
    });

//sent
sendBtn.addEventListener("click", () => {
    const author = usernameInput.value.trim();
    const message = messageInput.value.trim();

    if (author && message) {
        socket.emit("sendMessage", { author, message });
        messageInput.value = "";
    }
});

// recieve
socket.on("receiveMessage", (msg) => {
    addMessage(msg.author, msg.message);
});

function addMessage(author, message) {
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `<span class="author">${author}:</span> ${message}`;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}
