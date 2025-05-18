// ✅ ui.js – handles filling inputs based on selected audience and editable dropdowns

console.log("✅ ui.js loaded");
//autocomplete logic
const roleSuggestions = [
  "Act as a UX designer",
  "Act as a software architect",
  "Act as a creative writing teacher",
  "Act as a resume reviewer"
];

const taskSuggestions = [
  "Explain recursion like you're talking to a 5-year-old",
  "Generate a 10-point list of interview tips",
  "Summarize the concept of machine learning in simple terms",
  "Help me write a catchy product description"
];


const templates = {
  student: {
    role: ["Act as a helpful tutor", "Act as a math teacher", "Act as a science explainer"],
    task: ["Explain recursion using real-life examples", "Summarize Newton's laws", "Break down photosynthesis process"],
    format: ["Bullet points", "Simple explanation", "Step-by-step guide"]
  },
  developer: {
    role: ["Act as a senior software engineer", "Act as a code reviewer", "Act as a Python mentor"],
    task: ["Write a function to reverse a string in Python", "Explain the concept of closures", "Refactor code for readability"],
    format: ["Code with explanation", "Inline comments", "Code snippets"]
  },
  designer: {
    role: ["Act as a UX consultant", "Act as a product designer", "Act as a UI critic"],
    task: ["List tips for creating a minimal mobile onboarding experience", "Explain color theory in UI", "Review a landing page layout"],
    format: ["Paragraph", "Visual checklist", "Key principles"]
  }
};

function populateDropdown(dropdownId, options) {
  const dropdown = document.getElementById(dropdownId);
  dropdown.innerHTML = `<option value="" disabled selected>Select a suggestion</option>`;
  options.forEach(option => {
    const opt = document.createElement("option");
    opt.value = option;
    opt.textContent = option;
    dropdown.appendChild(opt);
  });
}

function loadTemplate(audienceType) {
  const data = templates[audienceType];
  if (!data) return;

  populateDropdown("roleDropdown", data.role);
  populateDropdown("taskDropdown", data.task);
  populateDropdown("formatDropdown", data.format);

  // Reset input fields and placeholder
  const inputs = {
    role: "Write your own role...",
    task: "Write your own task...",
    format: "Write your own format..."
  };

  for (let key in inputs) {
    const input = document.getElementById(key);
    input.value = "";
    input.placeholder = inputs[key];

    const dropdown = document.getElementById(`${key}Dropdown`);
    if (dropdown) dropdown.value = "";
  }
}

["roleDropdown", "taskDropdown", "formatDropdown"].forEach(id => {
  document.getElementById(id).addEventListener("change", e => {
    const inputId = id.replace("Dropdown", "");
    document.getElementById(inputId).value = e.target.value;
  });
});

["role", "task", "format"].forEach(id => {
  document.getElementById(id).addEventListener("input", e => {
    const dropdown = document.getElementById(id + "Dropdown");
    const match = Array.from(dropdown.options).find(opt => opt.value === e.target.value);
    dropdown.value = match ? match.value : "";
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const selector = document.getElementById("audienceSelector");
  loadTemplate(selector.value);
  selector.addEventListener("change", e => {
    loadTemplate(e.target.value);
  });
});
//autocomplete function 
function setupAutocomplete(inputId, boxId, suggestions) {
  const input = document.getElementById(inputId);
  const box = document.getElementById(boxId);

  input.addEventListener("input", () => {
    const value = input.value.toLowerCase();
    box.innerHTML = ""; // Clear suggestions box on input

    if (!value) {
      box.classList.add("hidden"); // Hide box if no input
      return;
    }

    const filtered = suggestions.filter(s => s.toLowerCase().includes(value));

    if (filtered.length === 0) {
      box.classList.add("hidden"); // Hide box if no matches
      return;
    }

    filtered.forEach(suggestion => {
      const li = document.createElement("li");
      li.textContent = suggestion;
      li.className = "hover:bg-gray-100 text-black px-2 py-1 cursor-pointer";
      li.addEventListener("click", () => {
        input.value = suggestion; // Auto-complete the input
        box.classList.add("hidden"); // Hide the box after selection
      });
      box.appendChild(li);
    });

    box.classList.remove("hidden"); // Show suggestions box
    const rect = input.getBoundingClientRect();
    box.style.top = `${input.offsetTop + input.offsetHeight}px`;
    box.style.left = `${input.offsetLeft}px`;
    box.style.width = `${input.offsetWidth}px`;
  });

  // Hide suggestions box if clicked outside
  document.addEventListener("click", (e) => {
    if (!box.contains(e.target) && e.target !== input) {
      box.classList.add("hidden");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupAutocomplete("role", "roleSuggestionsBox", roleSuggestions);
  setupAutocomplete("task", "taskSuggestionsBox", taskSuggestions);
});