// ✅ Fully Polished app.js — Chat UI Compatible, Animations, Stats, QR, Vault
// Function to copy bot's reply and show notification
function copyBot(token) {
  const el = document.getElementById(`bot-msg-${token}`);
  const plainText = el.innerText || el.textContent || "";

  navigator.clipboard.writeText(plainText).then(() => {
    const notification = document.getElementById("notification");
    const notificationText = document.getElementById("notification-text");
    notificationText.textContent = "Copied to clipboard!";
    notification.classList.remove("hidden");
    setTimeout(() => {
      notification.classList.add("hidden");
    }, 1000);
  });
}


//formatting responses from api 

function formatResponse(response, isChatbot = false) {
  // Handle Bold text (**bold**)
  response = response.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Handle Italics text (*italic*)
  response = response.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Handle code blocks (```...```)
  if (response.includes("```")) {
    const parts = response.split("```");
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return `<pre class="bg-transparent text-white p-2 rounded text-sm mb-2 whitespace-pre-wrap break-words">${part.trim()}</pre>`;

      } else {
        return `<p>${part.trim()}</p>`;
      }
    }).join("");
  }

  // **Chatbot-specific formatting**: If it's a chatbot response, handle lists, etc.
  
if (isChatbot) {
    // Handle numbered lists (1., 2., 3.)
    if (/^\d+\.\s/m.test(response)) {
      const lines = response.trim().split("\n").filter(line => line.trim() !== "");
      response = `
        <div class="response">
          
          <ol class="list-decimal pl-5 space-y-1">
            ${lines.map(line => `<li>${line.replace(/^\d+\.\s/, "")}</li>`).join("")}
          </ol>
        </div>
      `;
    }

    // Handle bullet points (-, *, •)
    if (/^[-•\*]\s/m.test(response)) {
      const lines = response.trim().split("\n").filter(line => line.trim() !== "");
      response = `
        <div class="response">
         
          <ul class="list-disc pl-5 space-y-1">
            ${lines.map(line => `<li>${line.replace(/^[-•*]\s/, "")}</li>`).join("")}
          </ul>
        </div>
      `;
    }
  }

  // **Default formatting** (non-chatbot): Handle plain text with bold and italics
  if (!isChatbot) {
    // If it's a general prompt, return a simple formatted text without lists
    response = `<p>${response}</p>`;
  }

  return response;
}

console.log("✅ app.js loaded");

let lastPromptPayload = null;

// ✅ Spark Animation
function triggerSparkIcon() {
  const icon = document.createElement("div");
  icon.innerHTML = '<i data-lucide="sparkles"></i>';
  icon.className = "absolute top-6 right-6 text-yellow-300 animate-bounce z-50";
  document.body.appendChild(icon);
  if (window.lucide) lucide.createIcons();
  setTimeout(() => icon.remove(), 2000);
}

// ✅ Typing Effect
function typeOutputText(text, container, delay = 5) {
  container.textContent = "";
  let i = 0;
  const interval = setInterval(() => {
    container.textContent += text[i];
    i++;
    if (i >= text.length) clearInterval(interval);
  }, delay);
}

document.addEventListener("DOMContentLoaded", () => {
  const audienceSelector = document.getElementById("audienceSelector");
  const roleInput = document.getElementById("role");
  const taskInput = document.getElementById("task");
  const formatInput = document.getElementById("format");
  const outputBox = document.getElementById("output");
  const toneButtons = document.querySelectorAll(".tone-button");
  const vaultList = document.getElementById("vault");
  const qrCodeBox = document.getElementById("qrcode");
  const copyBtn = document.getElementById("copyBtn");
  const retryBtn = document.getElementById("retryBtn");
  const generateBtn = document.getElementById("generateBtn");

//bot logic start🦾
// Bot logic to allow persistent chat
const launchBotBtn = document.getElementById("launchBot");
const botPanel = document.getElementById("botPanel");
const closeBotPanel = document.getElementById("closeBotPanel");
const botMessages = document.getElementById("botMessages");
const botForm = document.getElementById("botForm");
const botInput = document.getElementById("botInput");

let chatHistory = []; // store all exchanged prompts & replies

// 🟢 Show panel and animate in
function openBotPanel() {
  botPanel.classList.remove("hidden");
  setTimeout(() => {
    botPanel.classList.add("open"); // Add 'open' class to slide the panel in
  }, 10);
}

// 🔴 Close panel and animate out
closeBotPanel.addEventListener("click", () => {
  botPanel.classList.remove("open"); // Remove 'open' class to slide the panel out
  setTimeout(() => botPanel.classList.add("hidden"), 300); // Hide the panel after the transition
});

// 📩 Handle initial "Try on Bot" click
launchBotBtn.addEventListener("click", async () => {
  const promptToSend = outputBox.innerText.trim();

  console.log("Bot launch prompt:", promptToSend); // ✅ debug

  if (
    !promptToSend ||
    promptToSend === "" ||
    promptToSend.includes("AI is writing your prompt") ||
    promptToSend.includes("dot-typing") ||
    promptToSend.startsWith("⚠️") ||
    promptToSend.startsWith("❌")
  ) {
    botMessages.innerHTML = "";
    openBotPanel();
    botMessages.innerHTML += `
      <div class="message-bubble bot-bubble">
        <strong>🤖 Bot:</strong><br>Hi there! It seems that no prompt has been generated yet. Please type any question you'd like to ask me.
      </div>
    `;
    botMessages.scrollTop = botMessages.scrollHeight;
    return;
  }

  botMessages.innerHTML = "";
  openBotPanel();
  await sendToBot(promptToSend);
});

// Handle follow-up messages from the user
botForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const msg = botInput.value.trim();
  if (!msg) return;  // Do nothing if input is empty
  botInput.value = "";  // Clear input after sending
  await sendToBot(msg);  // Send the follow-up message
});

// Send message to the bot and display the response
async function sendToBot(message) {
  botMessages.innerHTML += `
    <div class="message-bubble user-bubble">
      <strong>You:</strong><br>${message}
    </div>
    <div class="typing-indicator" id="bot-thinking">🤖 Typing...</div>
  `;
  botMessages.scrollTop = botMessages.scrollHeight;

  try {
    // Send the message to your backend or Gemini API
    const response = await fetch("http://localhost:5000/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: message })
    });
    const data = await response.json();
    const reply = data.result || "⚠️ Promptpro chatbot returned no response.";
    const token = Date.now();

    // Remove typing indicator
    const typingIndicator = document.getElementById("bot-thinking");
    if (typingIndicator) {
      typingIndicator.remove();
    }
    // Format the bot's reply using the formatResponse function
 const formattedReply = formatResponse(reply, true); 

    // Append bot's reply
    botMessages.innerHTML += `
      <div class="message-bubble bot-bubble">
        <strong>🤖 Bot:</strong><br>
        <div id="bot-msg-${token}" class="bot-message">${formattedReply}</div>

        <button onclick="copyBot('${token}')" class="absolute top-1 right-2 text-xs text-blue-300 hover:text-blue-100 underline">📋 Copy</button>
      </div>
    `;
    botMessages.scrollTop = botMessages.scrollHeight;

    chatHistory.push({ user: message, bot: formattedReply });

    // ✅ Play a soft sound when the bot responds
const botSound = new Audio("assets/bot-message.mp3");

    botSound.play();
  } catch (err) {
    const typingIndicator = document.getElementById("bot-thinking");
    if (typingIndicator) {
      typingIndicator.remove();
    }
    botMessages.innerHTML += `<div class="text-red-400">❌ Error contacting Gemini.</div>`;
    console.error(err);
  }
}


 const toggleBtn = document.getElementById("toggleBuilderBtn");
const builderPanel = document.getElementById("builderPanel");
const outputPanel = document.getElementById("outputPanel");

if (toggleBtn && builderPanel && outputPanel) {
  toggleBtn.addEventListener("click", () => {
    const isHidden = builderPanel.classList.toggle("hidden");
    localStorage.setItem("builderHidden", isHidden);
    toggleBtn.innerHTML = isHidden ? "👁️ Show Builder Panel" : "👁️ Hide Builder Panel";

    // 🪄 Expand output panel to full width
    if (isHidden) {
      outputPanel.classList.remove("md:col-span-2");
      outputPanel.classList.add("md:col-span-3");
    } else {
      outputPanel.classList.remove("md:col-span-3");
      outputPanel.classList.add("md:col-span-2");
    }
  });

  // Restore state on load
  const wasHidden = localStorage.getItem("builderHidden") === "true";
  if (wasHidden) {
    builderPanel.classList.add("hidden");
    toggleBtn.innerHTML = "👁️ Show Builder Panel";
    outputPanel.classList.remove("md:col-span-2");
    outputPanel.classList.add("md:col-span-3");
  }
}



  let selectedTone = null;

  let promptCount = parseInt(localStorage.getItem("promptCount") || "0");
  const toneStats = JSON.parse(localStorage.getItem("toneStats") || "{}");
  const formatStats = JSON.parse(localStorage.getItem("formatStats") || "{}");

  function updateStats(tone, format) {
    promptCount++;
    toneStats[tone] = (toneStats[tone] || 0) + 1;
    formatStats[format] = (formatStats[format] || 0) + 1;

    localStorage.setItem("promptCount", promptCount);
    localStorage.setItem("toneStats", JSON.stringify(toneStats));
    localStorage.setItem("formatStats", JSON.stringify(formatStats));
    updateStatsUI();
  }

  function updateStatsUI() {
    const total = localStorage.getItem("promptCount") || 0;
    const toneStats = JSON.parse(localStorage.getItem("toneStats") || "{}");
    const formatStats = JSON.parse(localStorage.getItem("formatStats") || "{}");
    const mostUsedTone = Object.entries(toneStats).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";
    const mostUsedFormat = Object.entries(formatStats).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";
    document.getElementById("stat-total").textContent = `📊 Total Prompts: ${total}`;
    document.getElementById("stat-tone").textContent = `🎭 Most Used Tone: ${mostUsedTone}`;
    document.getElementById("stat-format").textContent = `📄 Most Used Format: ${mostUsedFormat}`;
  }

  function showRetryButton() {
    retryBtn?.classList.remove("hidden");
  }
  function hideRetryButton() {
    retryBtn?.classList.add("hidden");
  }

  retryBtn?.addEventListener("click", async () => {
    if (!lastPromptPayload) return;
    outputBox.textContent = "⏳ Retrying...";
    hideRetryButton();
    try {
      const response = await fetch("http://localhost:5000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lastPromptPayload),
      });
      const data = await response.json();
      const result = data.result || "⚠️ AI returned no prompt.";
      outputBox.textContent = result;
      hideRetryButton();
      if (!result.startsWith("⚠️") && !result.startsWith("❌")) {
        updateVault(result);
        generateQRCode(result);
      }
    } catch (err) {
      outputBox.textContent = "❌ Retry failed.";
      console.error(err);
    }
  });

  toneButtons.forEach((button) => {
    button.addEventListener("click", () => {
      toneButtons.forEach(btn => btn.classList.remove("ring", "ring-offset-2", "ring-white"));
      button.classList.add("ring", "ring-offset-2", "ring-white");
      selectedTone = button.textContent.trim();
    });
  });

  if (generateBtn) {
    generateBtn.addEventListener("click", async () => {
      const role = roleInput.value.trim();
      const task = taskInput.value.trim();
      const format = formatInput.value.trim();
      const tone = selectedTone;

      if (!role || !task || !format || !tone) {
        outputBox.textContent = "⚠️ Please fill in all fields and select a tone.";
        return;
      }

      const fullPrompt = `Generate a prompt that the user can copy and give to any AI. The prompt should help the user achieve the following task: ${task}. It should be written from the perspective of a ${role} and should be in ${format} format. The tone should be ${tone} and should include any necessary context, background, or instructions to ensure the AI understands the request clearly. `;
    outputBox.innerHTML = `
  <div class="flex items-center gap-2 text-blue-300 text-sm">
    <svg class="animate-spin h-4 w-4 text-blue-300" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
    ⏳AI is writing your prompt...
  </div>
`;

      lastPromptPayload = { prompt: fullPrompt };
      hideRetryButton();

      const start = performance.now();
      try {
       const response = await fetch("https://0b4d-2401-4900-1c09-de39-6005-3e6d-8e86-af35.ngrok-free.app/generate", {

          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(lastPromptPayload),
        });
        const data = await response.json();
        const end = performance.now();
        const result = data.result || "⚠️ PromptPro returned no prompt.";

        const triggers = [
          "why this prompt works", "why this works", "✨ why this prompt works",
          "📝 why this prompt works", "✍️ why this prompt works",
          "**why this prompt is effective:**"
        ];
        let trimIndex = -1;
        for (const trigger of triggers) {
          const index = result.toLowerCase().indexOf(trigger);
          if (index !== -1 && (trimIndex === -1 || index < trimIndex)) {
            trimIndex = index;
          }
        }
        const trimmed = trimIndex !== -1 ? result.slice(0, trimIndex).trim() : result;
         const formattedResult = formatResponse(trimmed,false); 

        const duration = `\n\n⏱️ Time: ${(end - start).toFixed(1)}ms`;

        triggerSparkIcon();
   const ding = new Audio("assets/ding.mp3");
ding.play();

outputBox.innerHTML = `
  <div class="formatted-result" style="white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word; background: none;">
    ${formattedResult}
  </div>
  <div class="duration-text" style="background: none; margin: 0; padding: 0; display: block; opacity: 0.6;">
    ${duration}
  </div>
`;





        roleInput.value = "";
        taskInput.value = "";
        formatInput.value = "";
        document.getElementById("roleDropdown").value = "";
        document.getElementById("taskDropdown").value = "";
        document.getElementById("formatDropdown").value = "";
        roleInput.placeholder = "Write your own role...";
        taskInput.placeholder = "Write your own task...";
        formatInput.placeholder = "Write your own format...";

        updateVault(result);
        generateQRCode(result);
        updateStats(tone, format);
      } catch (error) {
        outputBox.textContent = "❌ Error contacting backend.";
        console.error(error);
      }
    });
  }

  copyBtn?.addEventListener("click", () => {
    const text = outputBox.textContent;
    if (text && !text.startsWith("⚠️") && !text.startsWith("⏳") && !text.startsWith("❌")) {
      navigator.clipboard.writeText(text).then(() => {
        copyBtn.textContent = "✅ Copied!";
        setTimeout(() => (copyBtn.textContent = "📋 Copy Prompt"), 2000);
      });
    }
  });

  function updateVault(promptText) {
    const vault = JSON.parse(localStorage.getItem("promptVault") || "[]");
    vault.unshift(promptText);
    if (vault.length > 10) vault.pop();
    localStorage.setItem("promptVault", JSON.stringify(vault));
    loadVault();
  }


  
  function generateQRCode(promptText) {
    qrCodeBox.innerHTML = "";
    if (!promptText || typeof promptText !== "string" || !promptText.trim()) return;
    if (typeof QRCode === "undefined") return;
    try {
      const blob = new Blob([promptText], { type: "text/plain" });
      const downloadURL = URL.createObjectURL(blob);
      new QRCode(qrCodeBox, {
        text: downloadURL,
        width: 128,
        height: 128,
        colorDark: document.body.classList.contains("dark-mode") ? "#ffffff" : "#000000",
        colorLight: document.body.classList.contains("dark-mode") ? "#0f172a" : "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });
      const link = document.createElement("a");
      link.href = downloadURL;
      link.download = "prompt.txt";
      link.textContent = "⬇️ Download Prompt";
      link.className = "block text-sm text-blue-300 underline text-center mt-2";
      qrCodeBox.appendChild(link);
    } catch (err) {
      console.error("❌ Failed to generate QR:", err);
    }
  }
function loadVault() {
  const vault = JSON.parse(localStorage.getItem("promptVault") || "[]");
  vaultList.innerHTML = "";
  vault.forEach((entry, index) => {
    const blob = new Blob([entry], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const li = document.createElement("li");
    li.className =
      "bg-white/5 hover:bg-white/10 transition-all border border-white/20 rounded-lg p-4 space-y-2";

    li.innerHTML = `
      <p class="text-white/80 text-sm leading-snug" id="vault-text-${index}">${entry.slice(0, 160)}...</p>
      <div class="flex justify-between items-center">
        <span class="text-xs text-slate-400">Prompt ${index + 1}</span>
        <div class="flex gap-2">
          <button class="text-xs text-green-400 hover:text-green-200 underline" onclick="copyVault(${index})">📋 Copy</button>
          <a href="${url}" download="prompt-${index + 1}.txt"
            class="text-xs text-blue-400 hover:text-blue-200 underline">⬇️ Download</a>
        </div>
      </div>
    `;

    vaultList.appendChild(li);
  });
}



  loadVault(); // Load prompt vault history
  updateStatsUI(); // Update statistics UI

}); // End of DOMContentLoaded
 
//✅ Function outside event listener — fine for global use  

//updated copyvault() func

function copyVault(index) {
  const textElement = document.getElementById(`vault-text-${index}`);
  if (textElement) {
    const text = textElement.textContent;

    navigator.clipboard.writeText(text).then(() => {
      const vaultItem = textElement.closest("li");
      if (vaultItem) {
        const copyBtn = vaultItem.querySelector("button");
        if (copyBtn) {
          copyBtn.textContent = "✅ Copied";
          copyBtn.disabled = true;
          setTimeout(() => {
            copyBtn.textContent = "📋 Copy";
            copyBtn.disabled = false;
          }, 1500);
        }
      }
    });
  }
}