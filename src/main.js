function isPrime(num) {
    if (num <= 1) {
        return false;
    }
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) {
            return false;
        }
    }
    return true;
}

function checkPrime() {
    const inputElement = document.getElementById("numberInput");
    const resultElement = document.getElementById("result");

    const inputValue = parseInt(inputElement.value);

    if (isNaN(inputValue)) {
        resultElement.textContent = "Please enter a valid number.";
    } else {
        const isPrimeResult = isPrime(inputValue);
        resultElement.textContent = isPrimeResult ? `${inputValue} is a prime number.` : `${inputValue} is not a prime number.`;
    }
}

function findGCD(a, b) {
    // Function to find the GCD of two numbers using Euclidean Algorithm
    if (a < 0 || b < 0) {
        return "Please enter positive numbers.";
    }

    if (a === 0) {
        return b;
    }

    if (b === 0) {
        return a;
    }

    // Using the Euclidean Algorithm to find GCD
    const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));

    return gcd(a, b);
}

function calculateGCD() {
    const inputElement1 = document.getElementById("numberInput1");
    const inputElement2 = document.getElementById("numberInput2");
    const resultElement = document.getElementById("resultGCD");

    const inputValue1 = parseInt(inputElement1.value);
    const inputValue2 = parseInt(inputElement2.value);

    if (isNaN(inputValue1) || isNaN(inputValue2)) {
        resultElement.textContent = "Please enter valid numbers.";
    } else {
        const gcdResult = findGCD(inputValue1, inputValue2);
        resultElement.textContent = `The GCD of ${inputValue1} and ${inputValue2} is: ${gcdResult}`;
    }
}
