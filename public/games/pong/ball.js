class Ball {
  constructor(xpos, ypos, radius, speed) {
    this.xpos = xpos;
    this.ypos = ypos;
    this.radius = radius;
    this.boundary;
    this.type = 'circle';
    this.speed = speed;
    this.xDirection = 1;
    this.yDirection = 1;
    this.collidables = []
  }

  animate(){
    push();
    ellipse(this.xpos, this.ypos, this.radius, this.radius);
    this.move();
    pop();
  }

  move(){
    this.incrementXPosBy(this.xDirection * this.speed);
    this.incrementYPosBy(this.yDirection * this.speed);
    this.reverseYDirectionOnCollisionWithYBounds();
    this.reverseXDirectionOnCollisionWithCollidables();

  }

  reverseYDirectionOnCollisionWithYBounds(){
    if (this.beyondYBounds()) {
      this.reverseYDirection();
    }
  }

  onBeyondXBounds(){

  }

  setPosition(xpos, ypos){
    this.xpos = xpos;
    this.ypos = ypos;
  }

  reverseXDirectionOnCollisionWithCollidables(){
    var that = this;
    this.collidables.forEach(function (collidable) {
      that.reverseXDirectionOnCollisionWith(collidable);
    });
  }

  reverseXDirectionOnCollisionWith(entity){
    if (entity.contains(this)) {
      this.reverseXDirection();
    }
  }

  addToCollidables(collidable){
    this.collidables.push(collidable);
  }

  distanceTo(xpos, ypos){
    return dist(this.xpos, this.ypos, xpos, ypos)
  }
  reverseXDirection(){
    this.xDirection *= -1
  }

  reverseYDirection(){
    this.yDirection *= -1
  }

  restart(){

  }

  incrementYPosBy(delta){
    this.ypos += delta
  }

  incrementXPosBy(delta){
    this.xpos += delta
  }

  getXPos(){
    return this.xpos;
  }

  getYPos(){
    return this.ypos;
  }

  setBoundary(boundary){
    this.boundary = boundary
  }

  setSpeed(speed){
    this.speed = speed;
  }

  setXDirection(xDirection){
    this.xDirection = xDirection;
  }

  setYDirection(yDirection){
    this.yDirection = yDirection;
  }

  beyondYBounds(){
    return this.beyondUpperYBounds() || this.beyondLowerYBounds();
  }

  beyondXBounds(){
    return this.beyondLeftMostXBounds() || this.beyondRightMostXBounds();
  }

  beyondUpperYBounds(){
    return this.boundary.beyondUpperYBounds(this);
  }

  beyondLowerYBounds(){
    return this.boundary.beyondLowerYBounds(this);
  }

  beyondLeftMostXBounds(){
    return this.boundary.beyondLeftMostXBounds(this);
  }

  beyondRightMostXBounds(){
    return this.boundary.beyondRightMostXBounds(this);
  }

  yRegion(){
    return this.boundary.yRegionFor(this);
  }
}


if( typeof exports !== 'undefined' ) {
  if( typeof module !== 'undefined' && module.exports ) {
    exports = module.exports = Ball;
  }
  exports.Ball = Ball;
}
else {
  this.Ball = Ball;
}
