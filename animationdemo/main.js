const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

function clear() {
    context.clearRect(0, 0, canvas.width, canvas.height);
};

let myRect = {
    x: 0,
    y: 0,
    newX: 0,
    newY: 0,
    width: 50,
    height: 50,
    color: 'red',
    animationDuration: 100,
    draw: function () {
        clear();
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
    },
    moveTo: function (x, y) {
        this.newX = x;
        this.newY = y;
        let start = performance.now();
        let animation = setInterval(function () {
            let timePassed = performance.now() - start;
            if (timePassed >= this.animationDuration) {
                clearInterval(animation);
            }
            this.x += (this.newX - this.x) * timePassed / this.animationDuration;
            this.y += (this.newY - this.y) * timePassed / this.animationDuration;
            this.draw();
        }.bind(this), 1000 / 60);
    }
};

myRect.draw();
document.addEventListener('keydown', function (event) {
    switch (event.key) {
        case 'ArrowLeft':
            // move 50px to the left
            myRect.moveTo(myRect.x - 50, myRect.y);
            break;
        case 'ArrowRight':
            // move 50px to the right
            myRect.moveTo(myRect.x + 50, myRect.y);
            break;
        case 'ArrowUp':
            // move 50px to the top
            myRect.moveTo(myRect.x, myRect.y - 50);
            break;
        case 'ArrowDown':
            // move 50px to the bottom
            myRect.moveTo(myRect.x, myRect.y + 50);
            break;
    }
});