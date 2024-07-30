//initialization of O class and X class
const X_CLASS = 'x';
const O_CLASS = 'o';
const WINNING_COMBINATIONS = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [2,4,6],
    [0,4,8]
]; //array for winning conditions

const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const winningMessageElement = document.getElementById('winningMessage');
const restartButton = document.getElementById('restartButton');
const winningMessageTextElement = document.querySelector('[data-winning-message-text]');
const nextButton = document.getElementById('nextButton');
const prevButton = document.getElementById('prevButton');
const turnButton = document.getElementById('turnSelector');

let circleTurn;
let moves = []; // Array for moves
let currentMoveIndex = -1; // current move index

startGame(); //function call to start game

restartButton.addEventListener('click', startGame);
nextButton.addEventListener('click', nextMove);
prevButton.addEventListener('click', previousMove);
turnButton.addEventListener('click', switchTurns);

function switchTurns () {
    circleTurn = !circleTurn;
    setBoardHoverClass();
}

function startGame() {
    moves = [];
    currentMoveIndex = -1;
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(O_CLASS);
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });

    turnButton.style.display = 'flex';

    setBoardHoverClass();
    winningMessageElement.classList.remove('show');
}

function handleClick(event) {
    const cell = event.target;
    const currentClass = circleTurn ? O_CLASS : X_CLASS; //initialization of circleTurn, if true = O class. If false = X class
    const cellIndex = [...cellElements].indexOf(cell); //using the spread syntax to create a new array to be able to use indexOf

    placeMark(cell, currentClass);

    moves.push({ index: cellIndex, class: currentClass }); //recording the move played
    currentMoveIndex = moves.length - 1; //registering the current move in array (-1 is to match the numbers registered for arrays)

    turnButton.style.display = 'none';

    if (checkWin(currentClass)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        setBoardHoverClass();
    }
}

function endGame(draw) {
    if (draw) {
        winningMessageTextElement.innerText = 'Draw!';
    } else {
        winningMessageTextElement.innerText = `${circleTurn ? "Player O" : "Player X"} Wins!`;
    }
    winningMessageElement.classList.add('show');
    nextButton.style.display = 'none';

    // Show match record buttons after game ends
    // showMatchRecordButtons();
}

// function showMatchRecordButtons() {
//     document.querySelector('.matchRecordButtons').style.display = 'flex'; // or 'block' depending on your layout needs
// }

function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || 
        cell.classList.contains(O_CLASS);
    });
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
}

function swapTurns() {
    circleTurn = !circleTurn; //swaps current from either X to O or O to X, hence the usage of ! to get the opposite value
}

function setBoardHoverClass() {
    board.classList.remove(X_CLASS);
    board.classList.remove(O_CLASS);
    if (circleTurn) {
        board.classList.add(O_CLASS);
    } else {
        board.classList.add(X_CLASS);
    }
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass);
        });
    });
}

function nextMove() {
    currentMoveIndex++;
    if (currentMoveIndex >= moves.length - 1) {
        nextButton.style.display = 'none';
    }
    if (currentMoveIndex < moves.length) {
        const { index, class: markClass } = moves[currentMoveIndex];
        const cell = cellElements[index];
        placeMark(cell, markClass);
        circleTurn = (markClass === O_CLASS);
        setBoardHoverClass();
        prevButton.style.display = 'inline';
    }
}

function previousMove() {
    if (currentMoveIndex > 0) {
        const { index } = moves[currentMoveIndex];
        const cell = cellElements[index];
        cell.classList.remove(X_CLASS);
        cell.classList.remove(O_CLASS);
        currentMoveIndex--;
        circleTurn = !circleTurn;
        setBoardHoverClass();
        nextButton.style.display = 'inline';
    } else if (currentMoveIndex === 0) {
        const { index } = moves[currentMoveIndex];
        const cell = cellElements[index];
        cell.classList.remove(X_CLASS);
        cell.classList.remove(O_CLASS);
        currentMoveIndex = -1;
        circleTurn = false;
        setBoardHoverClass();
        prevButton.style.display = 'none';
    }
}
