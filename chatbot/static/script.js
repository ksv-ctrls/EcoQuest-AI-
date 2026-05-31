const chatBody = document.getElementById("chat-body");
const chatInput = document.getElementById("chat-input");

function addMessage(sender, text) {
    const msg = document.createElement("div");
    msg.className = `chat-message ${sender}`;
    msg.textContent = text;
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    addMessage("user", message);
    chatInput.value = "";

    fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
    })
        .then(res => res.json())
        .then(data => addMessage("bot", data.response))
        .catch(err => addMessage("bot", "Error connecting to AI"));
}

function sendQuick(text) {
    chatInput.value = text;
    sendMessage();
}
