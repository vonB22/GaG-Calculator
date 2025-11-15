const weight1Input = document.getElementById("weight1");
const ageInput = document.getElementById("age");
const resultDiv = document.getElementById("result");
const errorMessage = document.getElementById("errorMessage");
const calculateBtn = document.getElementById("calculateBtn");
const clearBtn = document.getElementById("clearBtn");
const exportBtn = document.getElementById("exportBtn");
const tableBody = document.querySelector("#weightTable tbody");

let currentBaseWeight = null;
let currentInputAge = null;

// Function to calculate Grow a Garden weight with scaling factor
// Uses reference table and scales based on input weight at input age
function calculateWeight(inputWeight, inputAge, targetAge) {
  // Original table reference: weight at input age
  const tableWeightAtInputAge = 6.11 + (inputAge - 1) * 0.555; // linear original increment
  
  // Scaling factor to match input weight
  const factor = inputWeight / tableWeightAtInputAge;
  
  // Calculate age 0 weight and increment based on scaling factor
  const age0Weight = (6.11 - 0.555) * factor;
  const increment = 0.555 * factor;
  
  // Return weight at the target age
  return age0Weight + targetAge * increment;
}

// Function to get weight class
function getWeightClass(weight) {
  if (weight < 4.0) return "Normal";
  if (weight < 5.0) return "Semi Huge";
  if (weight < 7.0) return "Huge";
  if (weight < 8.0) return "Semi Titanic";
  if (weight < 10.0) return "Titanic";
  return "Colossal";
}

// Function to get class key for styling
function getClassKey(weight) {
  if (weight < 4.0) return "normal";
  if (weight < 5.0) return "semi-huge";
  if (weight < 7.0) return "huge";
  if (weight < 8.0) return "semi-titanic";
  if (weight < 10.0) return "titanic";
  return "colossal";
}

// Function to validate inputs
function validateInputs(weight, age) {
  if (isNaN(weight) || isNaN(age)) {
    return { valid: false, message: "Please enter valid numbers." };
  }
  if (weight <= 0) {
    return { valid: false, message: "Weight must be greater than 0." };
  }
  if (age <= 0 || age > 100) {
    return { valid: false, message: "Age must be between 1 and 100." };
  }
  return { valid: true };
}

// Function to show error
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
  resultDiv.style.display = "none";
}

// Function to hide error
function hideError() {
  errorMessage.style.display = "none";
}

// Function to generate table from age 1–125
function generateTable(inputWeight, inputAge) {
  tableBody.innerHTML = "";
  for (let i = 1; i <= 125; i++) {
    const w = calculateWeight(inputWeight, inputAge, i).toFixed(2);
    const row = `<tr data-age="${i}"><td>${i}</td><td>${w}</td></tr>`;
    tableBody.innerHTML += row;
  }
}

// Function to display result
function displayResult(weightAtAge1) {
  const weightClass = getWeightClass(weightAtAge1);
  document.getElementById("resultAge").textContent = 1;
  document.getElementById("resultWeight").textContent = `${weightAtAge1.toFixed(2)} kg`;
  document.getElementById("weightClass").textContent = weightClass;
  resultDiv.style.display = "block";
  hideError();
}

// Scroll to specific age in table
function scrollToAge(age) {
  const row = tableBody.querySelector(`tr[data-age="${age}"]`);
  if (row) {
    row.scrollIntoView({ behavior: "smooth", block: "center" });
    row.classList.add("highlight-row");
    setTimeout(() => row.classList.remove("highlight-row"), 2000);
  }
}

// Export table as CSV
function exportTableAsCSV() {
  if (!currentBaseWeight || !currentInputAge) return;
  
  let csv = "Age (years),Weight (kg),Weight Class\n";
  for (let i = 1; i <= 125; i++) {
    const weight = calculateWeight(currentBaseWeight, currentInputAge, i);
    const weightClass = getWeightClass(weight);
    csv += `${i},${weight.toFixed(2)},${weightClass}\n`;
  }
  
  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "weight-progression.csv";
  a.click();
  window.URL.revokeObjectURL(url);
}

// Event listeners
calculateBtn.addEventListener("click", performCalculation);

clearBtn.addEventListener("click", () => {
  weight1Input.value = "";
  ageInput.value = "";
  resultDiv.style.display = "none";
  tableBody.innerHTML = "";
  hideError();
  currentBaseWeight = null;
  weight1Input.focus();
});

exportBtn.addEventListener("click", exportTableAsCSV);

// Allow Enter key to calculate
weight1Input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") performCalculation();
});

ageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") performCalculation();
});

// Real-time validation
weight1Input.addEventListener("input", () => {
  const weight = parseFloat(weight1Input.value);
  if (weight1Input.value && weight <= 0) {
    weight1Input.classList.add("invalid");
  } else {
    weight1Input.classList.remove("invalid");
  }
});

ageInput.addEventListener("input", () => {
  const age = parseFloat(ageInput.value);
  if (ageInput.value && (age <= 0 || age > 100)) {
    ageInput.classList.add("invalid");
  } else {
    ageInput.classList.remove("invalid");
  }
});

// Shortcut buttons
document.querySelectorAll(".shortcut-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const age = parseInt(btn.dataset.age);
    scrollToAge(age);
  });
});

function performCalculation() {
  const weight1 = parseFloat(weight1Input.value);
  const age = parseFloat(ageInput.value);

  const validation = validateInputs(weight1, age);
  if (!validation.valid) {
    showError(validation.message);
    return;
  }

  currentBaseWeight = weight1;
  currentInputAge = age;
  const weightAtAge1 = calculateWeight(weight1, age, 1);

  displayResult(weightAtAge1);
  generateTable(weight1, age);
}