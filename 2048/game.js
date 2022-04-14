const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

const backgroundColor = "#bbada0";

// 2048 tiles 
const tiles = {
    0: {
        color: '#cdc1b4',
        text: '',
        textColor: '#cdc1b4'
    },
    2: {
        color: '#eee4da',
        text: '2',
        textColor: '#776e65'
    },
    4: {
        color: '#ede0c8',
        text: '4',
        textColor: '#776e65'
    },
    8: {
        color: '#f2b179',
        text: '8',
        textColor: '#f9f6f2'
    },
    16: {
        color: '#f59563',
        text: '16',
        textColor: '#f9f6f2'
    },
    32: {
        color: '#f67c5f',
        text: '32',
        textColor: '#f9f6f2'
    },
    64: {
        color: '#f65e3b',
        text: '64',
        textColor: '#f9f6f2'
    },
    128: {
        color: '#edcf72',
        text: '128',
        textColor: '#f9f6f2'
    },
    256: {
        color: '#edcc61',
        text: '256',
        textColor: '#f9f6f2'
    },
    512: {
        color: '#edc850',
        text: '512',
        textColor: '#f9f6f2'
    },
    1024: {
        color: '#edc53f',
        text: '1024',
        textColor: '#f9f6f2'
    },
    2048: {
        color: '#edc22e',
        text: '2048',
        textColor: '#f9f6f2'
    }
};

let gameBoard = {
    board: [],
    score: 0,
    highScore: 0,
    gameOver: false,
    gameWon: false,
    init: function () {
        this.board = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
        this.score = 0;
        this.highScore = 0;
        this.gameOver = false;
        this.gameWon = false;
    },
    draw: function () {
        context.fillStyle = backgroundColor;
        context.fillRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[i].length; j++) {
                let tile = this.board[i][j];
                let x = (j * 125) + ((j+1) * 20);
                let y = (i * 125) + ((i+1) * 20);
                context.fillStyle = tiles[tile].color;
                context.fillRect(x, y, 125, 125);
                context.font = '60px Arial';
                context.fillStyle = tiles[tile].textColor;
                context.textAlign = 'center';
                context.textBaseline = 'middle';
                context.fillText(tiles[tile].text, x + 62.5, y + 62.5);
            }
        }
        context.font = '20px Arial';
        context.fillStyle = '#f9f6f2';
        context.textAlign = 'left';
        context.textBaseline = 'top';
        context.fillText('Score: ' + this.score, 0, 0);
        context.fillText('High Score: ' + this.highScore, 0, 20);
        if (this.gameOver) {
            context.fillStyle = '#f9f6f2';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText('Game Over', canvas.width / 2, canvas.height / 2);
        }
        if (this.gameWon) {
            context.fillStyle = '#f9f6f2';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText('You Won!', canvas.width / 2, canvas.height / 2);
        }
    },
    addRandomTile: function () {
        let emptyTiles = [];
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[i].length; j++) {
                if (this.board[i][j] === 0) {
                    emptyTiles.push({
                        x: j,
                        y: i
                    });
                }
            }
        }
        if (emptyTiles.length === 0) {
            return;
        }
        let randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        this.board[randomTile.y][randomTile.x] = Math.random() < 0.9 ? 2 : 4;
    },
    move: function (direction) {
        let moved = false;
        if (direction === 'right') {
            for (let i = 0; i < this.board.length; i++) {
                let row = this.board[i];
                let merged = [];
                for (let j = 0; j < row.length; j++) {
                    let tile = row[j];
                    if (tile !== 0) {
                        let nextTile = row[j + 1];
                        if (nextTile === 0) {
                            row[j + 1] = tile;
                            row[j] = 0;
                            moved = true;
                        } else if (nextTile !== 0 && merged.indexOf(nextTile) === -1) {
                            if (tile === nextTile) {
                                row[j + 1] = tile + nextTile;
                                row[j] = 0;
                                this.score += nextTile + tile;
                                if (this.score > this.highScore) {
                                    this.highScore = this.score;
                                }
                                moved = true;
                                merged.push(nextTile);
                            }
                        }
                    }
                }
            }
        } else if (direction === 'left') {
            for (let i = 0; i < this.board.length; i++) {
                let row = this.board[i];
                let merged = [];
                for (let j = row.length - 1; j >= 0; j--) {
                    let tile = row[j];
                    if (tile !== 0) {
                        let nextTile = row[j - 1];
                        if (nextTile === 0) {
                            row[j - 1] = tile;
                            row[j] = 0;
                            moved = true;
                        } else if (nextTile !== 0 && merged.indexOf(nextTile) === -1) {
                            if (tile === nextTile) {
                                row[j - 1] = tile + nextTile;
                                row[j] = 0;
                                this.score += nextTile + tile;
                                if (this.score > this.highScore) {
                                    this.highScore = this.score;
                                }
                                moved = true;
                                merged.push(nextTile);
                            }
                        }
                    }
                }
            }
        } else if (direction === 'down') {
            for (let i = 0; i < this.board.length; i++) {
                let column = [];
                for (let j = 0; j < this.board[i].length; j++) {
                    column.push(this.board[j][i]);
                }
                let merged = [];
                for (let j = 0; j < column.length; j++) {
                    let tile = column[j];
                    if (tile !== 0) {
                        let nextTile = column[j + 1];
                        if (nextTile === 0) {
                            column[j + 1] = tile;
                            column[j] = 0;
                            moved = true;
                        } else if (nextTile !== 0 && merged.indexOf(nextTile) === -1) {
                            if (tile === nextTile) {
                                column[j + 1] = tile + nextTile;
                                column[j] = 0;
                                this.score += nextTile + tile;
                                if (this.score > this.highScore) {
                                    this.highScore = this.score;
                                }
                                moved = true;
                                merged.push(nextTile);
                            }
                        }
                    }
                }
                for (let j = 0; j < column.length; j++) {
                    this.board[j][i] = column[j];
                }
            }
        } else if (direction === 'up') {
            for (let i = 0; i < this.board.length; i++) {
                let column = [];
                for (let j = this.board[i].length - 1; j >= 0; j--) {
                    column.push(this.board[j][i]);
                }
                let merged = [];
                for (let j = column.length - 1; j >= 0; j--) {
                    let tile = column[j];
                    if (tile !== 0) {
                        let nextTile = column[j - 1];
                        if (nextTile === 0) {
                            column[j - 1] = tile;
                            column[j] = 0;
                            moved = true;
                        } else if (nextTile !== 0 && merged.indexOf(nextTile) === -1) {
                            if (tile === nextTile) {
                                column[j - 1] = tile + nextTile;
                                column[j] = 0;
                                this.score += nextTile + tile;
                                if (this.score > this.highScore) {
                                    this.highScore = this.score;
                                }
                                moved = true;
                                merged.push(nextTile);
                            }
                        }
                    }
                }
                for (let j = 0; j < column.length; j++) {
                    this.board[j][i] = column[j];
                }
            }
        }
        if (moved) {
            this.addRandomTile();
            if (!this.movesAvailable()) {
                this.gameOver = true;
            }
        }
    },
    movesAvailable: function () {
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[i].length; j++) {
                if (this.board[i][j] === 0) {
                    return true;
                }
                if (j < this.board[i].length - 1 && this.board[i][j] === this.board[i][j + 1]) {
                    return true;
                }
                if (i < this.board.length - 1 && this.board[i][j] === this.board[i + 1][j]) {
                    return true;
                }
            }
        }
        return false;
    }
};

gameBoard.init();
gameBoard.addRandomTile();
gameBoard.addRandomTile();
gameBoard.draw();
function keyListener(event) {
    if (event.defaultPrevented) {
        return;
    }
    let key = event.key || event.keyCode;

    if (key === 'ArrowLeft' || key === 37) {
        gameBoard.move('left');
    }
    if (key === 'ArrowRight' || key === 39) {
        gameBoard.move('right');
    }
    if (key === 'ArrowUp' || key === 38) {
        gameBoard.move('up');
    }
    if (key === 'ArrowDown' || key === 40) {
        gameBoard.move('down');
    } 
    if (key === 'r') {
        gameBoard.init();
        gameBoard.addRandomTile();
        gameBoard.addRandomTile();
        gameBoard.draw();
    }
    if (key === 'q') {
        gameBoard.gameOver = true;
    }
    gameBoard.draw();
};
document.addEventListener('keydown', keyListener);