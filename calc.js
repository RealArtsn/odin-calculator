// initialize calculator object
const calculator = {
    stored: 0,
    currentOperation: ''
};


// on page load
function init() {

    // get all buttons
    buttons = document.querySelectorAll('.button');
    
    // add a click listener to every button
    buttons.forEach(button => {
        button.addEventListener('click', handleButtonClick);
    })

}

// action performed when button is clicked
function handleButtonClick(e) {
    // if number is clicked, append to display
    if (this.classList.contains('num')) {
        // store previous number and input new one if operator was selected
        const operation = getCurrentOperation();
        if (operation) {
            
            clearDisplay();

        }
        concatDisplay(this.querySelector('h2').textContent);
        return;
    }

    // set current operation if operator is selected
    if (['add','subtract','divide','multiply'].includes(this.id)) {
        setCurrentOperation(this.id);
    }

    // decide what to do if other key is clicked
    switch (this.id) {
        case 'C':
            clearDisplay();
            break;
        case 'CE':
            resetCalculator();
            break;
    }
}

// store displayed number to calculator object
function storeDisplayedNumber() {
    setStoredNumber(+getDisplayedNumber());
}

// set stored number in calculator object
function setStoredNumber(n) {
    calculator.stored = n;
}

// clear stored number and display
function resetCalculator() {
    clearDisplay();
    calculator.stored = 0;
    calculator.currentOperation = '';
}

function getStoredNumber() {
    return calculator.stored;
}

// take operator and two numbers and return calculation
function operate(operator, a, b) {
    switch (operator) {
        // https://en.wikipedia.org/wiki/Mathematical_operators_and_symbols_in_Unicode
        case '+': // U+002B
            return add(a, b);
        case '−': // U+2212
            return subtract(a, b);
        case 'X': // just X
            return multiply(a, b);
        case '÷': // U+00F7
            return divide(a, b);
    }
}

// add
function add(a, b) {
    return a + b;
}
// subtract
function subtract(a, b) {
    return a + b;
}
// multiply
function multiply(a, b) {
    return a * b;
}
// divide
function divide(a, b) {
    return a / b;
}

// get number currently displayed
function getDisplayedNumber() {
    return document.querySelector('#display h1').textContent;
}

function setDisplayedNumber(number) {
    const displayNode = document.querySelector('#display h1');
    console.log(displayNode);
    console.log('text before setting:' + displayNode.textContent);
    console.log('setting display to ' + number);
    displayNode.textContent = number;
    console.log('text after setting: ' + displayNode.textContent)
}


// concatenate number to display
function concatDisplay(n) {
    setDisplayedNumber(getDisplayedNumber() + n);
}

// clear display
function clearDisplay() {
    setDisplayedNumber('');
}

function getCurrentOperation() {
    return calculator.currentOperation;
}

function setCurrentOperation(operation) {
    calculator.currentOperation = operation;
}

// run init function on page load
init();