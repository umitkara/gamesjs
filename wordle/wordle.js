let word = "angry";
let isCorrect = false;

function gridInit() {
    let grid = document.getElementsByClassName("grid")[0];
    for (let i = 1; i < 7; i++) {
        let row = document.createElement("div");
        row.classList.add("grid-row");
        for (let j = 1; j < 6; j++) {
            let tile = document.createElement("input");
            tile.type = "text";
            tile.classList.add("tile");
            tile.maxLength = 1;
            tile.autocomplete = "off";
            tile.dataset.row = i;
            tile.dataset.col = j;
            if (i !== 1) {
                tile.disabled = true;
            }
            row.appendChild(tile);
        }
        grid.appendChild(row);
    }
}

function wordCheck(correct, guess) {
    let retArr = [];
    for (let i = 0; i < word.length; i++) {
        let letterPos = correct.indexOf(guess[i]);
        if (letterPos === -1) {
            retArr.push("not-contains");
        } else {
            if (guess[i] === word[i]) {
                retArr.push("correct");
            } else {
                retArr.push("misplaced");
            }
        }
    }
    if (retArr.every(x => x === "correct")) {
        isCorrect = true;
    }
    return retArr;
}

function RowInputBind() {
    const inputs = document.getElementsByClassName("tile");
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('keydown', function(event) {
            if (event.key === "Backspace" ) { 
                event.preventDefault();
                this.value = "";
                if (this.dataset.col != 1) {
                    let prev = document.querySelector(`[data-row="${this.dataset.row}"][data-col="${parseInt(this.dataset.col) - 1}"]`);
                    prev.focus();
                }
            } else if (event.key === "Enter") {
                event.preventDefault();
                if (this.dataset.col == 5) {
                    let text = "";
                    for (let j = 1; j < 6; j++) {
                        text += document.querySelector(`[data-row="${this.dataset.row}"][data-col="${j}"]`).value;
                    }
                    if (text != "" && text.length == 5) {
                        let retArr = wordCheck(word, text.toLocaleLowerCase());
                        for (let k = 0; k < 5; k++) {
                            let curTile = document.querySelector(`[data-row="${this.dataset.row}"][data-col="${k + 1}"]`);
                            curTile.classList.add(retArr[k]);
                            curTile.disabled = true;
                        }
                        let row = parseInt(this.dataset.row);
                        if (row !== 6 && !isCorrect) {
                            for (let k = 0; k < 5; k++) {
                                let curTile = document.querySelector(`[data-row="${row + 1}"][data-col="${k + 1}"]`);
                                curTile.disabled = false;
                                curTile.focus();
                            }
                            let next = document.querySelector(`[data-row="${row + 1}"][data-col="${1}"]`);
                            next.focus();
                        }
                    }
                }
            } else if (/^[a-zA-Z]$/.test(event.key)) {
                event.preventDefault();
                this.value = event.key.toUpperCase();
                if (this.dataset.col != 5) {
                    let next = document.querySelector(`[data-row="${this.dataset.row}"][data-col="${parseInt(this.dataset.col) + 1}"]`);
                    next.focus();
                }
            }
        });
    }
}

gridInit();
RowInputBind();