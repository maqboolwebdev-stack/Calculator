const display = document.querySelector('.display');
const buttons = document.querySelectorAll('.btn');

let currentInput = '0'; 
let operator = null; 
let previousInput = ''; 
let shouldResetScreen = false; 

buttons.forEach(button => {
    button.addEventListener('click', (e) => {
        const buttonText = e.target.textContent;

        if (e.target.classList.contains('number') || e.target.classList.contains('decimal')) {
            appendNumber(buttonText);
        } else if (e.target.classList.contains('clear')) {
            clearCalculator();
        } else if (e.target.classList.contains('delete')) {
            deleteLastDigit();
        } else if (e.target.classList.contains('operator')) {
            setOperator(buttonText);
        } else if (e.target.classList.contains('equal')) {
            calculate();
        }

        updateDisplay(); 
    });
});// END OF FOREACH LOOP


// KEYBOARD SUPPORT 
document.addEventListener('keydown', (e) => {
    const key = e.key;

    if ((key >= '0' && key <= '9') || key === '.') {
        appendNumber(key);
    } else if (key === '+' || key === '-') {
        setOperator(key);
    } else if (key === '*') {
        setOperator('x'); 
    } else if (key === '/') {
        setOperator('÷');
        e.preventDefault();
    } else if (key === 'Enter' || key === '=') {
        calculate();
        e.preventDefault();
    } else if (key === 'Backspace') {
        deleteLastDigit();
    } else if (key === 'Escape') {
        clearCalculator();
    }
 
    updateDisplay();
});
//  END OF KEYBOARD SUPPORT 

function updateDisplay() {
    if (operator && !shouldResetScreen) {
        display.value = `${previousInput} ${operator} ${currentInput}`;
    } else if (operator && shouldResetScreen) {
        display.value = `${previousInput} ${operator}`;
    } else {
        display.value = currentInput;
    }
}

function appendNumber(number) {
    if (shouldResetScreen) {
        currentInput = '0'; 
        shouldResetScreen = false;
    }
    
    if (currentInput === '0' && number !== '.') {
        currentInput = number;
    } else if (number === '.' && currentInput.includes('.')) {
        return;
    } else {
        currentInput += number;
    }
}

function setOperator(nextOperator) {
    if (currentInput === '0' && previousInput === '') {
        return;
    }

    if (previousInput !== '' && operator !== null && !shouldResetScreen) {
        calculate();

        operator = nextOperator;
        previousInput = currentInput;
        shouldResetScreen = true;
    } else if (previousInput === '') {
        operator = nextOperator;
        previousInput = currentInput;
        shouldResetScreen = true;
    } else {
        operator = nextOperator;
        shouldResetScreen = true;
    }
    
}

function calculate() {
    if (previousInput === '' || operator === null || shouldResetScreen) return;

    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    if (isNaN(prev) || isNaN(current)) return;

    switch (operator) {
        case '+': result = prev + current; break;
        case '-': result = prev - current; break;
        case 'x': result = prev * current; break;
        case '÷':
            if (current === 0) {
                alert("Divide by zero error!");
                clearCalculator();
                return;
            }
            result = prev / current;
            break;
        case '%': result = (prev / 100) * current; break;
        default: return;
    }
 
    currentInput = result.toString();
    operator = null; 
    previousInput = '';
    shouldResetScreen = true; 
}


function clearCalculator() {
    currentInput = '0'; 
    operator = null;
    previousInput = '';
    shouldResetScreen = false;
}

function deleteLastDigit() {
    if (currentInput.length === 1 || shouldResetScreen) {
        currentInput = '0';
        shouldResetScreen = false;
    } else if (currentInput !== '0') {
        currentInput = currentInput.toString().slice(0, -1);
    }
}


updateDisplay();