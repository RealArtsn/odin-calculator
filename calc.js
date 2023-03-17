// initialize calculator object
const calculator = new Object();

// on page load
function init() {
    // set calculator properties
    resetCalculator();
    
    // add a click listener to every button
    document.querySelectorAll('.button').forEach(button => {
        button.addEventListener('click', handleButtonClick);
    })

}

// action performed when button is clicked
function handleButtonClick(e) {
    // if number is clicked, append to display
    if (this.classList.contains('num')) {
        // store previous number and input new one if operator was selected
        if (getClearOnEntry()) {
            // store previous number
            storeDisplayedNumber();
            // clear display to make way for new number
            clearDisplay();
            // allow subsequent number entries to concat
            setClearOnEntry(false);
        }
        concatDisplay(this.querySelector('h2').textContent);
        return;
    }

    // set current operation if operator is selected
    if (['add','subtract','divide','multiply'].includes(this.id)) {
        setCurrentOperation(this.id);
        setClearOnEntry(true)
        return
    }

    // decide what to do if other key is clicked
    switch (this.id) {
        case '=':
            if (getStoredNumber() === NaN) break;
            console.log('operating');
            console.log('current operation: ' + getCurrentOperation());
            console.log('stored number: ' + getStoredNumber());
            console.log('displayed number: ' + getDisplayedNumber());
            const result = operate(getCurrentOperation(), getStoredNumber(), getDisplayedNumber());
            console.log('result: ' + result);
            setDisplayedNumber(result);
            break;
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


function getStoredNumber() {
    return calculator.stored;
}

// take operator and two numbers and return calculation
function operate(operator, a, b) {
    // convert to numbers
    a = +a;
    b = +b;
    
    // select operation based on provided string
    switch (operator) {
        case 'add': 
            return add(a, b);
        case 'subtract': 
            return subtract(a, b);
        case 'multiply': 
            return multiply(a, b);
        case 'divide': 
            return divide(a, b);
    }
}

// add
function add(a, b) {
    return a + b;
}
// subtract
function subtract(a, b) {
    return a - b;
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

// set number to be displayed on calculator
function setDisplayedNumber(number) {
    console.log('setting display to ' + number);
    document.querySelector('#display h1').textContent = number;
}


// concatenate number to display
function concatDisplay(n) {
    // clear if initial number is 0
    if (getDisplayedNumber() === '0') {
        clearDisplay();
    }
    // add number to end of display
    setDisplayedNumber(getDisplayedNumber() + n);
}

// clear display
function clearDisplay() {
    setDisplayedNumber('');
}

// get currently selected operation
function getCurrentOperation() {
    return calculator.currentOperation;
}

// set currently selected operation
function setCurrentOperation(operation) {
    calculator.currentOperation = operation;
}

// return whether next entry should clear display
function getClearOnEntry() {
    return calculator.clearOnEntry;
}

// set whether next entry should clear display
function setClearOnEntry(bool) {
    calculator.clearOnEntry = bool;
}

// reset entire calculator
function resetCalculator() {
    clearDisplay();
    setStoredNumber(NaN);
    setCurrentOperation('');
    setClearOnEntry(false);
    setDisplayedNumber(0);
}

// run init function on page load
init();