
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatToggler = document.querySelector(".chatbot-toggler");
console.log(chatbox);
let userMessage;
const HF_API_KEY = ""; // Replace with your Hugging Face API key
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    const chatLi = document.createElement('li');
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" 
        ? `<p></p>` 
        : `<span class="material-symbols-sharp"> smart_toy </span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
};

const generateResponse = (incomingChatLi) => {
    const API_URL = ""; // URL for GPT-Neo
    const messageElement = incomingChatLi.querySelector("p");

    const requestOptions = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${HF_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            inputs: userMessage,
            parameters: {
                max_length: 100  // Set a limit to avoid lengthy responses
            }
        })
    };

    fetch(API_URL, requestOptions)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            messageElement.textContent = data?.[0]?.generated_text || "No response received.";
        })
        .catch((error) => {
            console.log(error);
            messageElement.classList.add("error");
            messageElement.textContent = "Oops! Something went wrong. Please try again.";
        })
        .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
};

const handleChat = () => {
    userMessage = chatInput.value.trim();
    console.log(userMessage);
    if (!userMessage) return;
    chatInput.value = "";
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
};

chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatToggler.addEventListener('click', () => document.body.classList.toggle('show-chatbot'));
sendChatBtn.addEventListener("click", handleChat);



