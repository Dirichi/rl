class Paddle {
  constructor(xpos, ypos, width, height, speed) {
    this.xpos = xpos;
    this.ypos = ypos;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.actions = ['up', 'down'];
    this.rewards = [];
    this.boundary;

    this.brain;
    this.environment;
  }

  animate(){
    push();
    rect(this.xpos, this.ypos, this.width, this.height);
    pop();
  }

  play(){
    // enqueue rewards
    //learn

  }

  track(entity){
    if (this.ypos + this.height/2 < entity.ypos) {
      this.moveDown()
    }
    else{
      this.moveUp();
    }
  }

  setBrain(brain){
    this.brain = brain;
  }

  setBoundary(boundary){
    this.boundary = boundary;
  }

  setEnvironment(environment){
    this.environment = environment;
  }

  learn(){
    //brain.learn
  }

  perform(action){
    if (action == 'up') {
      this.moveUp();
    }
    else if (action == 'down') {
      this.moveDown();
    }
    else{
      throw new Error(action + ' is not an allowed action')
    }

  }

  getState(){
    return this.environment.getStateForAI();
  }

  getReward(){
    return this.environment.getRewardsForAI();
  }

  moveUp(){
    if (!this.beyondUpperYBounds()) {
      this.incrementYPosBy(-this.speed)
    }
  }

  moveDown(){
    if (!this.beyondLowerYBounds()) {
      this.incrementYPosBy(this.speed)
    }
  }

  getYPos(){
    return this.ypos;
  }

  incrementYPosBy(delta){
    this.ypos += delta
  }

  beyondUpperYBounds(){
    return this.boundary.beyondUpperYBounds(this);
  }

  beyondLowerYBounds(){
    return this.boundary.beyondLowerYBounds(this);
  }

  contains(entity){
    return entity.xpos < this.xpos + this.width
    && entity.xpos > this.xpos
    && entity.ypos < this.ypos + this.height
    && entity.ypos > this.ypos
    // var contain = this.ownBoundary().contains(entity);
    // return contain;
  }

  ownBoundary(){
    return new Boundary([this.xpos, this.xpos + this.width], [this.ypos, this.ypos + this.height]);
  }

  possibleStates(){
    states = [];
  }

  yRegion(){
    return this.boundary.yRegionFor(this);
  }
}
