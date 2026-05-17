const historyKey = "calculatorHistory";
const expressionInput = document.getElementById("expression");
const resultOutput = document.getElementById("result");
const buttons = document.querySelectorAll(".button-grid button");
const calculateButton = document.getElementById("calculate");
const clearButton = document.getElementById("clear");
const historyList = document.getElementById("history");
const clearHistoryButton = document.getElementById("clear-history");

let history = loadHistory();

const updateResult = (text) => {
  resultOutput.textContent = text;
};

function loadHistory() {
  const raw = localStorage.getItem(historyKey);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveHistory(items) {
  localStorage.setItem(historyKey, JSON.stringify(items));
}

function renderHistory() {
  if (!history.length) {
    historyList.innerHTML = '<li class="history-empty">No history yet.</li>';
    return;
  }

  historyList.innerHTML = history
    .map(
      (entry, index) =>
        `<li class="history-item" data-index="${index}"><span>${entry.expression}</span><span>${entry.result}</span></li>`
    )
    .join("");
}

function addHistory(expression, result) {
  const entry = { expression, result };
  history = [entry, ...history].slice(0, 10);
  saveHistory(history);
  renderHistory();
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.dataset.value;
    if (!value) return;
    expressionInput.value += value;
    expressionInput.focus();
  });
});

clearButton.addEventListener("click", () => {
  expressionInput.value = "";
  updateResult("Result will appear here");
});

calculateButton.addEventListener("click", async () => {
  const expression = expressionInput.value.trim();
  if (!expression) {
    updateResult("Enter an expression to calculate.");
    return;
  }

  updateResult("Calculating...");

  try {
    const response = await fetch("/api/calc", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ expression }),
    });

    const data = await response.json();
    if (!response.ok) {
      updateResult(data.detail || "Unable to compute expression.");
      return;
    }

    updateResult(`Result: ${data.result}`);
    addHistory(expression, data.result);
  } catch (error) {
    updateResult("Network error. Try again.");
    console.error(error);
  }
});

expressionInput.addEventListener("keydown", async (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    calculateButton.click();
    return;
  }

  if (event.key === "Escape") {
    event.preventDefault();
    clearButton.click();
  }
});

historyList.addEventListener("click", (event) => {
  const item = event.target.closest(".history-item");
  if (!item) return;

  const index = Number(item.dataset.index);
  const entry = history[index];
  if (!entry) return;

  expressionInput.value = entry.expression;
  expressionInput.focus();
});

clearHistoryButton.addEventListener("click", () => {
  history = [];
  saveHistory(history);
  renderHistory();
  updateResult("History cleared");
});

renderHistory();
