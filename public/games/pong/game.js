//todo; only update rewards if rewards is not 0
var socket = io();
var paddleA, paddleAI;
var gameBoundary;
var ball;
var q, brain;
var possibleStates = [];
var rewards = 0;
var Ascore = 0;
var AIscore = 0;
var socketReady = false;
var messenger;

var has_require = typeof require !== 'undefined'

if( typeof Paddle === 'undefined' ) {
  if( has_require ) {
    Paddle = require('../lib/paddle')
  }
  else throw new Error('game requires paddle');
}


function setup() {
  createCanvas(windowWidth,windowHeight);
  paddleA = new Paddle(30, windowHeight/2 - 50, 10, 100, 10);
  paddleAI = new Paddle(windowWidth - 30, windowHeight/2 - 50, 10, 100, 10);
  gameBoundary = new Boundary([0, windowWidth], [0, windowHeight]);
  ball = new Ball(windowWidth/2, windowHeight/2, 10, 5);

  paddleA.setBoundary(gameBoundary);
  paddleAI.setBoundary(gameBoundary);
  ball.setBoundary(gameBoundary);
  ball.addToCollidables(paddleA);
  ball.addToCollidables(paddleAI);
  setupPossibleStatesForAI();
  paddleAI.setEnvironment(this);

  q = new Q(possibleStates, paddleAI.actions);
  brain = new Learner(q, 0.2, 0.9, 0.8, paddleAI);
  brain.q.setMessenger(messenger);
  brain.q.startPublishing();
}

function draw(){
  animateGame();
  manageScores();
  restartWhenBallOutOfBounds();
  manageLearning();
}

function animateGame() {
  background(0);
  paddleA.animate();
  paddleAI.animate();
  ball.animate();
  paddleA.track(ball);
}

function manageScores() {
  updateScoresOnBallOutOfXBounds();
  animateScores();
}

function manageLearning() {
  administerRewards();
  brain.learn();
  resetRewards();
}

function getStateForAI(){
  var aiRegion = paddleAI.yRegion();
  var aRegion = paddleA.yRegion();
  var ballRegion = ball.yRegion();
  var ballxDirection = ball.xDirection
  var ballyDirection = ball.yDirection

  var state = ''+ aiRegion + aRegion + ballRegion + ballxDirection + ballyDirection;
  return state
}

function getRewardsForAI(){
  return rewards;
}

function resetRewards(){
  rewards = 0;
}

function administerRewards(){
  incrementRewardsOnBallHit();
  incrementRewardsOnBallPastOpposition();
  decrementRewardsOnBallPastAiXBounds();
}

//questionable
function incrementRewardsOnBallHit(){
  if (paddleAI.contains(ball)) {
    updateRewards(2);
  }
}

function decrementRewardsOnBallPast(){
  if (paddleAI.xpos < ball.xpos) {
    updateRewards(-5);
  }
}

function incrementRewardsOnBallPastOpposition() {
  if (paddleA.xpos > ball.xpos) {
    updateRewards(5);
  }
}


function updateRewards(value){
  rewards += value;
}

function animateScores(){
  push();
  fill(255);
  textSize(30);
  text(Ascore, windowWidth/4, windowHeight/10);
  text(AIscore, 3 * windowWidth/4, windowHeight/10);
  pop();
}

function restartWhenBallOutOfBounds(){
  if (ball.beyondXBounds()) {
    ball.setPosition(windowWidth/2, windowHeight/2);
  }
}

function updateScoresOnBallOutOfXBounds(){
  if (ball.beyondLeftMostXBounds()) {
    AIscore += 1
  }
  if(ball.beyondRightMostXBounds()){
    Ascore += 1
  }
}

function decrementRewardsOnBallPastAiXBounds(){
  if (ball.beyondRightMostXBounds()) {
    updateRewards(-5)
  }
}

function setupPossibleStatesForAI(){
  var aiRegionPossibleStates = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  var aRegionPossibleStates = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  var ballRegionPossibleStates = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  var ballxDirectionPossibleStates = [-1, 1];
  var ballyDirectionPossibleStates = [-1, 1];

  for (var ai_idx = 0; ai_idx < aiRegionPossibleStates.length; ai_idx++) {
    for (var a_idx = 0; a_idx < aRegionPossibleStates.length; a_idx++) {
      for (var ball_region_idx = 0; ball_region_idx < ballRegionPossibleStates.length; ball_region_idx++) {
        for (var ball_xdirection_idx = 0; ball_xdirection_idx < ballxDirectionPossibleStates.length; ball_xdirection_idx++) {
          for (var ball_ydirection_idx = 0; ball_ydirection_idx < ballxDirectionPossibleStates.length; ball_ydirection_idx++) {
            var state = ''
            state += aiRegionPossibleStates[ai_idx]
            state += aRegionPossibleStates[a_idx]
            state += ballRegionPossibleStates[ball_region_idx]
            state += ballxDirectionPossibleStates[ball_xdirection_idx]
            state += ballyDirectionPossibleStates[ball_ydirection_idx]
            possibleStates.push(state)
          }
        }
      }
    }
  }

}

socket.on('ready', function (data) {
  console.log('socket dey')
  messenger = new Messenger({});
  messenger.setSocket(socket);
})
