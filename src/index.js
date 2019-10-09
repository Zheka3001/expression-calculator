function eval() {
    // Do not use eval!!!
    return;
}

function expressionCalculator(expr) {

    function calculateSum(expr) {
        let numberStr = expr.split('+');
        let sum = null;
        for (let i = 0; i < numberStr.length; i++) {
            sum += +calculateSub(numberStr[i]);
        }
        return sum;
    }

    function calculateSub(expr) {

        function splitMinus(expr) {

            let splitMinusNumber = [];
            let lastMinusPos = -1;

            outer: for (let i = 0; i < expr.length; i++) {
                if (expr[i] == '-') {

                    for (let j = i - 1; j > 0; j--) {
                        if (expr[j] == ' ') continue; 
                        else if (isFinite(expr[j])) break;
                        else if (expr[j] == '+' ||
                                 expr[j] == '-' ||
                                 expr[j] == '*' ||
                                 expr[j] == '/') continue outer;
                    }

                    splitMinusNumber.push( expr.slice(lastMinusPos + 1, i) );
                    lastMinusPos = i;
                }
            }

            splitMinusNumber.push( expr.slice(lastMinusPos + 1));

            return splitMinusNumber;
        }

        let numberStr = splitMinus(expr);
        let sum = null;
        
        for (let i = 0; i < numberStr.length; i++) {
            if (sum == null) sum += calculateMul(numberStr[i])
            else sum -= +calculateMul(numberStr[i]);
        }
        return sum;
    }

    function calculateMul(expr) {
        let numberStr = expr.split('*');
        let sum = null;
        for (let i = 0; i < numberStr.length; i++) {
            if (sum == null) sum += +calculateDiv(numberStr[i])
            else sum *= +calculateDiv(numberStr[i]);
        }
        return sum;
    }

    function calculateDiv(expr) {
        let numberStr = expr.split('/');
        let sum = null;
        for (let i = 0; i < numberStr.length; i++) {
            if (sum == null) sum = numberStr[i];
            else if (+numberStr[i] == 0 && sum != 0) throw 'TypeError: Division by zero.'
            else sum /= +numberStr[i];
        }
        return sum;
    }

    function calcInBrackets(expr) {
        let openBracket = {
            index: 0,
            isOpen: false,
        };
        let closeBracket = {
            index: 0,
            isClose: false,
        };

        for (let i = 0; i < expr.length; i++) {
            if (expr[i] == '(') {
                openBracket.index = i;
                openBracket.isOpen = true;

            } else if (expr[i] == ')') {

                if (!openBracket.isOpen){
                throw 'ExpressionError: Brackets must be paired';

                } else if (openBracket.isOpen) {
                closeBracket.index = i;
                closeBracket.isClose = true;
                }

            } 

            if (closeBracket.isClose) {
                return expr.slice(0, openBracket.index) +
                expressionCalculator(expr.slice(openBracket.index + 1, closeBracket.index)) +
                expr.slice(closeBracket.index + 1);
            }
        }
        if (openBracket.isOpen && !closeBracket.isClose) throw 'ExpressionError: Brackets must be paired';
        return expr;
    }

    let result = 0;
    while (expr.includes('(') || expr.includes(')')){
        expr = calcInBrackets(expr);
    }
    result = calculateSum(expr);

    return result;
}

module.exports = {
    expressionCalculator
}