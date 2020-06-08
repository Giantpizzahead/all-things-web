let canvas = document.getElementById('main-canvas');
let ctx = canvas.getContext('2d');
const FPS = 60;
const NUM_KEYS = 256;

// Listener setup
canvas.addEventListener('click', leftClick);
canvas.addEventListener('contextmenu', rightClick);
canvas.addEventListener('keydown', keyDown);
canvas.addEventListener('keyup', keyUp);

// Initial text
ctx.font = '80px lato';
ctx.fillStyle = '#FF0000';
ctx.fillText('Click anywhere to begin...', 420, 530);

class Player {
  constructor(x, y, speed, size) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.size = size;
  }

  draw(alive) {
    if (alive) ctx.fillStyle = '#66EBFF';
    else ctx.fillStyle = '#FFB0FB';
    ctx.fillRect(this.x-this.size, this.y-this.size, this.size * 2, this.size * 2);
  }

  moveLeft() {
    this.x -= this.speed;
    this.x = Math.max(this.size, this.x);
  }

  moveRight() {
    this.x += this.speed;
    this.x = Math.min(canvas.width - this.size, this.x);
  }

  moveUp() {
    this.y -= this.speed;
    this.y = Math.max(this.size, this.y);
  }

  moveDown() {
    this.y += this.speed;
    this.y = Math.min(canvas.height - this.size, this.y);
  }
}

class Attack {
  constructor(time, functionToCall) {
    this.time = time;
    this.functionToCall = functionToCall;
  }

  run() {
    this.functionToCall();
  }
}

class WarningRect {
  constructor(x, y, w, h, waitTime, warnTime, obstacleTime) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.time = waitTime;
    this.startTime = warnTime;
    this.obstacleTime = obstacleTime;
  }

  update() {
    this.time--;
  }

  draw() {
    if (this.time > this.warnTime) return;
    let intensity = 0.5 * (this.startTime - this.time) / this.startTime;
    if (this.time % 6 < 8) ctx.fillStyle = `rgba(255, 0, 0, ${intensity})`;
    else ctx.fillStyle = `rgba(255, 255, 255, ${intensity})`;
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }
}

class WarningCircle {
  constructor(x, y, r, waitTime, warnTime, obstacleTime) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.time = waitTime;
    this.startTime = warnTime;
    this.obstacleTime = obstacleTime;
  }

  update() {
    this.time--;
  }

  draw() {
    if (this.time > this.warnTime) return;
    let intensity = 0.5 * (this.startTime - this.time) / this.startTime;
    if (this.time % 6 < 8) ctx.fillStyle = `rgba(255, 0, 0, ${intensity})`;
    else ctx.fillStyle = `rgba(255, 255, 255, ${intensity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    ctx.fill();
  }
}

class ObstacleRect {
  constructor(x, y, w, h, time) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.time = time;
    this.startTime = time;
  }

  update() {
    this.time--;
  }

  draw() {
    if (this.startTime - this.time < 20) {
      // In middle of starting flash
      let flash = 255 * (20 - (this.startTime - this.time)) / 20;
      ctx.fillStyle = `rgba(255, ${flash}, ${flash}, 1)`;
    } else if (this.time < 20) {
      // In middle of ending fade
      let alpha = Math.min(1, this.time / 20);
      ctx.fillStyle = `rgba(255, 0, 0, ${alpha})`;
    } else {
      // Normal
      ctx.fillStyle = 'rgb(255, 0, 0)';
    }
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }

  isTouchingPlayer() {
    return this.time > 20 && player.x + player.size > this.x && player.y + player.size > this.y && player.x - player.size < this.x + this.w && player.y - player.size <= this.y + this.h;
  }
}

class ObstacleCircle {
  constructor(x, y, r, time) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.time = time;
    this.startTime = time;
  }

  update() {
    this.time--;
  }

  draw() {
    if (this.startTime - this.time < 20) {
      // In middle of starting flash
      let flash = 255 * (20 - (this.startTime - this.time)) / 20;
      ctx.fillStyle = `rgba(255, ${flash}, ${flash}, 1)`;
    } else if (this.time < 20) {
      // In middle of ending fade
      let alpha = Math.min(1, this.time / 20);
      ctx.fillStyle = `rgba(255, 0, 0, ${alpha})`;
    } else {
      // Normal
      ctx.fillStyle = 'rgb(255, 0, 0)';
    }
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    ctx.fill();
  }

  isTouchingPlayer() {
    // If any of the 4 corner points (or center) are in the circle, it's touching the player
    return this.time > 20 && (this.pointTouching(player.x, player.y) || this.pointTouching(player.x - player.size, player.y - player.size) || this.pointTouching(player.x - player.size, player.y + player.size) || this.pointTouching(player.x + player.size, player.y - player.size) || this.pointTouching(player.x + player.size, player.y + player.size));
  }

  pointTouching(x, y) {
    return Math.pow(Math.abs(this.x - x), 2) + Math.pow(Math.abs(this.y - y), 2) < Math.pow(this.r, 2);
  }
}

class MovingCircle extends ObstacleCircle {
  constructor(x, y, dx, dy, r, time) {
    super(x, y, r, time);
    this.dx = dx;
    this.dy = dy;
  }

  update() {
    super.update();
    this.x += this.dx;
    this.y += this.dy;
  }
}

let gameStarted = false;
let playerAlive = true;
let numberDeaths = 0;
let music;
let musicName, musicDescription;
let player = new Player(canvas.width / 2, canvas.height / 2, 6, 15);
let keyHeld = [];
for (let i = 0; i < NUM_KEYS; i++) keyHeld.push(false);
let warnings = [];
let obstacles = [];
let attacks;
let currAttack;

function tick() {
  // console.log(music.soundElement.currentTime);
  clearScreen();

  // Move the player
  if (keyHeld[87] || keyHeld[38]) player.moveUp();
  if (keyHeld[65] || keyHeld[37]) player.moveLeft();
  if (keyHeld[83] || keyHeld[40]) player.moveDown();
  if (keyHeld[68] || keyHeld[39]) player.moveRight();

  // Add new attacks if it's time to
  while (currAttack != attacks.length && attacks[currAttack].time <= music.soundElement.currentTime) {
    attacks[currAttack].run();
    currAttack++;
  }

  // Update all obstacles
  let wasHit = false;
  for (let i = 0; i < obstacles.length; i++) {
    let obstacle = obstacles[i];
    obstacle.update();
    if (obstacle.time <= 0) {
      // Delete obstacle
      obstacles.splice(i--, 1);
    }

    // Has obstacle collided with player?
    if (obstacle.isTouchingPlayer()) {
      // Player lost!
      if (playerAlive) {
        numberDeaths++;
        playerAlive = false;
      }
      wasHit = true;
    }
  }

  if (!wasHit) {
    // Player is out of obstacle
    playerAlive = true;
  }

  // Update all warnings
  for (let i = 0; i < warnings.length; i++) {
    let warning = warnings[i];
    warning.update();
    if (warning.time <= 0) {
      // Delete warning / replace with obstacle
      if (warning instanceof WarningRect) obstacles.push(new ObstacleRect(warning.x, warning.y, warning.w, warning.h, warning.obstacleTime));
      else if (warning instanceof WarningCircle) obstacles.push(new ObstacleCircle(warning.x, warning.y, warning.r, warning.obstacleTime));
      warnings.splice(i--, 1);
    }
  }

  // Draw everything
  for (warning of warnings) {
    warning.draw();
  }
  player.draw(playerAlive);
  let textStyle = ctx.fillStyle;
  for (obstacle of obstacles) {
    obstacle.draw();
  }
  ctx.font = '40px lato';
  ctx.fillStyle = textStyle;
  ctx.fillText(`${numberDeaths} hit${numberDeaths == 1 ? '' : 's'}`, 15, 50);
}

// Attacks

function lineAttack(isVertical, minSide, maxSide, waitTime, minWarn, maxWarn, minOTime, maxOTime) {
  let s = randRange(minSide, maxSide);
  let loc = randRange(-s, isVertical ? canvas.width : canvas.height);
  let warningTime = randRange(minWarn, maxWarn);
  let obstacleTime = randRange(minOTime, maxOTime);
  if (isVertical) {
    warnings.push(new WarningRect(loc, 0, s, canvas.height, waitTime, warningTime, obstacleTime));
  } else {
    warnings.push(new WarningRect(0, loc, canvas.width, s, waitTime, warningTime, obstacleTime));
  }
}

function gridAttack(numRows, numCols, horSpacing, vertSpacing, waitTime, minWarn, maxWarn, minOTime, maxOTime) {
  let row = Math.floor(randRange(0, numRows));
  let col = Math.floor(randRange(0, numCols));
  let actualWidth = canvas.width - (numCols + 1) * horSpacing;
  let actualHeight = canvas.height - (numRows + 1) * vertSpacing;
  let cellWidth = actualWidth / numCols;
  let cellHeight = actualHeight / numRows;
  let warningTime = randRange(minWarn, maxWarn);
  let obstacleTime = randRange(minOTime, maxOTime);
  warnings.push(new WarningRect(horSpacing + col * (cellWidth + horSpacing), vertSpacing + row * (cellHeight + vertSpacing), cellWidth, cellHeight, waitTime, warningTime, obstacleTime));
}

function randomAttack() {
  // Add new random warnings
  if (Math.random() > 0) {
    let r = randRange(20, 20);
    let x = randRange(-r, canvas.width);
    let y = randRange(-r, canvas.height);
    let warningTime = randRange(60, 120);
    let obstacleTime = randRange(40, 180);
    warnings.push(new WarningCircle(x, y, r, warningTime, warningTime, obstacleTime));
  }
}

function randRange(a, b) {
  return a + Math.random() * (b-a);
}

function leftClick(evt) {
  if (!gameStarted) {
    gameStarted = true;
    loadLevel("level1");
    return;
  }
  // console.log(evt);
}

function rightClick(evt) {
  evt.preventDefault();
  // console.log(evt);
}

function keyDown(evt) {
  // console.log(evt.keyCode);
  keyHeld[evt.keyCode] = true;
}

function keyUp(evt) {
  // console.log(evt.keyCode);
  keyHeld[evt.keyCode] = false;
}

function loadLevel(level) {
  attacks = [];
  // Load json
  fetch(`${level}/level.json`)
  .then(res => res.json())
  .then(data => {
    music = new sound(`${level}/music.mp3`, data.musicVolume);
    musicName = data.musicName;
    musicDescription = data.musicDescription;
    let musicBPM = data.musicBPM;
    let timePerMeasure = 60 / musicBPM;
    let timePerBeat = timePerMeasure / 4;
    let musicOffset = data.musicOffset;
    console.log(timePerMeasure, timePerBeat);

    // Parse all attacks
    let rawAttacks = data.attacks;
    let time, functionToCall, measure, beat;
    for (a of rawAttacks) {
      // Parse time
      if (a.time.indexOf(' ') == -1) {
        // Custom time (keep as is)
        time = parseFloat(a.time);
      } else {
        // Split time into measure / beat
        let split = a.time.split(' ');
        measure = parseInt(split[0]) - 1;
        beat = parseInt(split[1]) - 1;
        time = musicOffset + measure * timePerMeasure + beat * timePerBeat;
      }

      // Parse attack type
      if (a.type == 'lineAttack') {
        time -= a.maxWarn;
        let isVertical = a.isVertical;
        let minSide = a.minSide;
        let maxSide = a.maxSide;
        let minWarn = a.minWarn * 60;
        let maxWarn = a.maxWarn * 60;
        let minOTime = a.minOTime * 60;
        let maxOTime = a.maxOTime * 60;
        functionToCall = function() {
          lineAttack(isVertical, minSide, maxSide, maxWarn, minWarn, maxWarn, minOTime, maxOTime);
        };
      } else if (a.type == 'gridAttack') {
        time -= a.maxWarn;
        let numRows = a.numRows;
        let numCols = a.numCols;
        let horSpacing = a.horSpacing;
        let vertSpacing = a.vertSpacing;
        let minWarn = a.minWarn * 60;
        let maxWarn = a.maxWarn * 60;
        let minOTime = a.minOTime * 60;
        let maxOTime = a.maxOTime * 60;
        functionToCall = function() {
          gridAttack(numRows, numCols, horSpacing, vertSpacing, maxWarn, minWarn, maxWarn, minOTime, maxOTime);
        };
      } else {
        console.log("Unknown attack type", a.type);
      }

      if (a.repeat) {
        // Repeat!
        let split = a.repeat.split(' ');
        let numRepeats = parseInt(split[0]);
        let numBeats = parseInt(split[1]);
        for (let i = 0; i < numRepeats; i++) {
          // console.log(time);
          attacks.push(new Attack(time, functionToCall));
          time = musicOffset + (measure + Math.floor((numBeats * (i+1)) / 4)) * timePerMeasure + (beat + (numBeats * (i+1)) % 4) * timePerBeat;
          time -= a.maxWarn;
        }
      } else {
        attacks.push(new Attack(time, functionToCall));
      }
      attacks.sort((a, b) => a.time - b.time);
    }
  })
  .then(startGame);
}

function startGame() {
  currAttack = 0;
  gameStarted = true;
  playerAlive = true;
  numberDeaths = 0;
  music.play();

  clearScreen();
  setInterval(tick, 1000/FPS);
  // Vertical line attack
  // setInterval(function() { lineAttack(true, 50, 100, 55, 55, 55, 60, 60) }, 231);
  // Horizontal line attack
  // setInterval(function() { lineAttack(false, 30, 70, 55, 55, 55, 60, 60) }, 462);
  // Mega grid attack
  // setInterval(function() { gridAttack(3, 5, 20, 20, 83, 83, 83, 40, 40) }, 462/4);
  // Large grid attack
  // setInterval(function() { gridAttack(5, 8, 20, 15, 55, 55, 55, 60, 60) }, 462/4);
  // Small grid attack
  // setInterval(function() { gridAttack(10, 16, 13, 10, 55, 55, 55, 60, 60) }, 462/4);
  // setInterval(function() { gridAttack(10, 16, 13, 10, 55, 55, 55, 60, 60) }, 462/4);
}

function clearScreen() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function sound(src, volume = 1) {
  this.soundElement = document.createElement('audio');
  this.soundElement.src = src;
  this.soundElement.volume = volume;
  this.soundElement.setAttribute('preload', 'auto');
  this.soundElement.setAttribute('controls', 'none');
  this.soundElement.style.display = 'none';
  document.body.appendChild(this.soundElement);
  this.play = function() {
    this.soundElement.play();
  }
  this.stop = function() {
    this.soundElement.pause();
  }
}