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
        case 'point':
            // do nothing if number is already a float (decimal) and entry is not about to be cleared
            if (getDisplayingFloat() && !getClearOnEntry()) return;
            if (getClearOnEntry()) {
                // store previous number
                storeDisplayedNumber();
                // clear display to make way for new number
                clearDisplay();
                // allow subsequent number entries to concat
                setClearOnEntry(false);
                // allow '.' to be pressed
                setDisplayingFloat(false);
            }
            setDisplayingFloat(true);
            // concat . on display and prevent further clicking of .
            concatDisplay('.');
            
            break;
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
            // do nothing if display is going to reset on next entry
            if (getClearOnEntry()) return;
            negateDisplayedNumber();
            break;
        // square root and instantly provide answer
        case 'sqrt':
            // ignore input if imaginary
            if (displayingNegative()) return;
            sqrtDisplayedNumber();
            break;
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
    // set stored number for use in subsequent operation
    setStoredNumber(result);
    setCurrentOperation('');
    // prevent further number entry from appending to end of solution
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

// take operator and two numbers and return calculation
function operate(operator, a, b) {
    // convert to numbers
    a = +a;
    b = +b;

    console.log(`Operating ${a} ${operator} ${b}`);


    // define float conversion variables in case of add or subtract
    let intProduct, M;

    // select operation based on provided string
    switch (operator) {
        case 'multiply': 
            return multiply(a, b);
        case 'divide': 
            return divide(a, b);
        case operator:
            // convert to integer for addition and subtraction
            M = 10 ** digitsAfterDecimal(b);
            // multiply to convert to integer
            a = a * M;
            b = b * M;
        // for adding and subtracting, break instead of return to allow integer conversion        
        case 'add': 
            intProduct = add(a, b);
            break;
        case 'subtract': 
            intProduct = subtract(a, b);
            break;
    }
    // divide to get float result
    return intProduct / M;
}

// set positive to negative and vice versa
function negateDisplayedNumber() {
    // if last 'digit' is a point (.) indicate that it should be appended back on to the end
    const endsWithPoint = (getLastCharOnDisplay() === '.');
    const numberString = getDisplayedNumber();
    // convert string to number and back to string then multiply by negative 1
    let negativeNumber = String(+numberString * -1);
    // add back '.' at the end if there was one to begin with
    negativeNumber = endsWithPoint ? negativeNumber + '.' : negativeNumber;
    setDisplayedNumber(negativeNumber);
}

function sqrtDisplayedNumber() {
    // display square root of displayed number
    setDisplayedNumber(Math.sqrt(getDisplayedNumber()));
}

// concatenate number to display
function concatDisplay(n) {
    // clear if initial number is 0 and it is not displaying a decimal
    if (getDisplayedNumber() === '0' && !getDisplayingFloat()) {
        clearDisplay();
    }
    // add number to end of display
    setDisplayedNumber(getDisplayedNumber() + n);
}

// clear display
function clearDisplay() {
    // cleared display no longer has float value
    setDisplayingFloat(false);
    // remove everything from display
    setDisplayedNumber('');
}

// GETTERS AND SETTERS //

// set stored number in calculator object
function setStoredNumber(n) {
    calculator.stored = n;
}

function getStoredNumber() {
    return calculator.stored;
}

// get string representation of number currently displayed
function getDisplayedNumber() {
    // return  number, multiplying by -1 if negative sign is displayed
    const number = getDisplayTextNode().textContent
    // store every digit after and including decimal
    const splitOnDecimal = String(number).split('.')
    const decimalAndTrailingDigits = splitOnDecimal.length === 2 ? '.' + splitOnDecimal[1] : '';
    const digitsBeforeDecimal = splitOnDecimal[0]
    const stringNegated = String(digitsBeforeDecimal * (displayingNegative() ? -1 : 1) + decimalAndTrailingDigits);
    // return string with '.' at end if there was a point at the end to begin with
    return stringNegated;
}

// set number to be displayed on calculator
function setDisplayedNumber(number) {
    // ensure input number is a string
    number = String(number);
    console.log('setting display to ' + number);
    // if the number is negative, display negative sign and absolute value
    const negativeSpan = document.querySelector('#display span')
    if (+number < 0) {
        negativeSpan.textContent = '-';
    } else {
        negativeSpan.textContent = '';
    }
    // // if last 'digit' is a point (.) indicate that it should be appended back on to the end
    // const endsWithPoint = (String(number).at(-1) === '.');
    // store every digit after and including decimal
    const splitOnDecimal = String(number).split('.')
    const decimalAndTrailingDigits = splitOnDecimal.length === 2 ? '.' + splitOnDecimal[1] : '';
    const digitsBeforeDecimal = splitOnDecimal[0]
    // display error if not a number, otherwise display absolute value
    if (isNaN(+number)) {
        number = 'ERROR';
    } else {
        // get the absolute value of the integer and then append trailing digits
        number = Math.abs(digitsBeforeDecimal) + decimalAndTrailingDigits;
    }
    getDisplayTextNode().textContent = number;
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

// return whether '-' is on calculator display
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

// return the last character currently displayed
function getLastCharOnDisplay() {
    return getDisplayTextNode().textContent.at(-1);
}

// get node for displayed text
function getDisplayTextNode() {
    return document.querySelector('#display h1');
}

// store whether there is a decimal point on display
function setDisplayingFloat(bool) {
    calculator.displayingFloat = bool;
}

// recall whether there is a decimal point
function getDisplayingFloat() {
    return calculator.displayingFloat;
}

// reset entire calculator
function resetCalculator() {
    clearDisplay();
    // run all setters
    setStoredNumber(NaN);
    setCurrentOperation('');
    setClearOnEntry(false);
    setDisplayedNumber(0);
    setLastEval(null);
    setEqualCanRepeat(false);
}

// MATHEMATICAL OPERATIONS //

// add
function add(a, b) {
    return (a + b);
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

// return how many times to multiply by 10 to get an integer from the float
function digitsAfterDecimal(n) {
    const splitString = String(n).split('.');
    // return how many digits are after the float
    return splitString.length === 2 ? splitString[1].length : 0;
}



// run init function on page load
init();