class Boundary {
  constructor(xBounds, yBounds) {
    this.xBounds = xBounds;
    this.yBounds = yBounds;
    this.granularity = 20;
  }

  setYBounds(yBounds){
    this.yBounds = yBounds;
  }

  setXBounds(xBounds){
    this.xBounds = xBounds;
  }

  beyondUpperYBounds(entity){
    this.checkIfUpperYBoundsSet();
    if (entity.type == 'rect') {
      return entity.ypos < this.yBounds[0];
    }
    if (entity.type == 'circle') {
      return entity.ypos - entity.radius < this.yBounds[0];
    }
  }

  beyondXBounds(entity){
    return this.beyondRightMostXBounds(entity) || this.beyondLeftMostXBounds(entity);
  }

  beyondYBounds(entity){
    return this.beyondUpperYBounds(entity) || this.beyondLowerYBounds(entity)
  }

  beyondLowerYBounds(entity){
    this.checkIfLowerYBoundsSet();
    if (entity.type == 'rect') {
      return entity.ypos + entity.height > this.yBounds[1];
    }
    if (entity.type == 'circle') {
      return entity.ypos + entity.radius > this.yBounds[1];
    }
  }

  beyondLeftMostXBounds(entity){
    this.checkIfLeftMostXBoundsSet();
    if (entity.type == 'circle') {
      return entity.xpos - entity.radius < this.xBounds[0];
    }

    //do rect later
  }

  beyondRightMostXBounds(entity){
    this.checkIfRightMostXBoundsSet();
    if (entity.type == 'circle') {
      return entity.xpos + entity.radius > this.xBounds[1];
    }

    //do rect later

  }

  checkIfUpperYBoundsSet(){
    if (this.yBounds[0] == undefined) {
      throw new Error('yBounds not set');
    }
  }

  checkIfLowerYBoundsSet(){
    if (this.yBounds[1] == undefined) {
      throw new Error('yBounds not set');
    }
  }

  checkIfLeftMostXBoundsSet(){
    if (this.xBounds[0] == undefined) {
      throw new Error('xBounds not set');
    }
  }

  checkIfRightMostXBoundsSet(){
    if (this.xBounds[1] == undefined) {
      throw new Error('xBounds not set');
    }
  }

  contains(entity){
    return !this.beyondYBounds(entity) && !this.beyondXBounds(entity)
  }

  setGranularity(granularity){
    this.granularity = granularity;
  }

  yRegionFor(entity){
    var yGranularity = (this.yBounds[1] - this.xBounds[0])/this.granularity;
    var regionIndex = (entity.ypos - this.yBounds[0]) / yGranularity;
    return Math.abs(Math.round(regionIndex));
  }

}

if( typeof exports !== 'undefined' ) {
  if( typeof module !== 'undefined' && module.exports ) {
    exports = module.exports = Boundary
  }
  exports.Boundary = Boundary
}
else {
  this.Boundary = Boundary
}
