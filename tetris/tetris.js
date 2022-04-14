const background = "rgba(158, 173, 134, 1)"

// Get canvas and context
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
// Set canvas background
context.fillStyle = background;
context.fillRect(0, 0, canvas.width, canvas.height);


const tetrominoTypes = {
    I: [[1, 1, 1, 1]],
    J: [[1, 1, 1], [0, 0, 1]],
    L: [[1, 1, 1], [1, 0, 0]],
    O: [[1, 1], [1, 1]],
    S: [[0, 1, 1], [1, 1, 0]],
    T: [[0, 1, 0], [1, 1, 1]],
    Z: [[1, 1, 0], [0, 1, 1]]
}

const drawRect = (x, y, rectType) => {
    let black = "rgba(0, 0, 0, 1)"
    if (rectType === "background") {
        black = "rgba(0, 0, 0, 0.25)"
    }
    rx = x * 30;
    ry = y * 30;
    context.fillStyle = black;
    context.fillRect(rx + 1, ry + 1, 28, 28);
    context.fillStyle = background;
    context.fillRect(rx + 3, ry + 3, 24, 24);
    context.fillStyle = black;
    context.fillRect(rx + 5, ry + 5, 20, 20);
    context.fillStyle = background;
}

class Tetromino {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.block = tetrominoTypes[type];
    }

    rotate() {
        this.block = this.block[0].map((val, index) => this.block.map(row => row[index]).reverse())
    }

    move(x, y) {
        this.x += x;
        this.y += y;
    }

    draw() {
        for (let i = 0; i < this.block.length; i++) {
            for (let j = 0; j < this.block[i].length; j++) {
                if (this.block[i][j] === 1) {
                    drawRect(this.x + j, this.y + i, "");
                }
            }
        }
    }

    clear() {
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[i].length; j++) {
                if (this.board[i][j] === 1) {
                    drawRect(j, i, "background");
                }
            }
        }
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }
}

// Helper Methods //
const randomTetromino = () => {
    let random = Math.floor(Math.random() * 7);
    let type = Object.keys(tetrominoTypes)[random];
    let x = 3;
    let y = 0;
    return new Tetromino(x, y, type);
}

const drawNextBg = (tetromino) => {
    for (let i = 1; i < 3; i++) {
        for (let j = 13; j < 17; j++) {
            drawRect(j, i, "background");
        }
    }
}
const Timer = (callback, delay) => {
    var timerId, start, remaining = delay;
    this.pause = () => {
        window.clearTimeout(timerId);
        remaining -= new Date() - start;
    };
    this.resume = () => {
        start = new Date();
        timerId = window.setTimeout(callback, remaining);
    };
    this.resume();
}
// *** //

class Board {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.currentTetromino = randomTetromino();
        this.nextTetromino = randomTetromino();
        this.score = 0;
        this.board = [];
        for (let i = 0; i < y; i++) {
            this.board.push([]);
            for (let j = 0; j < x; j++) {
                this.board[i].push(0);
            }
        }
    }

    clear() {
        context.fillStyle = background;
        context.fillRect(0, 0, canvas.width, canvas.height);
    }

    draw() {
        this.clear();
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[i].length; j++) {
                if (this.board[i][j] === 0) {
                    drawRect(j, i, "background");
                } else {
                    drawRect(j, i, "block");
                }
            }
        }
        drawNextBg(this.nextTetromino);
        // draw score
        context.fillStyle = "rgba(0, 0, 0, 1)";
        context.font = "22px Arial";
        context.fillText("Score: " + this.score, 390, 154);

    }

    checkCollision(tetromino) {
        for (let i = 0; i < tetromino.block.length; i++) {
            for (let j = 0; j < tetromino.block[i].length; j++) {
                if (tetromino.block[i][j] === 1) {
                    if (this.board[tetromino.y + i] === undefined || this.board[tetromino.y + i][tetromino.x + j] === undefined || this.board[tetromino.y + i][tetromino.x + j] === 1) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    clearLines() {
        let linesCleared = 0;
        for (let i = 0;
            i < this.board.length; i++) {
            let line = true;
            for (let j = 0; j < this.board[i].length; j++) {
                if (this.board[i][j] === 0) {
                    line = false;
                }
            }
            if (line) {
                linesCleared++;
                this.board.splice(i, 1);
                this.board.unshift(new Array(this.board[0].length).fill(0));
            }
        }
        return linesCleared;
    }

    addTetromino(tetromino) {
        for (let i = 0; i < tetromino.block.length; i++) {
            for (let j = 0; j < tetromino.block[i].length; j++) {
                if (tetromino.block[i][j] === 1) {
                    this.board[tetromino.y + i][tetromino.x + j] = 1;
                }
            }
        }
        let linesCleared = this.clearLines();
        if (linesCleared > 0) {
            this.score += (linesCleared * linesCleared) * 100;
        }
        testBoard.currentTetromino = testBoard.nextTetromino;
        testBoard.currentTetromino.setPosition(3, 0);
        testBoard.nextTetromino = randomTetromino();
        testBoard.nextTetromino.setPosition(13, 1);
    }


    restart() {
        this.board = [];
        this.score = 0;
        for (let i = 0; i < this.y; i++) {
            this.board.push([]);
            for (let j = 0; j < this.x; j++) {
                this.board[i].push(0);
            }
        }
        this.currentTetromino = randomTetromino();
        this.nextTetromino = randomTetromino();
        this.nextTetromino.setPosition(13, 1);
    }
}
let paused = false;
let testBoard = new Board(10, 20);
testBoard.draw();
testBoard.nextTetromino.setPosition(13, 1);
testBoard.nextTetromino.draw();
testBoard.currentTetromino.draw();

const eventListener = (event) => {
    if (event.keyCode === 37) {
        // Move Left
        testBoard.currentTetromino.move(-1, 0);
        if (testBoard.checkCollision(testBoard.currentTetromino)) {
            testBoard.currentTetromino.move(1, 0);
        }
    } else if (event.keyCode === 39) {
        // Move Right
        testBoard.currentTetromino.move(1, 0);
        if (testBoard.checkCollision(testBoard.currentTetromino)) {
            testBoard.currentTetromino.move(-1, 0);
        }
    } else if (event.keyCode === 40) {
        // Move Down
        testBoard.currentTetromino.move(0, 1);
        if (testBoard.checkCollision(testBoard.currentTetromino)) {
            testBoard.currentTetromino.move(0, -1);
            testBoard.addTetromino(testBoard.currentTetromino);
        }
    } else if (event.keyCode === 38) {
        // Rotate
        let tempBlock = testBoard.currentTetromino.block;
        testBoard.currentTetromino.rotate();
        if (testBoard.checkCollision(testBoard.currentTetromino)) {
            testBoard.currentTetromino.block = tempBlock;
        }
    } else if (event.keyCode === 32) {
        // Drop
        while (!testBoard.checkCollision(testBoard.currentTetromino)) {
            testBoard.currentTetromino.move(0, 1);
        }
        testBoard.currentTetromino.move(0, -1);
        testBoard.addTetromino(testBoard.currentTetromino);
    } else if (event.keyCode === 82) {
        testBoard.restart();
    } else if (event.keyCode === 80) {
        paused = !paused;
    }
    testBoard.draw();
    testBoard.nextTetromino.draw();
    testBoard.currentTetromino.draw();
}

document.addEventListener("keydown", eventListener);

let dropStart = Date.now();
let gameOver = false;
let dropInterval = 500;

const drop = () => {
    let now = Date.now();
    let delta = now - dropStart;
    if (!paused && !gameOver && delta > dropInterval) {
        testBoard.currentTetromino.move(0, 1);
        if (testBoard.checkCollision(testBoard.currentTetromino)) {
            testBoard.currentTetromino.move(0, -1);
            testBoard.addTetromino(testBoard.currentTetromino);
        }
        testBoard.draw();
        testBoard.nextTetromino.draw();
        testBoard.currentTetromino.draw();
        dropStart = Date.now();
    }
    if (!gameOver) {
        requestAnimationFrame(drop);
    }
}

drop();