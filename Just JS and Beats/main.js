let canvas = document.getElementById('main-canvas');
let ctx = canvas.getContext('2d');
const FPS = 60;
const NUM_KEYS = 256;
const DEBUG = false;

// Listener setup
canvas.addEventListener('click', leftClick);
canvas.addEventListener('contextmenu', rightClick);
canvas.addEventListener('keydown', keyDown);
canvas.addEventListener('keyup', keyUp);

window.onload = function() {
  // Initial text
  ctx.font = '80px lato';
  ctx.fillStyle = '#66EBFF';
  ctx.textAlign = 'center';
  ctx.fillText('Welcome to Just JS and Beats!', 860, 300);
  ctx.font = '50px lato';
  ctx.fillStyle = '#99FF99';
  ctx.fillText('Use WASD or arrow keys to move.', 860, 390);
  ctx.fillText('Dodge the red obstacles to win!', 860, 470);
  ctx.fillStyle = '#FF9999';
  ctx.fillText('Simple... right?', 860, 550);
  ctx.fillStyle = '#99FF99';
  ctx.fillText('Press Escape at any time to return to the menu.', 860, 630);
  ctx.font = '65px lato';
  ctx.fillStyle = '#66EBFF';
  ctx.fillText('Click anywhere to begin...', 860, 735);
  ctx.font = '40px lato';
  ctx.fillStyle = '#99FF99';
  ctx.fillText('(Warning: Flashing lights)', 860, 1000);
  ctx.fillText('Inspired by Just Shapes and Beats', 860, 1055);
  ctx.textAlign = 'start';
}

class Player {
  constructor(x, y, speed, size, drawSize) {
    this.x = x;
    this.y = y;
    this.speed = speed * 60 / FPS;
    this.size = size;
    this.drawSize = drawSize;
  }

  draw(invinciblity) {
    let alpha = 1;
    if (invinciblity != 0) alpha = 0.7;
    if (invinciblity % 4 < 2) {
      ctx.fillStyle = `rgba(102, 235, 255, ${alpha})`;
    }
    else ctx.fillStyle = `rgba(255, 179, 215, ${alpha})`;
    // Draw the player slightly bigger for a nicer hitbox
    ctx.fillRect(this.x-this.drawSize, this.y-this.drawSize, this.drawSize * 2, this.drawSize * 2);
    if (invinciblity % 4 < 2) {
      ctx.fillStyle = `rgb(102, 235, 255)`;
    }
    else ctx.fillStyle = `rgb(255, 179, 215)`;
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
    ctx.fillStyle = `rgba(255, 0, 0, ${intensity})`;
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
    ctx.fillStyle = `rgba(255, 0, 0, ${intensity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    ctx.fill();
  }
}

class WarningText {
  constructor(x, y, font, colorR, colorG, colorB, text, time) {
    this.x = x;
    this.y = y;
    this.font = font;
    this.colorR = colorR;
    this.colorG = colorG;
    this.colorB = colorB;
    this.text = text;
    this.time = time;
    this.startTime = time;
  }

  update() {
    this.time--;
  }

  draw() {
    let alpha = 1;
    if (this.startTime - this.time < 20) {
      // Fade in
      alpha = 1 * (this.startTime - this.time) / 20;
    }
    if (this.time < 20) {
      // Fade out
      alpha = this.time / 20;
    }
    
    ctx.font = this.font;
    ctx.fillStyle = `rgba(${this.colorR}, ${this.colorG}, ${this.colorB}, ${alpha})`;
    ctx.fillText(this.text, this.x, this.y);
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
    let flash = 0;
    let alpha = 1;
    if (this.startTime - this.time < 20) {
      // In middle of starting flash
      flash = 255 * (20 - (this.startTime - this.time)) / 20;
    }
    if (this.time < 20) {
      // In middle of ending fade
      alpha = this.time / 20;
    }
    ctx.fillStyle = `rgba(255, ${flash}, ${flash}, ${alpha})`;
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
    let flash = 0;
    let alpha = 1;
    if (this.startTime - this.time < 20) {
      // In middle of starting flash
      flash = 255 * (20 - (this.startTime - this.time)) / 20;
    }
    if (this.time < 20) {
      // In middle of ending fade
      alpha = this.time / 20;
    }
    ctx.fillStyle = `rgba(255, ${flash}, ${flash}, ${alpha})`;
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
    if (this.x < -this.r || this.x > canvas.width + this.r || this.y < -this.r || this.y > canvas.height + this.r) {
      // No longer on screen; remove
      this.time = 0;
    }
  }
}

class BombCircle extends MovingCircle {
  constructor(x, y, dx, dy, decayRate, r, time, burstCount, burstSize, burstSpeed) {
    super(x, y, dx, dy, r, time);
    this.decayRate = decayRate;
    this.burstCount = burstCount;
    this.burstSize = burstSize;
    this.burstSpeed = burstSpeed;
  }

  update() {
    super.update();
    this.dx *= this.decayRate;
    this.dy *= this.decayRate;
  }

  explode() {
    screenFlash(15);
    let randOffset = randRange(0, 2 * Math.PI);
    for (let i = 0; i < this.burstCount; i++) {
      let direction = randOffset + 2 * Math.PI * i / this.burstCount;
      let newdx = Math.sin(direction) * this.burstSpeed;
      let newdy = Math.cos(direction) * this.burstSpeed;
      obstacles.push(new MovingCircle(this.x, this.y, newdx, newdy, this.burstSize, 9999999));
    }
  }

  draw(){
    // Draw outer border
    let orangeness = 153 * this.time / this.startTime;
    ctx.fillStyle = `rgb(255, ${orangeness}, 0)`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw inner circle
    if ((this.startTime - this.time) % 4 < 2) {
      let flash = 55 + 200 * (this.startTime - this.time) / this.startTime;
      ctx.fillStyle = `rgba(255, ${flash}, ${flash}, 1)`;
    } else {
      ctx.fillStyle = 'rgb(255, 0, 0)';
    }
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r * 0.85, 0, 2 * Math.PI);
    ctx.fill();
  }
}

let gameStarted = false;
let currentScreen = 'idle';
let playerInvincibility = 0, invincibilityFrames;
let screenFlashTime = 0;
let numberDeaths = 0;
let tickIntervalID;
let level, diff;
let music;
let musicName, musicDescription, musicBPM, timePerMeasure, timePerBeat, musicOffset;
let hitSound1 = new sound("sounds/hit1.mp3", 0.5), hitSound2 = new sound("sounds/hit2.mp3", 0.6);
let player = new Player(canvas.width / 2, canvas.height / 2, 6, 12, 15);
let keyHeld = [];
for (let i = 0; i < NUM_KEYS; i++) keyHeld.push(false);
let warnings = [];
let obstacles = [];
let attacks = [];
let currAttack;

function tick() {
  if (currentScreen != 'mainGame') {
    clearInterval(tickIntervalID);
    if (currentScreen == 'levelComplete') displayMenu();
    return;
  }
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
      if (obstacle instanceof BombCircle) {
        // Let the bomb summon smaller circles first
        obstacle.explode();
      }
      obstacles.splice(i--, 1);
    }

    // Has obstacle collided with player?
    if (obstacle.isTouchingPlayer()) {
      // Player lost!
      if (playerInvincibility == 0) {
        numberDeaths++;
        playerInvincibility = invincibilityFrames;
        wasHit = true;
      }
    }
  }

  if (wasHit) {
    // Play hit sound
    if (Math.random() < 0.5) hitSound1.play();
    else hitSound2.play();
  }

  // Update all warnings
  for (let i = 0; i < warnings.length; i++) {
    let warning = warnings[i];
    warning.update();
    if (warning.time <= 0) {
      // Delete warning / replace with obstacle if needed
      if (warning instanceof WarningRect) obstacles.push(new ObstacleRect(warning.x, warning.y, warning.w, warning.h, warning.obstacleTime));
      else if (warning instanceof WarningCircle) obstacles.push(new ObstacleCircle(warning.x, warning.y, warning.r, warning.obstacleTime));
      warnings.splice(i--, 1);
    }
  }

  // Draw everything
  if (playerInvincibility != 0) playerInvincibility--;
  player.draw(playerInvincibility);
  let textStyle = ctx.fillStyle;
  for (warning of warnings) {
    warning.draw();
  }
  for (obstacle of obstacles) {
    obstacle.draw();
  }
  ctx.font = '40px lato';
  ctx.fillStyle = textStyle;
  ctx.fillText(`${numberDeaths} hit${numberDeaths == 1 ? '' : 's'}`, 15, 50);
  if (DEBUG) {
    let currentBeat = Math.floor((music.soundElement.currentTime - musicOffset) / timePerMeasure) + 1;
    ctx.fillText(`M ${currentBeat}`, 15, 100);
  }

  // Flash the screen!
  if (screenFlashTime != 0) {
    screenFlashTime--;
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, screenFlashTime / 100)})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

// Attacks

function lineAttack(isVertical, minSide, maxSide, waitTime, minWarn, maxWarn, minOTime, maxOTime) {
  if (isVertical == 2) {
    if (Math.random() < 0.5) isVertical = 0;
    else isVertical = 1;
  }
  let s = randRange(minSide, maxSide);
  let loc = randRange(-s/2, (isVertical ? canvas.width : canvas.height) - s/2);
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

function randomCircleAttack(onPlayerChance, minR, maxR, waitTime, minWarn, maxWarn, minOTime, maxOTime) {
  // Add new random warnings
  let r = randRange(minR, maxR);
  let x, y;
  if (Math.random() < onPlayerChance) {
    // Spawn this circle on or near the player
    x = randRange(player.x - r, player.x + r);
    y = randRange(player.y - r, player.y + r);
  } else {
    x = randRange(-r/2, canvas.width - r/2);
    y = randRange(-r/2, canvas.height - r/2);
  }
  let warningTime = randRange(minWarn, maxWarn);
  let obstacleTime = randRange(minOTime, maxOTime);
  warnings.push(new WarningCircle(x, y, r, waitTime, warningTime, obstacleTime));
}

function bombAttack(isVerticalNum, onUpperLeftNum, r, sideSpeedRange, minMainSpeed, maxMainSpeed, decayRate, wait, burstCount, burstSize, burstSpeed) {
  // Set which side of the screen the bomb will appear on
  let isVertical, onUpperLeft;
  if (isVerticalNum == 0 || (isVerticalNum == 2 && Math.random() < 0.5)) isVertical = false;
  else isVertical = true;
  if (onUpperLeftNum == 0 || (onUpperLeftNum == 2 && Math.random() < 0.5)) onUpperLeft = false;
  else onUpperLeft = true;

  let sideLoc = randRange(r + sideSpeedRange * 10, (isVertical ? canvas.height : canvas.width) - r - sideSpeedRange * 10);
  let sideSpeed = randRange(-sideSpeedRange, sideSpeedRange);
  let mainSpeed = randRange(minMainSpeed, maxMainSpeed);
  let x, y, dx, dy;

  // Spawn the bomb
  if (isVertical && onUpperLeft) {
    x = -r;
    y = sideLoc;
    dx = mainSpeed;
    dy = sideSpeed;
  } else if (isVertical && !onUpperLeft) {
    x = canvas.width + r;
    y = sideLoc;
    dx = -mainSpeed;
    dy = sideSpeed;
  } else if (!isVertical && onUpperLeft) {
    x = sideLoc;
    y = -r;
    dx = sideSpeed;
    dy = mainSpeed;
  } else {
    x = sideLoc;
    y = canvas.height + r;
    dx = sideSpeed;
    dy = -mainSpeed;
  }
  obstacles.push(new BombCircle(x, y, dx, dy, decayRate, r, wait, burstCount, burstSize, burstSpeed));
}

function screenFlash(flashTime) {
  screenFlashTime = flashTime;
}

function randRange(a, b) {
  return a + Math.random() * (b-a);
}

function leftClick(evt) {
  if (currentScreen == 'idle') {
    currentScreen = 'levelSelect';
    loadLevelSelect();
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
  if (currentScreen == 'levelSelect') {
    if (evt.keyCode >= 49 && evt.keyCode <= 57) {
      // Number pressed
      let num = evt.keyCode - 49;
      if (levels.length > num) {
        // Valid level; choose this one
        level = levels[num];
        currentScreen = 'difficultySelect';
        loadDiffSelect(level.id);
      }
    }
  } else if (currentScreen == 'difficultySelect') {
    if (evt.keyCode >= 49 && evt.keyCode <= 57) {
      // Number pressed
      let num = evt.keyCode - 49;
      if (difficulties.length > num) {
        // Valid difficulty; choose this one
        diff = difficulties[num];
        currentScreen = 'mainGame';
        loadGame(diff.id);
      }
    } else if (evt.keyCode == 27) {
      // Escape pressed
      currentScreen = 'levelSelect';
      loadLevelSelect();
    }
  } else if (currentScreen == 'levelComplete') {
    if (evt.keyCode == 13) {
      // Enter pressed
      music.stop();
      music.soundElement.remove();
      music = undefined;
      currentScreen = 'levelSelect';
      loadLevelSelect();
    }
  } else if (currentScreen == 'mainGame') {
    if (evt.keyCode == 27) {
      // Escape pressed
      music.stop();
      music.soundElement.remove();
      music = undefined;
      currentScreen = 'levelSelect';
      loadLevelSelect();
    }
  }
}

function keyUp(evt) {
  // console.log(evt.keyCode);
  keyHeld[evt.keyCode] = false;
}

let levels, difficulties;

function displayMenu() {
  clearScreen();
  if (currentScreen == 'levelSelect') {
    ctx.font = '80px lato';
    ctx.fillStyle = '#66EBFF';
    ctx.fillText('Please choose a level...', 460, 300);
    ctx.font = '50px lato';
    ctx.fillText('(Press a number on the keyboard)', 490, 370);
    ctx.font = '60px lato';
    for (let i = 0; i < levels.length; i++) {
      let currLevel = levels[i];
      ctx.fillStyle = `rgb(${currLevel.colorR}, ${currLevel.colorG}, ${currLevel.colorB})`;
      ctx.fillText(`(${i+1}) ${currLevel.name}`, 460, 470 + i * 95);
    }
  } else if (currentScreen == 'difficultySelect') {
    ctx.font = '80px lato';
    ctx.fillStyle = '#66EBFF';
    ctx.fillText('Choose a difficulty...', 500, 300);
    ctx.font = '50px lato';
    ctx.fillText('(Press a number on the keyboard)', 490, 370);
    ctx.fillStyle = '#FFB0FB';
    ctx.font = '60px lato';
    for (let i = 0; i < difficulties.length; i++) {
      let currDiff = difficulties[i];
      ctx.fillStyle = `rgb(${currDiff.colorR}, ${currDiff.colorG}, ${currDiff.colorB})`;
      ctx.fillText(`(${i+1}) ${currDiff.name}`, 460, 470 + i * 95);
    }
  } else if (currentScreen == 'levelComplete') {
    ctx.font = '80px lato';
    ctx.fillStyle = `rgb(${level.colorR}, ${level.colorG}, ${level.colorB})`;
    ctx.textAlign = 'center';
    if (numberDeaths <= diff.hitsToPass) {
      ctx.fillText('Level Complete!', 860, 295);
    } else {
      ctx.fillStyle = '#FF0000';
      ctx.fillText('Level Failed...', 860, 295);
      ctx.fillStyle = `rgb(${level.colorR}, ${level.colorG}, ${level.colorB})`;
    }
    ctx.fillText(`${level.name}`, 860, 420);
    ctx.fillStyle = `rgb(${diff.colorR}, ${diff.colorG}, ${diff.colorB})`;
    ctx.fillText(`Difficulty: ${diff.name}`, 860, 545);
    ctx.fillStyle = '#66EBFF';
    ctx.fillText(`Hits: ${numberDeaths} (${diff.hitsToPass} to pass)`, 860, 670);
    ctx.font = '50px lato';
    ctx.fillStyle = '#444444';
    ctx.fillText('(Press Enter to continue)', 860, 785);

    if (diff.id == "hardcore") {
      ctx.fillStyle = '#9999CC';
      if (numberDeaths <= diff.hitsToPass) {
        ctx.fillText('Password: determined4life', 860, 940);
      } else {
        ctx.fillText('Pass the level to get the password!', 860, 940);
      }
    }
    ctx.textAlign = 'start';
  }
}

function loadLevelSelect() {
  fetch('info.json')
  .then(res => res.json())
  .then(data => {
    levels = data.levels;
  })
  .then(displayMenu);
}

function loadDiffSelect(level) {
  fetch(`levels/${level}/info.json`)
  .then(res => res.json())
  .then(data => {
    music = new sound(`levels/${level}/music.mp3`, data.musicVolume);
    musicName = data.musicName;
    musicDescription = data.musicDescription;
    musicBPM = data.musicBPM;
    timePerMeasure = 60 / musicBPM;
    timePerBeat = timePerMeasure / 4;
    musicOffset = data.musicOffset;
    invincibilityFrames = data.invincibilityFrames;
    difficulties = data.difficulties;
    if (data.musicStartTime != 0) music.soundElement.currentTime = data.musicOffset + data.musicStartTime * timePerMeasure;
    // console.log(timePerMeasure, timePerBeat);
  })
  .then(displayMenu);
}

function loadGame(difficulty) {
  warnings = [];
  obstacles = [];
  attacks = [];
  // Load json
  fetch(`levels/${level.id}/${difficulty}.json`)
  .then(res => res.json())
  .then(data => {
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
        beat = parseFloat(split[1]) - 1;
        time = musicOffset + measure * timePerMeasure + beat * timePerBeat;
      }

      // Parse attack type
      if (a.type == 'lineAttack') {
        time -= a.maxWarn * timePerMeasure;
        let isVertical = a.isVertical;
        let minSide = a.minSide;
        let maxSide = a.maxSide;
        let minWarn = a.minWarn * timePerMeasure * FPS;
        let maxWarn = a.maxWarn * timePerMeasure * FPS;
        let minOTime = a.minOTime * timePerMeasure * FPS;
        let maxOTime = a.maxOTime * timePerMeasure * FPS;
        functionToCall = function() {
          lineAttack(isVertical, minSide, maxSide, maxWarn, minWarn, maxWarn, minOTime, maxOTime);
        };
      } else if (a.type == 'gridAttack') {
        time -= a.maxWarn * timePerMeasure;
        let numRows = a.numRows;
        let numCols = a.numCols;
        let horSpacing = a.horSpacing;
        let vertSpacing = a.vertSpacing;
        let minWarn = a.minWarn * timePerMeasure * FPS;
        let maxWarn = a.maxWarn * timePerMeasure * FPS;
        let minOTime = a.minOTime * timePerMeasure * FPS;
        let maxOTime = a.maxOTime * timePerMeasure * FPS;
        functionToCall = function() {
          gridAttack(numRows, numCols, horSpacing, vertSpacing, maxWarn, minWarn, maxWarn, minOTime, maxOTime);
        };
      } else if (a.type == 'customRect') {
        time -= a.warnTime * timePerMeasure;
        let x = a.x;
        let y = a.y;
        let w = a.w;
        let h = a.h;
        let warnTime = a.warnTime * timePerMeasure * FPS;
        let obstacleTime = a.obstacleTime * timePerMeasure * FPS;
        functionToCall = function() {
          warnings.push(new WarningRect(x, y, w, h, warnTime, warnTime, obstacleTime));
        };
      } else if (a.type == 'randomCircleAttack') {
        time -= a.maxWarn * timePerMeasure;
        let onPlayerChance = a.onPlayerChance;
        let minR = a.minR;
        let maxR = a.maxR;
        let minWarn = a.minWarn * timePerMeasure * FPS;
        let maxWarn = a.maxWarn * timePerMeasure * FPS;
        let minOTime = a.minOTime * timePerMeasure * FPS;
        let maxOTime = a.maxOTime * timePerMeasure * FPS;
        functionToCall = function() {
          randomCircleAttack(onPlayerChance, minR, maxR, maxWarn, minWarn, maxWarn, minOTime, maxOTime);
        };
      } else if (a.type == 'bombAttack') {
        time -= a.wait * timePerMeasure;
        let isVerticalNum = a.isVerticalNum;
        let onUpperLeftNum = a.onUpperLeftNum;
        let r = a.r;
        let sideSpeedRange = a.sideSpeedRange;
        let minMainSpeed = a.minMainSpeed;
        let maxMainSpeed = a.maxMainSpeed;
        let decayRate = a.decayRate;
        let wait = a.wait * timePerMeasure * FPS;
        let burstCount = a.burstCount;
        let burstSize = a.burstSize;
        let burstSpeed = a.burstSpeed * 60 / FPS;
        functionToCall = function() {
          bombAttack(isVerticalNum, onUpperLeftNum, r, sideSpeedRange, minMainSpeed, maxMainSpeed, decayRate, wait, burstCount, burstSize, burstSpeed);
        };
      } else if (a.type == 'screenFlash') {
        let flashTime = a.flashTime;
        functionToCall = function() {
          screenFlash(flashTime);
        }
      } else if (a.type == 'levelComplete') {
        functionToCall = function() {
          levelComplete();
        }
      } else if (a.type == 'comment') {
        // Ignore comments
        continue;
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
          if (a.maxWarn) time -= a.maxWarn * timePerMeasure;
          else if (a.warnTime) time -= a.warnTime * timePerMeasure;
          else if (a.wait) time -= a.wait * timePerMeasure;
        }
      } else {
        attacks.push(new Attack(time, functionToCall));
      }
      attacks.sort((a, b) => a.time - b.time);
    }
  })
  .then(startGame);
}

function levelComplete() {
  currentScreen = 'levelComplete';
}

function startGame() {
  currAttack = 0;
  // Skip all attacks that are before the current time
  while (currAttack != attacks.length && attacks[currAttack].time <= music.soundElement.currentTime) {
    currAttack++;
  }
  gameStarted = true;
  player.x = 860;
  player.y = 540;
  playerAlive = true;
  playerInvincibility = 0;
  numberDeaths = 0;
  music.play();

  clearScreen();
  tickIntervalID = setInterval(tick, 1000/FPS);

  // Add preliminary text
  warnings.push(new WarningText(15, 910, '70px lato', level.colorR, level.colorG, level.colorB, musicName, 240));
  warnings.push(new WarningText(15, 950, '25px lato', level.colorR, level.colorG, level.colorB, musicDescription, 240));
  warnings.push(new WarningText(15, 1010, '35px lato', diff.colorR, diff.colorG, diff.colorB, `Difficulty: ${diff.name}`, 240));
  warnings.push(new WarningText(15, 1050, '35px lato', diff.colorR, diff.colorG, diff.colorB, `Hits to pass: ${diff.hitsToPass}`, 240));

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
  // Bombs!!!!!!!
  // setInterval(function() { bombAttack(2, 2, 40, 10, 7, 25, 0.95, 45, 8, 5, 8); }, 462);
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