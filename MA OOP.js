// Demonstration of multiple force acting on 
// bodies (Mover class)
// Bodies experience gravity continuously
// Bodies experience fluid resistance when in "water"

// Five moving bodies
var movers = [];

// Liquid
var liquid;

function setup() {
  createCanvas(640, 360);
  reset();
  // Create liquid object
  liquid = new Liquid(0, height/2, width, height/2, 0.1);	//This is an example of an instance. An instance is an example of its constructor.
}															//For example, the variable liquid is an instance of the constructor Liquid. It passes
															//in x, y, w, h, and c. These are 0, height/2, width, height/2, and 0.1, respectively.
function draw() {
  background(127);
  
  // Draw water
  liquid.display();

  for (var i = 0; i < movers.length; i++) {
    
    // Is the Mover in the liquid?
    if (liquid.contains(movers[i])) {
      // Calculate drag force
      var dragForce = liquid.calculateDrag(movers[i]);
      // Apply drag force to Mover
      movers[i].applyForce(dragForce);
    }

    // Gravity is scaled by mass here!
    var gravity = createVector(0, 0.1*movers[i].mass);
    // Apply gravity
    movers[i].applyForce(gravity);
   
    // Update and display
    movers[i].update();
    movers[i].display();
    movers[i].checkEdges();
  }
  
}


function mousePressed() {
  reset();
}

// Restart all the Mover objects randomly
function reset() {
  for (var i = 0; i < 9; i++) {
    movers[i] = new Mover(random(0.5, 3), 40+i*70, 0);
  }
}

//This is a constructor function. A constructor function is easily identifiable by the capital first letter, differenciating this from an ordinary function. In a program, a constructor function is used as a template for other objects. These other objects inherit traits from this constructor. For example, this constructor would give other objects the properties x, y, w, h, and c. A class is constructed by the constructor function. The prototype object is something that details that one constructor function inherits from something else. If you code in Liquid.prototype = new Thing(x, y, w, h, c), then you would be coding in that Liquid's prototype inherits from Thing.
var Liquid = function(x, y, w, h, c) { 
//This is an example of a property. A property is a value that an object has. For example, the object that the keyword "this" is referring to is the name of the instance. If the instance was named liquid, then liquid would have the properties x, y, w, h, and c, because the constructor gives it those properties to inherit. Properties are different values in an object, and can be compared to values in an array, because there is one array, except you differenciate values in an array by numbers, not by words, like in an object.
  this.x = x;						 
  this.y = y;						
  this.w = w;						
  this.h = h;
  this.c = c;
};
  
// Is the Mover in the Liquid?
//This is a method. A method is a function, except in an object. This method, Liquid.prototype.contains, is a method that assigns the position of m to a private variable, l, and returns a boolean.
Liquid.prototype.contains = function(m) {
  var l = m.position;
  return l.x > this.x && l.x < this.x + this.w &&
         l.y > this.y && l.y < this.y + this.h;
};
  
// Calculate drag force
Liquid.prototype.calculateDrag = function(m) {
  // Magnitude is coefficient * speed squared
  var speed = m.velocity.mag();
  var dragMagnitude = this.c * speed * speed;

  // Direction is inverse of velocity
  var dragForce = m.velocity.get();
  dragForce.mult(-1);
  
  // Scale according to magnitude
  // dragForce.setMag(dragMagnitude);
  dragForce.normalize();
  dragForce.mult(dragMagnitude);
  return dragForce;
};
  
Liquid.prototype.display = function() {
  noStroke();
  fill(50);
  rect(this.x, this.y, this.w, this.h);
};

function Mover(m,x,y) {
  this.mass = m;
  this.position = createVector(x,y);
  this.velocity = createVector(0,0);
  this.acceleration = createVector(0,0);
}

// Newton's 2nd law: F = M * A
// or A = F / M
Mover.prototype.applyForce = function(force) {
  var f = p5.Vector.div(force,this.mass);
  this.acceleration.add(f);
};
  
Mover.prototype.update = function() {
  // Velocity changes according to acceleration
  this.velocity.add(this.acceleration);
  // position changes by velocity
  this.position.add(this.velocity);
  // We must clear acceleration each frame
  this.acceleration.mult(0);
};

Mover.prototype.display = function() {
  stroke(0);
  strokeWeight(2);
  fill(255,127);
  ellipse(this.position.x,this.position.y,this.mass*16,this.mass*16);
};

// Bounce off bottom of window
Mover.prototype.checkEdges = function() {
  if (this.position.y > height) {
    // A little dampening when hitting the bottom
    this.velocity.y *= -0.9;
    this.position.y = height;
  }
};








