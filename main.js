var player;
var enemies = [];
var stars = [];
var starCount = 200;
var points = 0;
var maxEnemies = 10;
var song;

const SPACE_KEY = 32;
const W_KEY = 87;
const A_KEY = 65;
const S_KEY = 83;
const D_KEY = 68;

let canvasWidth, canvasHeight

function preload() {
    song = loadSound('./assets/summerspot.mp3');
}

function setup() {
    // canvasWidth = displayWidth * .99;
    // canvasHeight = displayHeight * .99;
    canvasWidth = window.innerWidth * .99;
    canvasHeight = window.innerHeight * .99;
    createCanvas(canvasWidth, canvasHeight);
    createStarfield();
    player = new Player(displayWidth / 2, displayHeight / 2, 300);
}

let playing = false

function draw() {
    background(0);
    moveStarField();
    displayScore();

    if (!song.isPlaying()) {
        song.play()
    }

    if (player.health <= 0) {
        textSize(32);
        text('You Lose', displayWidth / 2, displayHeight / 2);
        return;
    }

    if (enemies.length < maxEnemies) {
        enemies.push(
            new Enemy(
                Math.floor(Math.random() * width),
                Math.floor(Math.random() * height),
                Math.floor(Math.random() * 2) + 1,
                Math.floor(Math.random() * 100) + 80
            )
        )
    }

    for (var i = 0; i < enemies.length; i++) {
        enemies[i].update()
    }

    for (var i = 0; i < enemies.length; i++) {
        if (enemies[i].expansionCount == enemies[i].maxExpansionCount) {
            enemies.splice(i, 1)
        }
    }

    if (playing) {
        for (h = 0; h < enemies.length; h++) {
            if (player.collidesWith(enemies[h]) && enemies[h].tangible) {
                player.health -= 1;
            }
        }

        player.update()
        player.display();
        displayCursor();
    }

    for (var i = 0; i < enemies.length; i++) {
        enemies[i].display()
    }

    if (!playing) return;
    points += 10;
}

function mouseClicked(e) {
    if (playing) {
        player.initializeDash(e.clientX, e.clientY)
        return
    }

    clickMenu(e)
}

function displayCursor() {
    if (player.dashing) {
        return
    }
    var p = calculateDash(player.dashMaxDistance, player.x, player.y, mouseX, mouseY)
    console.log("Mouse: ", mouseX, mouseY)
    console.log(p)

    stroke(255, 204, 0);
    strokeWeight(1);
    fill(52)
    line(player.x, player.y, p.x, p.y);
    ellipseMode(RADIUS);
    ellipse(p.x, p.y, 7, 7);
}

function createStarfield() {
    for (var i = 0; i < starCount; i++) {
        stars[i] = new Star();
    }
}

function moveStarField() {
    for (var i = 0; i < starCount; i++) {
        stars[i].move();
        stars[i].display();
    }
}

function distance(x1, y1, x2, y2) {
    xDist = x1 - x2;
    yDist = y1 - y2;

    return Math.sqrt(xDist * xDist + yDist * yDist);
}

function calculateDash(maxDistance, x1, y1, x2, y2) {
    var xDist = x2 - x1;
    var yDist = y2 - y1;
    var dist = Math.sqrt(xDist * xDist + yDist * yDist);

    if (dist <= maxDistance) {
        var p = {
            x: x2,
            y: y2,
            distance: dist
        }
        return p
    }

    var fractionOfTotal = maxDistance / dist;

    this.dashEndX = x1 + (xDist * fractionOfTotal);
    this.dashEndY = y1 + (yDist * fractionOfTotal);

    var p = {
        x: x1 + (xDist * fractionOfTotal),
        y: y1 + (yDist * fractionOfTotal),
        distance: maxDistance
    }
    return p
}

function displayScore() {
    fill(255, 255, 255)
    stroke(0);
    strokeWeight(0);
    textSize(12);
    text(points + ' points', 10, 20);
}

const startWidth = 100
const startHeight = 40
let startBound = {
    x: [canvasWidth/2 - startWidth/2]
}
// function displayMenu() {
//     fill(255, 0, 0)
//     rectMode(RADIUS)
//     rect(canvasWidth / 2 , canvasHeight / 2, startWidth, startHeight)
//     fill(255, 255, 255)
//     stroke(0);
//     strokeWeight(0);
//     textSize(46);
//     textAlign(CENTER)
//     text('START', canvasWidth / 2, canvasHeight / 2);
// }

// function clickMenu(e) {
//     if (e.mouseX >= startBound.x[0] && e.mouseX <= startBound) {
//
//     }
// }