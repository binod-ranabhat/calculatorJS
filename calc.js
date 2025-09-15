

// first get expression 
// loop through expression
// put all numbers and operators seperatly in array
// then calculate the values by checking operator orders


function calculateRes() {
    let expression = document.getElementById("inputVal").value; // get value
    expression = preprocessImplicitMultiplication(expression);
    try {
        const result = calculate(expression);
        document.getElementById("result").textContent = "Result: " + result;
    } catch (error) {
        document.getElementById("result").textContent = "Error: " + error;
    }
}

function isOperator(char) {
    return ['+', '-', '*', '/', '%','&'].includes(char);
}

function calcFunction(a, b, operator) {

    switch(operator) {
        case '+':
            return a + b;
        case '-':
            return a - b;
        case '*':
            return a * b;
        case '/':
            if (b === 0) throw "Cannot Divide By 0";
            return a / b;
        case '%':
        	return a % b;
	case '&': // for fun
		return parseFloat(`${a}${b}`);
        default:
            throw "I dont know what to DO  :P";
    }
}

function calculate(expression) {
    let operators = [];
    let numbers = [];

    let temp = '';
   

   for (let i = 0; i < expression.length; i++) {
        let char = expression[i];
        if (char === '(') { // to check opening bracket (
            operators.push(char);
        } else if (char === ')') {
            // to handle inside ( )
            while (operators.length > 0 && operators[operators.length - 1] !== '(') {
                let b = numbers.pop();
                let a = numbers.pop();
                let op = operators.pop();
                numbers.push(calcFunction(a, b, op));
            }
            operators.pop(); // Remove ( bracket as well

            // Implicit multiplication: if previous char is a number or ')', multiply
            let prevChar = null;
            let j = i - 1;
            while (j >= 0) {
                if (expression[j] !== ' ' && expression[j] !== '\t') {
                    prevChar = expression[j];
                    break;
                }
                j--;
            }
            let nextChar = (i + 1 < expression.length) ? expression[i + 1] : null;
            // If next char is a number or '(', multiply
            if (nextChar && (nextChar === '(' || /[0-9.]/.test(nextChar))) {
                operators.push('*');
            }
        } else if (isOperator(char)) {
            while (operators.length > 0 && calcOrder(operators[operators.length - 1]) >= calcOrder(char)) { // check the order of calculation
                let b = numbers.pop();
                let a = numbers.pop();
                let op = operators.pop();
                numbers.push(calcFunction(a, b, op));
            }
            operators.push(char);
        } else {
            let temp = '';
            while (i < expression.length && !isOperator(expression[i]) && expression[i] !== '(' && expression[i] !== ')') {
                temp += expression[i];
                i++;
            }
            i--;
            numbers.push(parseFloat(temp));
            // Implicit multiplication: if next char is '('
            let nextChar = (i + 1 < expression.length) ? expression[i + 1] : null;
            if (nextChar === '(') {
                operators.push('*');
            }
        }
    }


    while (operators.length > 0) {
        let b = numbers.pop();
        let a = numbers.pop();
        let op = operators.pop();
        numbers.push(calcFunction(a, b, op));
    }

    return numbers[0];
}


// to determine the order of calculation
function calcOrder(operator) {

    switch(operator) {
        case '+':
        case '-':
            return 1;
        case '*':
        case '/':
        case '%':
            return 2;
	case '&':
		return 3;
        default:
            return 0;
    }
}

