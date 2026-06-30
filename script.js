const display = document.querySelector('.display');
const digits = document.querySelectorAll('.digits');
const backSpace = document.querySelector('.backspace');
const clear = document.querySelector('.clear');
const allOperators = document.querySelectorAll('.operator');
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

const operate = (op, a, b) => {
  a = parseFloat(a);
  b = parseFloat(b);
  switch (op) {
    case '+':
      return add(a, b);
    case '-':
      return subtract(a, b);
    case '×':
      return multiply(a, b);
    case '÷':
      return divide(a, b);
    default:
      return null;
  }
};

function updateDisplay() {
  if (currentOperator === null) {
    display.textContent = firstNum || '0';
  } else {
    display.textContent = `${firstNum}${currentOperator}${secondNum}`;
  }
}

const appendNumber = (value) => {
  const currentValue = currentOperator === null ? firstNum : secondNum;

  if (value === '.' && currentValue.includes('')) return;

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
    const result = operate(currentOperator, firstNum, secondNum);

    firstNum = String(Math.round(result * 1000) / 1000);
    secondNum = '';
  }

  currentOperator = operator;

  updateDisplay();
};

allOperators.forEach((opButton) => {
  opButton.addEventListener('click', () => {
    handleOperator(opButton.textContent);
  });
});

const calculate = () => {
  if (!currentOperator || secondNum === '') return;

  const result = operate(currentOperator, firstNum, secondNum);

  display.textContent = Math.round(result * 1000) / 1000;

  firstNum = display.textContent;
  secondNum = '';
  currentOperator = null;
};

const clearDisplay = () => {
  display.textContent = '0';
  firstNum = '';
  secondNum = '';
  currentOperator = null;
};

const deleteNumber = () => {
  if (currentOperator === null) {
    firstNum = firstNum.slice(0, -1);
  } else if (secondNum !== '') {
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