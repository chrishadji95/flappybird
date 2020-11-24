let serial;
let latestData = "waiting for data";

let portName = 'COM4';//update this with the port you are using

let oldAcc;

let acc = [];

var yVal; // bird y value
var accel;
var velocity;
var mass; // bird size

let walls = [];
var img;

function preload(){

  img = loadImage("bird1.png");
}
function setup() {
 createCanvas(windowWidth, windowHeight);

  walls.push(new Wall());

  yVal = 0;
  velocity = 0;
  mass = 10;
  accel = mass * 0.02;

 serial = new p5.SerialPort();

 //serial.list();
 serial.open(portName);

 serial.on('connected', serverConnected);

 serial.on('list', gotList);

 serial.on('data', gotData);

 serial.on('error', gotError);

 serial.on('open', gotOpen);

 serial.on('close', gotClose);
}

function serverConnected() {
 print("Connected to Server");
}

function gotList(thelist) {
 print("List of Serial Ports:");

 for (let i = 0; i < thelist.length; i++) {
  print(i + " " + thelist[i]);
 }
}

function gotOpen() {
 print("Serial Port is Open");
}

function gotClose(){
 print("Serial Port is Closed");
 latestData = "Serial Port is Closed";
}

function gotError(theerror) {
 print(theerror);
}

function gotData() {
 let currentString = serial.readLine();
  trim(currentString);//trim removes white spaces
 if (!currentString) return;
 //console.log(currentString);
 latestData = currentString.split(',');
 console.log(latestData);

 acc[0]= map(latestData[2],-2,2,0,100);
  acc[1]= map(latestData[3],-2,2,0,100);
 acc[2]= map(latestData[4],-2,2,0,100);

}

function draw() {
  background(125,194,225);

if (frameCount%120 == 0){ //so walls appear only when this is true
  walls.push(new Wall());
}

  for (let i = 0; i < walls.length; i++) {
  walls[i].move();
  walls[i].display();
  }

  velocity += accel;
  yVal += velocity;

  noStroke();
  fill(210, 0, 0);
image(img, width/2, yVal);
//ellipse(width/2,yVal, mass);

  shake();

}

function keyPressed(){
	if(key == 'l'){
		writeSerial(key);
	}
}

function writeSerial(writeOut){
	serial.write(writeOut);
}

function shake(){
//setInterval(shake(), 1000);
	if(acc[1]-oldAcc > 5){
		yVal += -10;
    velocity = -2.4;
		oldAcc = acc[1];

	}

	oldAcc = acc[1];
}

class Wall {
  constructor() {

    this.x = width;
    this.y = 0; //starting point of wall
    this.rectW = 100;
    this.rectH = random (200, 430); //height of wall starting at the top
    this.speed = 3.5;
    this.random = random (100, 200); //used to subtract from height (for bottom wall)
}
    move() {
      this.x = this.x - this.speed;
    }

    display() {
      rectMode(CORNER);
      fill(0, 150, 100);
      rect(this.x, this.y, this.rectW, this.rectH); //top wall
      rect(this.x, height - this.random, this.rectW, this.random); //bottom wall

    }
  }
