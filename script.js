const display = document.querySelector('.display');
const buttonsContainer = document.querySelector('.buttons-container');
const digits = document.querySelectorAll('.digits');
const backSpace = document.querySelector('.backspace');
const clear = document.querySelector('.clear');
const allOperators = document.querySelectorAll('.operator');
const percentage = document.querySelector('.percentage');
const equal = document.querySelector('.equal');

const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => {
  if (b === 0) return `Error:can't divide by zero`;
  return a / b;
};

let expression = '';

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
    default:
      return null;
  }
};

const normalizeExpression = (value) => {
  let first = '';
  let second = '';
  let operator = '';
  let firstHasDecimal = false;
  let secondHasDecimal = false;
  let percentageApplied = false;

  for (const character of value) {
    if (character >= '0' && character <= '9') {
      if (!operator) {
        first += character;
      } else if (operator !== '%') {
        percentageApplied = false;
        second += character;
      }
    } else if (character === '.') {
      if (!operator && !firstHasDecimal) {
        first += first ? character : '0.';
        firstHasDecimal = true;
      } else if (operator && operator !== '%' && !secondHasDecimal) {
        percentageApplied = false;
        second += second ? character : '0.';
        secondHasDecimal = true;
      }
    } else if ('+-×÷'.includes(character)) {
      if (first && !operator) operator = character;
    } else if (character === '%') {
      if (first && !operator) {
        operator = '%';
      } else if (operator && operator !== '%' && second) {
        percentageApplied = true;
      }
    }
  }

  return `${first}${operator}${second}${percentageApplied ? '%' : ''}`;
};

const parseExpression = () => {
  const match = expression.match(
    /^(\d*(?:\.\d*)?)([+\-×÷%]?)(\d*(?:\.\d*)?)(%?)$/,
  );
  if (!match) return null;
  return {
    first: match[1],
    operator: match[2] || null,
    second: match[3],
    percentageApplied: match[4] === '%',
  };
};

const updateDisplaySize = () => {
  const length = (expression || '0').length;
  if (length <= 7) {
    display.dataset.size = 'short';
  } else if (length <= 9) {
    display.dataset.size = 'medium';
  } else if (length <= 12) {
    display.dataset.size = 'small';
  } else {
    display.dataset.size = 'tiny';
  }
};

function updateDisplay() {
  display.value = expression;
  updateDisplaySize();
}

const updateExpressionFromInput = () => {
  const rawValue = display.value;
  const caret = display.selectionStart ?? rawValue.length;
  expression = normalizeExpression(rawValue);

  if (expression !== rawValue) {
    const adjustedCaret = normalizeExpression(rawValue.slice(0, caret)).length;
    display.value = expression;
    display.setSelectionRange(adjustedCaret, adjustedCaret);
  }

  updateDisplaySize();
};

const insertAtCaret = (value) => {
  const start = display.selectionStart ?? expression.length;
  const end = display.selectionEnd ?? start;
  display.focus();
  display.setRangeText(value, start, end, 'end');
  display.dispatchEvent(new Event('input', { bubbles: true }));
};

const calculate = () => {
  const parts = parseExpression();
  if (!parts?.operator || !parts.second || parts.operator === '%') return;

  const result = operate(
    parts.operator,
    parts.first,
    parts.second,
    parts.percentageApplied,
  );
  expression = String(Math.round(result * 1000) / 1000);
  updateDisplay();
  display.setSelectionRange(expression.length, expression.length);
};

const addOperator = (operator) => {
  const parts = parseExpression();
  const caretAtEnd =
    display.selectionStart === expression.length &&
    display.selectionEnd === expression.length;

  if (caretAtEnd && parts?.operator && parts.second) {
    calculate();
    insertAtCaret(operator);
  } else if (parts?.operator && !parts.second) {
    const operatorPosition = parts.first.length;
    display.setRangeText(
      operator,
      operatorPosition,
      operatorPosition + 1,
      'end',
    );
    display.dispatchEvent(new Event('input', { bubbles: true }));
  } else {
    insertAtCaret(operator);
  }
};

const clearDisplay = () => {
  expression = '';
  updateDisplay();
  display.focus();
  display.setSelectionRange(0, 0);
};

const deleteAtCaret = (forward = false) => {
  const start = display.selectionStart ?? expression.length;
  const end = display.selectionEnd ?? start;
  if (start === end && (forward ? end === expression.length : start === 0))
    return;

  const deleteStart = start === end && !forward ? start - 1 : start;
  const deleteEnd = start === end && forward ? end + 1 : end;
  display.setRangeText('', deleteStart, deleteEnd, 'start');
  display.dispatchEvent(new Event('input', { bubbles: true }));
  display.focus();
};

display.addEventListener('input', updateExpressionFromInput);

let clickHighlightTimeout;

buttonsContainer.addEventListener('click', (event) => {
  if (!(event.target instanceof Element)) return;

  const button = event.target.closest('button');
  if (!button) return;

  buttonsContainer.querySelector('.is-clicked')?.classList.remove('is-clicked');
  button.classList.add('is-clicked');
  window.clearTimeout(clickHighlightTimeout);
  clickHighlightTimeout = window.setTimeout(() => {
    button.classList.remove('is-clicked');
  }, 150);
});

digits.forEach((button) => {
  button.addEventListener('click', () => insertAtCaret(button.textContent));
});

allOperators.forEach((button) => {
  button.addEventListener('click', () => addOperator(button.textContent));
});

percentage.addEventListener('click', () => insertAtCaret('%'));
clear.addEventListener('click', clearDisplay);
backSpace.addEventListener('click', () => deleteAtCaret());
equal.addEventListener('click', calculate);

const handleKeyboardInput = (event) => {
  if (event.key === 'Escape') {
    clearDisplay();
  } else if (event.key === 'Enter' || event.key === '=') {
    event.preventDefault();
    calculate();
  } else if (event.key === 'Backspace' && document.activeElement !== display) {
    event.preventDefault();
    deleteAtCaret();
  } else if (event.key === 'Delete' && document.activeElement !== display) {
    event.preventDefault();
    deleteAtCaret(true);
  } else if (event.key === '*' || event.key === '/') {
    event.preventDefault();
    addOperator(event.key === '*' ? '×' : '÷');
  } else if (
    document.activeElement !== display &&
    ((event.key >= '0' && event.key <= '9') ||
      event.key === '.' ||
      event.key === '%')
  ) {
    insertAtCaret(event.key);
  } else if (['+', '-'].includes(event.key)) {
    const caretAtEnd =
      display.selectionStart === expression.length &&
      display.selectionEnd === expression.length;
    if (document.activeElement !== display || caretAtEnd) {
      event.preventDefault();
      addOperator(event.key);
    }
  }
};

window.addEventListener('keydown', handleKeyboardInput);
updateDisplay();
