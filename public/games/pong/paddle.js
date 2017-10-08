class Paddle {
  constructor(xpos, ypos, width, height, speed) {
    this.xpos = xpos;
    this.ypos = ypos;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.actions = ['up', 'down'];
    this.boundary;
    this.type = 'rect';
  }

  animate(){
    push();
    rect(this.xpos, this.ypos, this.width, this.height);
    pop();
  }

  track(entity){
    if (this.ypos + this.height/2 < entity.ypos) {
      this.moveDown();
    }
    else{
      this.moveUp();
    }
  }

  setBoundary(boundary){
    this.boundary = boundary;
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
    return entity.xpos <= this.xpos + this.width
    && entity.xpos >= this.xpos
    && entity.ypos <= this.ypos + this.height
    && entity.ypos >= this.ypos
  }

  ownBoundary(){
    return new Boundary([this.xpos, this.xpos + this.width], [this.ypos, this.ypos + this.height]);
  }

  yRegion(){
    return this.boundary.yRegionFor(this);
  }
}
