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
