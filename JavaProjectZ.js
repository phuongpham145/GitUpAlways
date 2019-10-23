ship = new Ship();
document.getElementById("start").addEventListener("click", () => {
    chickens = [];
    let l = document.getElementById('level').value;
    document.getElementById('gameover').innerText = '';

    createChicken = setInterval(function() {
        chickens.push(new Chicken(Math.floor(Math.random() * 600), Math.floor(Math.random() * 200)));
    }, level[l]);
});
document.addEventListener('click', function(e) {
    if(document.activeElement.toString() == '[object HTMLButtonElement]') {
        document.activeElement.blur();
    }
});

function draw() {
    rectMode(CENTER);
    background(51);
    ship.show();
    ship.move();

    for (var i = 0; i < drops.length; i++) {
        drops[i].show();
        drops[i].move();

        for (var j = 0; j < chickens.length; j++) {
            if (drops[i].hits(chickens[j])) {
                if (chickens[j].blood) {
                    chickens[j].subBlood();
                } else {
                    document.getElementById('score').innerText = (score += 1)
                    chickens.splice(j, 1);
                }
                drops[i].remove();
            }
        }
    }

    var edge = false;
    for (var i = 0; i < chickens.length; i++) {
        chickens[i].show();
        chickens[i].move();

        if (chickens[i].x > width - 10 || chickens[i].x < 10) {
            edge = true;
        }

        if (chickens[i].y > height) {
            chickens = [];
            clearInterval(createChicken);
            document.getElementById('gameover').innerText = 'Game Over'
        }
    }

    if (edge) {
        for (var i = 0; i < chickens.length; i++) {
            chickens[i].shiftDown();
        }
    }

    for (var i = drops.length - 1; i >= 0; i--) {
        if (drops[i].toDel) {
            drops.splice(i, 1);
        }
    }
}

function keyPressed() {
    if (key === ' ') {
        var drop = new Drop(ship.x, height);
        drops.push(drop);
    }

    if (keyCode === RIGHT_ARROW) {
        ship.setDir(1);
    } else if (keyCode === LEFT_ARROW) {
        ship.setDir(-1);
    }
}

function keyReleased() {
    if (key !== ' ') {
        ship.setDir(0)
    }
}


function Ship() {
    this.x = width / 2;
    this.xdir = 0;

    this.show = function() {
        fill(255);
        rectMode(CENTER);
        // vẽ phi thuyền
        push();
        noStroke();
        translate(this.x, height - 10);
        scale(0.8, 0.8);
        fill('#c32929');
        rect(0, 0, 40, 40);
        fill('#d5d589');
        rect(0, -25, 10, 25);
        pop();
    }

    this.setDir = function(dir) {
        this.xdir = dir;
    }

    this.move = function() {
        this.x += this.xdir*5;
    }
}

function Drop(x, y) {
    this.x = x;
    this.y = y;
    this.r = 8;
    this.rotate = -1.5559;
    this.speed = 10;
    this.toDel = false;

    this.show = function() {
        push()
        noStroke();
        translate(this.x, this.y + 30);
        rotate(this.rotate);

        for(let i = 0; i > -5; i--) {
            fill(color(255, 255, 255, 255 + i * 12));
            rect(i * this.speed * 0.5 + 60 + this.speed * 3, 0, 5, 5 + i * 0.1);
        }

        pop();
    }

    this.move = function() {
        this.y = this.y - this.speed;
    }

    this.hits = function(chicken) {
        var d = dist(this.x, this.y, chicken.x, chicken.y);
        if (d < this.r + chicken.r + 30) {
            return true;
        }

        return false;
    }

    this.remove = function () {
        this.toDel = true;
    }
}

function Chicken(x, y) {
    this.blood = 3;
    this.x = x;
    this.y = y;
    this.rotate = 1.5559;
    this.r = 30;
    this.xdir = 1;

    this.show = function() {
        push();
        noStroke();
        translate(this.x, this.y);
        scale(0.8, 0.8);
        rotate(this.rotate);
        // vẽ gà
        fill('yellow');
        ellipse(0, 0, 40, 40);
        fill('blue');
        ellipse(5, 0, 25, 25);
        fill('red');
        ellipse(17, 0, 20, 20);
        pop();
    }

    this.move = function() {
        this.x = this.x + this.xdir;
    }

    this.shiftDown = function() {
        this.xdir *= -1;
        this.y += this.r;
    }

    this.subBlood = function() {
        this.blood -= 1;
    }
}
