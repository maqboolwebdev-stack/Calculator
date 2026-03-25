const display = document.querySelector('input');
const buttons = document.querySelectorAll('button');

buttons.forEach(button => {
    button.addEventListener('click', function() {
    display.disabled = false;
    display.value += button.textContent;
    console.log(button);
    });
});