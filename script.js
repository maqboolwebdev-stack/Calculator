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

const operate = (op, a, b) => {
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

const appendNumber = (value) => {
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
    };

    digits.forEach(button => {
        button.addEventListener('click', () => {
            appendNumber(button.textContent);
        })
    });

const handleOperator = (operator) => {
    if (currentOperator !== null && display.textContent !== "") {
        secondNum = display.textContent;
        const result = operate(currentOperator, Number(firstNum), Number(secondNum));

        display.textContent = Math.round(result * 1000) / 1000; // Round Off
        firstNum = display.textContent;
        secondNum = "";
    } else {
        firstNum = display.textContent;
    }

    currentOperator = operator;
    shouldResetScreen = true;
}

allOperators.forEach(opButton => {
    opButton.addEventListener('click', () => {
        handleOperator(opButton.textContent);
    });
});

const calculate = () => {
    if (currentOperator === null || shouldResetScreen) return;

    secondNum = display.textContent;
    const result = operate(currentOperator, firstNum, secondNum);

    display.textContent = Math.round(result * 1000) / 1000;
    firstNum = display.textContent;
    currentOperator = null;
    shouldResetScreen = true;
}

const clearDisplay = () => {
    display.textContent = "0";
    firstNum = "";
    secondNum = "";
    currentOperator = null;
}

const deleteNumber = () => {
    display.textContent = display.textContent.toString().slice(0, -1);
    if (display.textContent === "") display.textContent = "0";
}

clear.addEventListener('click', clearDisplay);
backSpace.addEventListener('click', deleteNumber);
equal.addEventListener('click', calculate);

// Keyboard Support

const handleKeyboardInput = (e) => {
    if(e.key === 'Escape') {
        clearDisplay();
    } else if(e.key === 'Backspace') {
        deleteNumber();
    } else if(e.key === '=' || e.key === 'Enter') {
        e.preventDefault()
        calculate();
    } else if(['+','-','*','/'].includes(e.key)) {
    let operator = e.key;

    if (operator === '*') operator = '×';
    if (operator === '/') operator = '÷';

    handleOperator(operator);
    } else if(e.key >= 0 && e.key <= 9 || e.key === '.') {
        appendNumber(e.key);
    }
}

window.addEventListener('keydown', handleKeyboardInput);