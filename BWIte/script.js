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
    // 生成初始网格
    let initialGrid = Array(64).fill('white');
    
    // 随机进行若干次翻转操作
    const numFlips = Math.floor(Math.random() * 10) + 5; // 随机进行5-14次翻转
    for (let i = 0; i < numFlips; i++) {
        const index = Math.floor(Math.random() * 64);
        toggleCellColor(initialGrid, index,false);
    }
    
    return initialGrid;
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
        cell.addEventListener('click', () => toggleCellColor(rightGridColors, index,true));
        rightGrid.appendChild(cell);
    });
}

function toggleCellColor(Grid,index,ingame) {
    const row = Math.floor(index / 8);
    const col = index % 8;
    for (let i = row - 1; i <= row + 1; i++) {
        for (let j = col - 1; j <= col + 1; j++) {
            if (i >= 0 && i < 8 && j >= 0 && j < 8 &&(row+col-i-j<2)&&(row+col-i-j>-2)&&(row+col-i-j!=0||i==row)) {
                const cellIndex = i * 8 + j;
                Grid[cellIndex] = Grid[cellIndex] === 'white'? 'black' : 'white';
            }
        }
    }
    renderGrids();
    setTimeout(() => {
        checkWin();
    }, 0);
}

function checkWin() {
    if (leftGridColors.toString() === rightGridColors.toString()) {
        alert('游戏胜利！');
        startGame();
    }
}