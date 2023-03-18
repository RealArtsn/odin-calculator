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
        // don't allow equal repeat because numbers changed
        setEqualCanRepeat(false);
        // store previous number and input new one if operator was selected
        if (getClearOnEntry()) {
            // store previous number
            storeDisplayedNumber();
            // clear display to make way for new number
            clearDisplay();
            // allow subsequent number entries to concat
            setClearOnEntry(false);
        }
        // get text content
        const textContent = this.querySelector('h2').textContent;
        concatDisplay(textContent);
        return;
    }



    // set current operation if operator is selected
    if (['add','subtract','divide','multiply'].includes(this.id)) {
        // do last operation if number is stored
        if (getStoredNumber() && getCurrentOperation() && !getClearOnEntry()) {
            // do the stored operation
            operateStoreAndDisplay(getCurrentOperation(), getStoredNumber(), getDisplayedNumber());
            // disallow = repetition
            setEqualCanRepeat(false);
        }

        setCurrentOperation(this.id);
        setClearOnEntry(true)
        return
    }

    // decide what to do if other key is clicked
    switch (this.id) {
        case '=':
            // if equal allowed to repeat, repeat it
            if (getEqualCanRepeat()) {
                repeatLastEval();
                return
            }
            // if no number stored, do not operate
            if (isNaN(getStoredNumber())) break;
            operateStoreAndDisplay(getCurrentOperation(), getStoredNumber(), getDisplayedNumber())
            // allow equal repetition
            setEqualCanRepeat(true);
            break;
        case 'C':
            clearDisplay();
            setDisplayedNumber(0);
            break;
        case 'CE':
            resetCalculator();
            break;
        case 'negate':
            negateDisplayedNumber();
    }
}

// 
function operateStoreAndDisplay(operation, storedNumber, currentNumber) {
    // don't do anything if there is no stored number to operate with
    if (isNaN(getStoredNumber())) return;
    const result = operate(operation, storedNumber, currentNumber);
    // store evaluation for re-use if = is clicked again
    setLastEval(operation, currentNumber);
    setDisplayedNumber(result);
    setStoredNumber(result);
    setCurrentOperation('');
    setClearOnEntry(true);
}

// retrieve last evaluation and repeat the operation
function repeatLastEval() {
    const lastEval = getLastEval();
    // operate with last operation and the number pair and stored number
    operateStoreAndDisplay(lastEval[0], getStoredNumber(), lastEval[1]);
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

    console.log(`Operating ${a} ${operator} ${b}`);
    
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
    // return accurate number, multiplying by -1 if negative sign is displayed
    const number = document.querySelector('#display h1').textContent
    return String(number * (displayingNegative() ? -1 : 1));
}

// set number to be displayed on calculator
function setDisplayedNumber(number) {
    console.log('setting display to ' + number);
    // if the number is negative, display negative sign and absolute value
    const negativeSpan = document.querySelector('#display span')
    if (number < 0) {
        negativeSpan.textContent = '-';
    } else {
        negativeSpan.textContent = '';
    }
    // set display error if not a number, otherwise show absolute value in h1
    if (isNaN(number)) {
        number = 'ERROR';
    } else {
        number = Math.abs(number)
    }
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

function displayingNegative() {
    return document.querySelector('#display span').textContent === '-';
}

// store last evalution for repeated =
function setLastEval(operator, b) {
    calculator.lastEval = [operator, b];
}

// retrieve last evaluation
function getLastEval() {
    return calculator.lastEval;
}

// set whether = can repeat
function setEqualCanRepeat(bool) {
    calculator.equalCanRepeat = bool;
}

// get whether = can repeat
function getEqualCanRepeat() {
    return calculator.equalCanRepeat;
}

// set positive to negative and vice versa
function negateDisplayedNumber() {
    setDisplayedNumber(+getDisplayedNumber() * -1);
}

function handleEntry(number) {

}

// reset entire calculator
function resetCalculator() {
    clearDisplay();
    setStoredNumber(NaN);
    setCurrentOperation('');
    setClearOnEntry(false);
    setDisplayedNumber(0);
    setLastEval(null);
    setEqualCanRepeat(false);
}



// run init function on page load
init();