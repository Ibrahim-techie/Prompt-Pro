Mini Project for My College
# PromptPro – AI Prompt Builder Web App

PromptPro is a web-based tool designed to help users craft high-quality prompts tailored for AI models like ChatGPT, Gemini, or Claude. It simplifies the process of prompt engineering by offering an intuitive interface that lets users define roles, tasks, output formats, and tones, and then generates optimized prompts automatically using AI.

---

## 🌟 Features

- 🔧 Role, Task, Format, and Tone-based prompt construction
- ✨ Typing animation for generated prompts
- 📋 Copy to clipboard with feedback
- 🔁 Retry generation button
- 📈 Local prompt usage statistics (most used tone/format, prompt count)
- 🔐 Secure backend Gemini API integration
- 🔗 QR code generator + prompt vault
- 🧠 Integrated helper bot (optional modular project)
- 🌗 Dark mode toggle & builder panel toggle
- 🎵 Prompt-ready sound effect

---

## 🚀 Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Frontend    | HTML, Tailwind CSS, JavaScript    |
| Backend     | Node.js (Express), GeminiAI API     |
| Animations  | Lucide Icons, Typewriter Effect   |
| Data Storage| LocalStorage, Blob, File API      |
| Others      | QRCode.js, tsParticles.js         |

---

## 📁 Project Structure
```
📦 promptpro/
├── index.html               # Main UI layout
├── assets/
│   ├── js/
│   │   ├── app.js           # Core logic & API integration
│   │   └── ui.js            # UI population & suggestion logic
│   └── images/              # Background, icons, etc.
├── backend/
│   ├── server.js            # Node.js backend for OpenAI
│   └── .env                 # Gemini API Key (never expose!)
├── assets/sfx/ding.mp3      # Optional sound file
---
```
## 🧑‍💻 How It Works

1. User selects:
   - Role (or adds their own)
   - Task (or adds their own)
   - Format (e.g. bullet points, tweet, blog)
   - Tone (e.g. Professional, Funny, Creative)

2. A structured prompt string is sent to the backend like:
   > "Create an optimized AI prompt for a user who wants to write a product description, as a content writer, in a persuasive format using a conversational tone."

3. Backend securely contacts OpenAI API and returns a full prompt.
4. Frontend displays it with animation, sound, copy/download, and QR features.
5. Stats are tracked locally (most-used tone, format, total prompts).

---

## 🤖 The Bot Module (Optional)

Although integrated into PromptPro, the AI Helper Bot was built as a separate, modular feature. It listens for user activity and suggests contextual completions, prompt enhancers (e.g., "...explain like I'm 5"), and template refinements. 

- Written in JavaScript
- Fully decoupled, reusable in other apps
- Can be extended with AI model suggestions

---

## 🛡️ Security Notes

- API key is never exposed to the frontend
- CORS enabled on backend
- Always use environment variables to store secrets

---

## 🔧 Installation

### 1. Clone the Repo
```
git clone https://github.com/Ibrahim-techie/Prompt-Pro
cd promptpro/backend
```
### 2. Backend Setup
```bash
npm install
# Create a .env file with:
Gemini_API_KEY=your_openai_key_here
node server.js
```
### 3. Frontend Setup
Just open index.html in a browser. All frontend scripts are embedded and local.

---

## 🖼️ Screenshots

You can include screenshots like:
- Main UI with dark mode
- Prompt being generated
- QR code download
- Prompt stats display

---

## 📄 License

MIT License — Free to use and modify.

---

## 🙋‍♂️ Author

Created by Ibrahim Hatodwala, BTech CSE Student | Full Stack Developer |
 [@ibrahim-techie](https://github.com/ibrahim-techie) with ❤️ for Mini-Project in College.

Connect with me on [LinkedIn](https://www.linkedin.com/in/ibrahim-hatodwala)
