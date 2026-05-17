const expressionInput = document.getElementById("expression");
const resultOutput = document.getElementById("result");
const buttons = document.querySelectorAll(".button-grid button");
const calculateButton = document.getElementById("calculate");
const clearButton = document.getElementById("clear");

const updateResult = (text) => {
  resultOutput.textContent = text;
};

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
  } catch (error) {
    updateResult("Network error. Try again.");
    console.error(error);
  }
});

expressionInput.addEventListener("keydown", async (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    calculateButton.click();
  }
});
