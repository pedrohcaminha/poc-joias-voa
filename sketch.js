let handPose;
let hands;
let once = true;
let once1 = true;
let once2 = true;
let once3 = true;
let once4 = true;
let x1 = 0
let y1 = 0
let x2 = 0
let y2 = 0
let middlepointx = 0
let middlepointy = 0
let video;
let poseNet;
let pose;
let skeleton;
let horO = 0;
let vertO = 20;
let confianca = 0.8;
let lerpp = 0.3;
let select = 0
let img1f
let img2f
let play 
let colar
let img1, img2, colarf
let playy = 0
let xd1f = 0
let xd2f = 0
let yd1f = 0
let yd2f = 0
let anel

function preload() {
  img1f = loadImage('be.png');
  img2f = loadImage('bd.png');
  img1 = loadImage('be.png');
  img2 = loadImage('bd.png');
  play = loadImage('play.png');
  colar = loadImage('colar.png')
  colarf = loadImage('colar.png')
  anel = loadImage('anel.png')
}



function setup() {
  
  createCanvas(1280 , 720);
  video = createCapture(VIDEO);
  // video = createVideo('face.mp4', vidLoad)
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);
  handpose = ml5.handpose(video, modelReady);
  button = createButton('demo');
  button.position(19, 19);
  button.mousePressed(change);
  
}

function vidLoad() {
  console.log('video ready')
  video.volume(0);
}


function mouseClicked(){
  video.loop()
}

function gotPoses(poses) {
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}

function modelLoaded() {
  console.log('poseNet ready');
  playy++
}

function modelReady() {
  console.log('hand pose loaded');
  handpose.on('predict', gotPose);
  playy++
}

function gotPose(results) {
  // do something with the results
  hands = results;
};

function draw() {
  if(select >= 1){
    image(video, 0, 0, width, height)
  }  
  if (pose) {
    if(pose.leftEye.confidence > 0.5 && pose.rightEye.confidence > 0.5){
      let eyeR = pose.rightEye;
      let eyeL = pose.leftEye;
      let d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);
      img1.resize(d/2, 0);
      img2.resize(d/2, 0);
      colar.resize(d*4, 0)
    }
    if(pose.rightEar.confidence > 0.80){
      if(once1){
        x1a = pose.rightEar.x;
        y1a = pose.rightEar.y;
        once1 = false
      }else{
        x1a = lerp(x1a, pose.rightEar.x, 0.4);
        y1a = lerp(y1a, pose.rightEar.y, 0.4);
      }
      if(select == 1){
        image(img2, map(x1a+horO, 0, video.width, 0, width), map(y1a+vertO, 0, video.height, 0, height));
      }
    }
    if(pose.leftEar.confidence > 0.80){
      if(once2){
        x2b = pose.leftEar.x;
        y2b = pose.leftEar.y;
        once2 = false
      }else{
        x2b = lerp(x2b, pose.leftEar.x, 0.4);
        y2b = lerp(y2b, pose.leftEar.y, 0.4);
      }
      if(select == 1){
        image(img1, map(x2b+horO, 0, video.width, 0, width), map(y2b+vertO, 0, video.height, 0, height));
      }
    }
    if(once3){
      middlepointx = ((pose.leftShoulder.x + pose.rightShoulder.x) / 2)
      middlepointy = ((pose.leftShoulder.y + pose.rightShoulder.y) / 2)
      once3 = false
    }else{
      middlepointx = lerp(middlepointx, ((pose.leftShoulder.x + pose.rightShoulder.x) / 2), 0.4);
      middlepointy = lerp(middlepointy, ((pose.leftShoulder.y + pose.rightShoulder.y) / 2), 0.4);
    }
    if(select == 2){
      imageMode(CENTER)
      image(colar, map(horO + middlepointx, 0, video.width, 0, width), map(vertO + middlepointy + 60, 0, video.height, 0, height))
      imageMode(CORNER)
    }
  }
  if(select == 0){
    background(255)
    if(playy >= 2){
      imageMode(CENTER)
      image(play, width/2, height/2)
      imageMode(CORNER)
    }
  }
  img1 = img1f.get()
  img2 = img2f.get()
  colar = colarf.get()



  if (hands && hands.length > 0 && select == 3) {
    let hand = hands[0];
    let landmarks = hand.landmarks;
    let [xd1, yd1, zd1] = landmarks[13];
    let [xd2, yd2, zd2] = landmarks[14];
    xd1 = map(xd1, 0, video.width, 0, width)
    xd2 = map(xd2, 0, video.width, 0, width)
    yd1 = map(yd1, 0, video.height, 0, height)
    yd2 = map(yd2, 0, video.height, 0, height)
    if(once4){
      xd1f = xd1 
      xd2f = xd2 
      yd1f = yd1 
      yd2f = yd2 
      once4 = false
    }else{
      xd1f = lerp(xd1f,xd1,0.4)
      xd2f = lerp(xd1f,xd2,0.4)
      yd1f = lerp(yd1f,yd1,0.4)
      yd2f = lerp(yd1f,yd2,0.4)
    }
    imageMode(CENTER)
    image(anel, (xd1f+xd2f)/2, (yd1f+yd2f)/2)
    imageMode(CORNER)
  }
  
}

let pmouseX = 0;
let pmouseY = 0;
function touchStarted() {
  pmouseX = mouseX;
  pmouseY = mouseY;
}

function touchMoved(){
  if(mouseX > pmouseX){
    horO++;
  }else if(mouseX < pmouseX){
    horO--;
  }

  if(mouseY > pmouseY){
    vertO++;
  }else if(mouseY < pmouseY){
    vertO--;
  }

  pmouseX = mouseX;
  pmouseY = mouseY;
}

function change(){
  if(playy >= 2){
    select++
    if(select == 4){
      select = 0
    }
  }
}






