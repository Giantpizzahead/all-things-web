const canvas = document.getElementById('main-canvas');
const ctx = canvas.getContext('2d');

// Left click handler
canvas.onclick = handleLeftClick;
// Right click handler
canvas.oncontextmenu = handleRightClick;

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
    ctx.fill();
  }
}

class Segment {
  constructor(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
  }

  draw(color = '#00ff00') {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }
}

class Polygon {
  constructor(points) {
    this.points = points;
  }

  draw(color = '#ff0000') {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; i++) {
      ctx.lineTo(this.points[i].x, this.points[i].y);
    }
    ctx.fill();
  }

  drawSegments(color = '#00ff00') {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; i++) {
      ctx.lineTo(this.points[i].x, this.points[i].y);
    }
    ctx.closePath();
    ctx.stroke();
  }

  drawPoints(color = '#0000ff') {
    ctx.fillStyle = color;
    for (let i = 0; i < this.points.length; i++) {
      this.points[i].draw();
    }
  }
}

let poly = new Polygon([]);

function handleLeftClick(event) {
  let x = event.pageX - (canvas.offsetLeft + canvas.clientLeft);
  let y = event.pageY - (canvas.offsetTop + canvas.clientTop);
  // ctx.fillText(`Left click ${x}, ${y}`, x, y);
  poly.points.push(new Point(x, y));
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  poly.draw();
  poly.drawSegments();
  poly.drawPoints();
}

function handleRightClick(event) {
  event.preventDefault();
  let x = event.pageX - (canvas.offsetLeft + canvas.clientLeft);
  let y = event.pageY - (canvas.offsetTop + canvas.clientTop);
  // ctx.fillText(`Right click ${x}, ${y}`, x, y);
  poly.points.shift();
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  poly.draw();
  poly.drawSegments();
  poly.drawPoints();
}

ctx.font = "22px serif";
ctx.fillText("Left click to add last point", 30, 50);
ctx.fillText("Right click to remove first point", 30, 80);

// let p1 = new Point(100, 200);
// let p2 = new Point(500, 600);

// let seg = new Segment(p1, p2);
// seg.draw('#0000ff');

// p1.x += 300;
// seg.draw('#00ff00');
// p2.y -= 400;
// seg.draw('#ff0000');