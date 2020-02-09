
var maxpoints;
var canvas;
var context;
var drawdir = false;
var time_dt = 40;
var bodyindex = [];

document.addEventListener("DOMContentLoaded", function() {
	//start after DOM has loaded, otherwise must be placed in <body>
  initiator();
});

function initiator() {
	canvas = document.getElementById("myCanvas");
	context = canvas.getContext("2d");
  maxpoints = Math.floor((Math.random() * 7) + 5);
  bodyindex.length = maxpoints;
  document.getElementById("A").innerHTML = "N =  " + maxpoints;
  for (k = 0; k < maxpoints; k++) {
		//random starting coords for each object
    let rx = Math.floor((Math.random() * 200) + 300);
    let ry = Math.floor((Math.random() * 200) + 150);
		//random mass for each object, with minimum mass
    let rmass = Math.floor((Math.random() * 5) + 5);
    bodyindex[k] = new body(rx, ry, rmass);
  }
  loop();
}
function reset() {
  bodyindex = [];
  maxpoints = Math.floor((Math.random() * 5) + 5);
  bodyindex.length = maxpoints;
  document.getElementById("A").innerHTML = "N =  " + maxpoints;
  for (k = 0; k < maxpoints; k++) {
    let rx = Math.floor((Math.random() * 200) + 300);
    let ry = Math.floor((Math.random() * 200) + 150);
    let mass = Math.floor((Math.random() * 5) + 5);
    bodyindex[k] = new body(rx, ry, mass);
  }
}
function loop() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  draw();
  speedcalc();
  update();
  setTimeout(loop, time_dt);
}
function speedcalc() {
  for (s = 0; s < maxpoints; s++) {
    let f = 0;
    let dx = 0;
    let dy = 0;
    let ux = 0;
    let uy = 0;
    let tempxdist = 0;
    let tempydist = 0;
 		let distance = 0;
    for (j = 0; j < maxpoints; j++) {
      if (j == s) {
        continue;
      }
      //calculate distance
      tempxdist = -1 * (bodyindex[s].x - bodyindex[j].x);
      tempydist = -1 * (bodyindex[s].y - bodyindex[j].y);
      distance = Math.sqrt(tempxdist * tempxdist + tempydist * tempydist);
      if (distance < 3 || distance > 800) {
        continue;
      }
      let distanceS = distance * distance;
      //calculate force
      f = 0.1 * bodyindex[s].mass * bodyindex[j].mass / distanceS;
      //calculate unitvector
      ux = tempxdist / distance;
      uy = tempydist / distance;
      //calculate speed
      bodyindex[s].vx += f / bodyindex[s].mass * ux;
      bodyindex[s].vy += f / bodyindex[s].mass * uy;
      if (drawdir) {
        draweachforcedir(ux, uy, s, f);
      }
    }
  }
}
function draweachforcedir(dx, dy, i, f) {
  context.moveTo(bodyindex[i].x, bodyindex[i].y);
  context.lineTo(bodyindex[i].x + dx * 20, bodyindex[i].y + dy * 20);
  context.stroke();
}
function body(xpos, ypos, nmass) {
  this.mass = nmass;
  this.x = xpos;
  this.y = ypos;
  this.vx = 0;
  this.vy = 0;
}
function update() {
  for (p = 0; p < maxpoints; p++) {
    bodyindex[p].x += bodyindex[p].vx;
    bodyindex[p].y += bodyindex[p].vy;
  }
}
function draw() {
  for (i = 0; i < maxpoints; i++) {
    context.beginPath();
    context.arc(bodyindex[i].x, bodyindex[i].y, 5, 0, 2 * Math.PI);
    context.stroke();
    context.fillText(bodyindex[i].mass, bodyindex[i].x + 10, bodyindex[i].y + 10);
  }
}
