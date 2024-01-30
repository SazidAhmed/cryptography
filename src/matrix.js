function createMatrix(event) {
    // Prevent the form from submitting and refreshing the page
    event.preventDefault();

    const numRowsInput = document.getElementById("numRows");
    const numColsInput = document.getElementById("numCols");
    const matrixResultElement = document.getElementById("notification");
    const matrixInputsElement = document.getElementById("matrixInputs");

    const numRows = parseInt(numRowsInput.value);
    const numCols = parseInt(numColsInput.value);

    if (isNaN(numRows) || isNaN(numCols) || numRows <= 0 || numCols <= 0) {
        matrixResultElement.textContent = "Invalid dimensions. Please provide positive values for rows and columns.";
        return;
    }

    // Clear previous matrix inputs
    matrixInputsElement.innerHTML = "";

    // Create input fields for each element in the matrix
    for (let i = 0; i < numRows; i++) {
        const rowDiv = document.createElement("div");
        rowDiv.className = "row";

        for (let j = 0; j < numCols; j++) {
            const colDiv = document.createElement("div");
            colDiv.className = "col";
            
            const input = document.createElement("input");
            input.type = "number";
            input.className = "form-control mt-2";
            input.id = `matrixInput_${i}_${j}`; // Set the unique ID for each input field
            input.placeholder = `A(${i + 1},${j + 1})`;

            colDiv.appendChild(input);
            rowDiv.appendChild(colDiv);
        }

        matrixInputsElement.appendChild(rowDiv);
    }

    // Add a line break after each row of input fields
    matrixInputsElement.appendChild(document.createElement("br"));

    // Add a button to get and display matrix values
    const displayMatrixButton = document.createElement("button");
    displayMatrixButton.textContent = "Save matrix values";
    displayMatrixButton.className = "btn btn-success";
    displayMatrixButton.onclick = function () {
        storeMatrix(numRows, numCols);
    };
    matrixInputsElement.appendChild(displayMatrixButton);
}

function storeMatrix(numRows, numCols) {
    // Retrieve existing matrices from local storage
    const storedMatrices = JSON.parse(localStorage.getItem('matrices')) || [];
    console.log('storeMatrix length:', storedMatrices.length);
    if(storedMatrices.length === 2){
        const matrixResultElement = document.getElementById("notification");
        matrixResultElement.textContent = "You've 2 matrices in the storage. Please clear them first.";
        return;
    }

    const matrixResultElement = document.getElementById("notification");
    const matrixValues = [];

    // Retrieve values from input fields
    for (let i = 0; i < numRows; i++) {
        const row = [];
        for (let j = 0; j < numCols; j++) {
            const inputId = `matrixInput_${i}_${j}`;
            const inputValue = parseFloat(document.getElementById(inputId).value);
            row.push(isNaN(inputValue) ? 0 : inputValue);
        }
        matrixValues.push(row);
    }

    // Generate a unique identifier for the new matrix
    const matrixId = `matrix_${new Date().getTime()}`;

    // Add the new matrix to the array of matrices
    storedMatrices.push({ id: matrixId, rows: numRows, cols: numCols, values: matrixValues });

    // Store the updated array of matrices in local storage
    localStorage.setItem('matrices', JSON.stringify(storedMatrices));

    // Display the matrix
    matrixResultElement.textContent = "Matrix values saved successfully:\n" + JSON.stringify(matrixValues, null, 2);
}

function displayMatrix(matrixValues, operation) {
    const matrixResultElement = document.getElementById("resultOfOperation");
    matrixResultElement.innerHTML = "";

    const matrixDiv = document.createElement('div');
    matrixDiv.className = 'matrix';
    const matrixIdDiv = document.createElement('div');
    matrixIdDiv.textContent = `${operation} of given matrices: `;
    matrixDiv.appendChild(matrixIdDiv);

    matrixResultElement.appendChild(matrixDiv);

    matrixValues.forEach(row => {
        const rowDiv = document.createElement("div");
        rowDiv.className = "row";

        row.forEach(value => {
            const colDiv = document.createElement("div");
            colDiv.className = "col";
            colDiv.textContent = value;
            rowDiv.appendChild(colDiv);
        });

        matrixResultElement.appendChild(rowDiv);
    });
}

function getDataFromStorage() {
    // Retrieve matrices from local storage
    const storedMatrices = JSON.parse(localStorage.getItem('matrices')) || [];

    // Display the retrieved matrices
    const displayElement = document.getElementById('displayMatrices');
    displayElement.innerHTML = '';

    storedMatrices.forEach(matrix => {
        const matrixDiv = document.createElement('div');
        matrixDiv.className = 'matrix';

        const matrixIdDiv = document.createElement('div');
        matrixIdDiv.textContent = `Matrix ID: ${matrix.id}`;
        matrixDiv.appendChild(matrixIdDiv);

        // Create a separate div for the row-and-column format
        const matrixDisplayDiv = document.createElement('div');
        matrixDisplayDiv.className = 'matrix-display';

        matrix.values.forEach(row => {
            const rowDiv = document.createElement("div");
            rowDiv.className = "row";

            row.forEach(value => {
                const colDiv = document.createElement("div");
                colDiv.className = "col";
                colDiv.textContent = value;
                rowDiv.appendChild(colDiv);
            });

            matrixDisplayDiv.appendChild(rowDiv);
        });

        // Append the matrix display div to the matrix div
        matrixDiv.appendChild(matrixDisplayDiv);

        displayElement.appendChild(matrixDiv);
    });
}

function sumMatrix(event) {
    // Prevent the form from submitting and refreshing the page
    event.preventDefault();

    // Retrieve matrices from local storage
    const storedMatrices = JSON.parse(localStorage.getItem('matrices')) || [];

    // Check if there are at least two matrices to sum
    if (storedMatrices.length < 2) {
        alert("Please store at least two matrices before attempting to sum them.");
        return;
    }

    // Get the two matrices to sum
    const matrix1 = storedMatrices[0].values;
    const matrix2 = storedMatrices[1].values;

    // Check if the matrices have the same dimensions
    if (matrix1.length !== matrix2.length || matrix1[0].length !== matrix2[0].length) {
        alert("Matrices must have the same dimensions for addition.");
        return;
    }

    // Calculate the sum of the matrices
    const sumMatrixValues = [];
    for (let i = 0; i < matrix1.length; i++) {
        const row = [];
        for (let j = 0; j < matrix1[0].length; j++) {
            row.push(matrix1[i][j] + matrix2[i][j]);
        }
        sumMatrixValues.push(row);
    }

    // Display the result
    displayMatrix(sumMatrixValues, 'Sum');
}


function clearLocalStorage() {
    localStorage.removeItem('matrices');
}

// Function to calculate the cofactor for a specific element in the matrix
function getCofactorForElement(matrix, row, col) {
    const numRows = matrix.length;
    const numCols = matrix[0].length;

    // Check if the matrix is square
    if (numRows !== numCols) {
        console.error("Invalid matrix size. Cofactor calculation supports only square matrices.");
        return null;
    }

    // Check if the specified row and column are within bounds
    if (row < 0 || row > numRows || col < 0 || col > numCols) {
        console.error("Invalid row or column index.");
        return null;
    }

    // Calculate the minor matrix
    const minorMatrix = getMinorMatrix(matrix, row, col);

    // Calculate the determinant of the minor matrix
    const detMinorMatrix = determinant(minorMatrix);

    // Apply the sign to the determinant based on the position in the original matrix
    const cofactorValue = ((row + col) % 2 === 0 ? 1 : -1) * detMinorMatrix;

    return cofactorValue;
}

// Function to get the minor matrix by excluding a specific row and column
function getMinorMatrix(matrix, row, col) {
    return matrix
        .filter((_, i) => i !== row)
        .map(row => row.filter((_, j) => j !== col));
}

// Function to calculate the determinant of a matrix (works for any size)
function determinant(matrix) {
    const numRows = matrix.length;
    const numCols = matrix[0].length;

    // Base case for 2x2 matrix
    if (numRows === 2 && numCols === 2) {
        return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    }

    // Recursive calculation for larger matrices
    let det = 0;
    for (let col = 0; col < numCols; col++) {
        const sign = col % 2 === 0 ? 1 : -1;
        det += sign * matrix[0][col] * determinant(getMinorMatrix(matrix, 0, col));
    }

    return det;
}


function calCofactor(){

    // Retrieve matrices from local storage
    const storedMatrices = JSON.parse(localStorage.getItem('matrices')) || [];

    // Check if there are at least two matrices to sum
    if (storedMatrices.length < 1) {
        alert("Please store at least one matrices before attempting to calculate cofactor.");
        return;
    }

    const row = storedMatrices[0].rows;
    const col = storedMatrices[0].cols;
    const matrix = storedMatrices[0].values;
    const size = matrix.length;
    console.log('row, col & matrix size: ', row, col, size)

    const cofactorValue = getCofactorForElement(matrix, row, col);

    if (cofactorValue !== null) {
        console.log(`Cofactor for element at (${row}, ${col}): ${cofactorValue}`);
    }

}