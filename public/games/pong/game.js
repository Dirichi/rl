var paddleA, paddleAI;
var gameBoundary;
var ball;
var q, brain, q2, brain2;
var possibleStates = [];
var Ascore = 0;
var AIscore = 0;
var rewardAssigner;
var NUM_FEATURES = 5;

 function setup() {
  createCanvas(windowWidth,windowHeight);
  initGame();
  // q = new Q(possibleStates, paddleAI.actions);
  q = new QRegression(NUM_FEATURES, ['up', 'down']);
  q.setEnvironment(this);
  q.setBatchSize(10);
  q2 = new QRegression(NUM_FEATURES, ['up', 'down']);
  // q2.setBatchSize(10);
  q2.setEnvironment(this);
  brain = new Learner(q, 0.1, 0.9, 0.8, paddleAI);
  brain2 = new Learner(q2, 0.05, 0.9, 0.8, paddleA);
  rewardAssigner = new RewardAssigner(this);
}

 function draw(){
  animateGame();
  manageScores();
  manageLearning();
  restartWhenBallOutOfBounds();
}

function initGame(){
  paddleA = new Paddle(30, windowHeight/2 - 50, 10, 100, 10);
  paddleAI = new Paddle(windowWidth - 30, windowHeight/2 - 50, 10, 100, 10);
  gameBoundary = new Boundary([0, windowWidth], [0, windowHeight]);
  ball = new Ball(windowWidth/2, windowHeight/2, 10, 10);

  paddleA.setBoundary(gameBoundary);
  paddleAI.setBoundary(gameBoundary);
  ball.setBoundary(gameBoundary);
  ball.addToCollidables(paddleA);
  ball.addToCollidables(paddleAI);
  // setupPossibleStatesForAI();
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
  // brain2.learn();
}

function observables(){
  var aiPos = paddleAI.ypos / windowHeight;
  var aPos = paddleA.ypos / windowHeight;
  var ballPos = ball.ypos / windowHeight;
  var ballxDirection = (ball.xDirection + 1) / 2;
  var ballyDirection = (ball.yDirection + 1) / 2;

  return [ballxDirection ,ballyDirection, ballPos, aiPos, aPos]
  // return [ballyDirection, ballPos, aiPos]

  // var aiRegion = paddleAI.yRegion();
  // var aRegion = paddleA.yRegion();
  // var ballRegion = ball.yRegion();
  // var ballxDirection = ball.xDirection
  // var ballyDirection = ball.yDirection
  //
  // return [aiRegion, aRegion, ballRegion, ballxDirection, ballyDirection]
}

function rewardEvents() {
  return [
    { target: brain, active: paddleAI.contains(ball), reward: 2 },

    { target: brain, active: ball.beyondRightMostXBounds(), reward: -5 },

    { target: brain, active: ball.beyondLeftMostXBounds(), reward: 5 },


    // { target: brain2, active: paddleA.contains(ball), reward: 2 },
    //
    // { target: brain2, active: ball.beyondLeftMostXBounds(), reward: -5 },
    //
    // { target: brain2, active: ball.beyondRightMostXBounds(), reward: 5 }
  ]
}

function administerRewards(){
  rewardAssigner.assignRewards();
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

function setupPossibleStatesForAI(){
  // this method is only used by Q objects, so need to move it out of the game
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
