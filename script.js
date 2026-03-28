const display = document.querySelector('.display');
const digits = document.querySelectorAll('.digits');
const backSpace = document.querySelector('.backspace');
const clear = document.querySelector('.clear');
const allOperators = document.querySelectorAll('.operator');
const equal = document.querySelector('.equal');

const add = (a, b) => {
    return a + b;
}

const subtract = (a, b) => {
    return a - b;
}

const multiply = (a, b) => {
    return a * b;
}

const divide = (a, b) => {
    if (b === 0) return `Error:can't divide by zero`;
    return a / b;
}

let firstNum = "";
let secondNum = "";
let currentOperator = null;
let shouldResetScreen = false;

function operate(op, a, b) {
    a = parseFloat(a);
    b = parseFloat(b);
    switch (op) {
        case "+": return add(a, b);
        case "-": return subtract(a, b);
        case "×": return multiply(a, b);
        case "÷": return divide(a, b);
        default: return null;
    }
}

digits.forEach(button => {
    button.addEventListener('click', () => {
        let value = button.textContent;

        if (shouldResetScreen) {
            display.textContent = '';
            shouldResetScreen = false;
        }

        if (value === '.' && display.textContent.includes('.')) {
            return;
        }

        if (display.textContent === '0' && value !== '.') {
            display.textContent = '';
        } 

        display.textContent += value;
    });
});


allOperators.forEach(opButton => {
    opButton.addEventListener('click', () => {
        if (currentOperator !== null && display.textContent !== "") {

            secondNum = display.textContent;
            const result = operate(currentOperator, firstNum, secondNum);
            display.textContent = Math.round(result * 1000) / 1000; // Rounding off
            firstNum = display.textContent;
            secondNum = "";
        } else {

            firstNum = display.textContent;
        }
        currentOperator = opButton.textContent;
        shouldResetScreen = true;
    });
});

equal.addEventListener('click', () => {
    if (currentOperator === null || shouldResetScreen) return;

    secondNum = display.textContent;
    const result = operate(currentOperator, firstNum, secondNum);

    display.textContent = Math.round(result * 1000) / 1000;
    firstNum = display.textContent;
    currentOperator = null;
    shouldResetScreen = true;
});

clear.addEventListener('click', () => {
    display.textContent = "0";
    firstNum = "";
    secondNum = "";
    currentOperator = null;
});

backSpace.addEventListener('click', () => {
    display.textContent = display.textContent.toString().slice(0, -1);
    if (display.textContent === "") display.textContent = "0";
});

