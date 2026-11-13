const display = document.querySelector('.display');
const digits = document.querySelectorAll('.digits');
const backSpace = document.querySelector('.backspace');
const clear = document.querySelector('.clear');
const allOperators = document.querySelectorAll('.operator');
const percentage = document.querySelector('.percentage');
const equal = document.querySelector('.equal');

const add = (a, b) => {
  return a + b;
};

const subtract = (a, b) => {
  return a - b;
};

const multiply = (a, b) => {
  return a * b;
};

const divide = (a, b) => {
  if (b === 0) return `Error:can't divide by zero`;
  return a / b;
};

let firstNum = '';
let secondNum = '';
let currentOperator = null;
let percentageApplied = false;

const operate = (op, a, b, usePercentage = false) => {
  a = parseFloat(a);
  b = parseFloat(b);
  switch (op) {
    case '+':
      return add(a, usePercentage ? (a * b) / 100 : b);
    case '-':
      return subtract(a, usePercentage ? (a * b) / 100 : b);
    case '×':
      return multiply(a, usePercentage ? b / 100 : b);
    case '÷':
      return divide(a, usePercentage ? b / 100 : b);
    case '%':
      return (a * b) / 100;
    default:
      return null;
  }
};

function updateDisplay() {
  if (currentOperator === null) {
    display.textContent = firstNum || '0';
  } else {
    display.textContent = `${firstNum}${currentOperator}${secondNum}${percentageApplied ? '%' : ''}`;
  }

  // Decides when to adjust font size in display
  const length = display.textContent.length;

  if (length <= 7) {
    display.dataset.size = 'short';
  } else if (length <= 9) {
    display.dataset.size = 'medium';
  } else if (length <= 12) {
    display.dataset.size = 'small';
  } else {
    display.dataset.size = 'tiny';
  }
}

const appendNumber = (value) => {
  percentageApplied = false;
  const currentValue = currentOperator === null ? firstNum : secondNum;

  // Don't allow more than one Decimal point
  if (value === '.' && currentValue.includes('.')) return;

  if (currentOperator === null) {
    if (value === '.' && firstNum === '') {
      firstNum = '0.';
    } else {
      firstNum += value;
    }
  } else {
    if (value === '.' && secondNum === '') {
      secondNum = '0.';
    } else {
      secondNum += value;
    }
  }

  updateDisplay();
};

digits.forEach((button) => {
  button.addEventListener('click', () => {
    appendNumber(button.textContent);
  });
});

const handleOperator = (operator) => {
  if (firstNum === '') return;

  if (currentOperator !== null && secondNum !== '') {
    const result = operate(currentOperator, firstNum, secondNum, percentageApplied);

    firstNum = String(Math.round(result * 1000) / 1000);
    secondNum = '';
    percentageApplied = false;
  }

  currentOperator = operator;

  updateDisplay();
};

const handlePercentage = () => {
  if (firstNum === '') return;

  if (currentOperator === null) {
    currentOperator = '%';
  } else if (currentOperator === '%' || secondNum === '') {
    return;
  } else {
    percentageApplied = true;
  }

  updateDisplay();
};

allOperators.forEach((opButton) => {
  opButton.addEventListener('click', () => {
    handleOperator(opButton.textContent);
  });
});

percentage.addEventListener('click', handlePercentage);

const calculate = () => {
  if (!currentOperator || secondNum === '') return;

  const result = operate(currentOperator, firstNum, secondNum, percentageApplied);

  display.textContent = Math.round(result * 1000) / 1000;

  firstNum = display.textContent;
  secondNum = '';
  currentOperator = null;
  percentageApplied = false;
  updateDisplay();
};

const clearDisplay = () => {
  firstNum = '';
  secondNum = '';
  currentOperator = null;
  percentageApplied = false;
  updateDisplay();
};

const deleteNumber = () => {
  if (currentOperator === null) {
    firstNum = firstNum.slice(0, -1);
  } else if (secondNum !== '') {
    percentageApplied = false;
    secondNum = secondNum.slice(0, -1);
  } else {
    currentOperator = null;
  }

  updateDisplay();
};

clear.addEventListener('click', clearDisplay);
backSpace.addEventListener('click', deleteNumber);
equal.addEventListener('click', calculate);

// Keyboard Support

const handleKeyboardInput = (e) => {
  if (e.key === 'Escape') {
    clearDisplay();
  } else if (e.key === 'Backspace') {
    deleteNumber();
  } else if (e.key === '=' || e.key === 'Enter') {
    e.preventDefault();
    calculate();
  } else if (e.key === '%') {
    handlePercentage();
  } else if (['+', '-', '*', '/'].includes(e.key)) {
    let operator = e.key;

    if (operator === '*') operator = '×';
    if (operator === '/') operator = '÷';

    handleOperator(operator);
  } else if ((e.key >= 0 && e.key <= 9) || e.key === '.') {
    appendNumber(e.key);
  }
};

window.addEventListener('keydown', handleKeyboardInput);