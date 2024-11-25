const leftGrid = document.getElementById('left-grid');
const rightGrid = document.getElementById('right-grid');
const startBtn = document.getElementById('btn');
const restartBtn = document.getElementById('btn');

let leftGridColors = [];
let rightGridColors = [];

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);

function startGame() {
    leftGridColors = generateRandomGrid();
    rightGridColors = Array(64).fill('white');
    renderGrids();
    startBtn.disabled = true;
    restartBtn.disabled = false;
}

function restartGame() {
    startGame();
}

function generateRandomGrid() {
    const colors = ['white', 'black'];
    return Array.from({ length: 64 }, () => colors[Math.floor(Math.random() * 2)]);
}

function renderGrids() {
    leftGrid.innerHTML = '';
    rightGrid.innerHTML = '';
    leftGridColors.forEach((color, index) => {
        const cell = document.createElement('div');
        cell.style.backgroundColor = color;
        leftGrid.appendChild(cell);
    });
    rightGridColors.forEach((color, index) => {
        const cell = document.createElement('div');
        cell.style.backgroundColor = color;
        cell.addEventListener('click', () => toggleCellColor(index));
        rightGrid.appendChild(cell);
    });
}

function toggleCellColor(index) {
    const row = Math.floor(index / 8);
    const col = index % 8;
    for (let i = row - 1; i <= row + 1; i++) {
        for (let j = col - 1; j <= col + 1; j++) {
            if (i >= 0 && i < 8 && j >= 0 && j < 8 &&(row+col-i-j<2)&&(row+col-i-j>-2)&&(row+col-i-j!=0||i==row)) {
                const cellIndex = i * 8 + j;
                rightGridColors[cellIndex] = rightGridColors[cellIndex] === 'white'? 'black' : 'white';
            }
        }
    }
    renderGrids();
    checkWin();
}

function checkWin() {
    if (leftGridColors.toString() === rightGridColors.toString()) {
        alert('游戏胜利！');
        startGame();
    }
}