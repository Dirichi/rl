var expect = require("chai").expect;
var Ball = require("../lib/ball");

describe('Ball', function () {
  describe('beyondUpperYBounds', function () {

  });

  describe('beyondLowerYBounds', function () {

  })

  describe('beyondLeftMostXBounds', function () {

  });

  describe('beyondRightMostXBounds', function () {

  })
  describe('move', function () {
    it('increments xpos and ypos by product of respective direction and speed', function () {
      testBall = new Ball(25, 20, 5, [0,100], [0, 100], 5);
      testBall.setXDirection(-1);
      testBall.setYDirection(-1);
      testBall.setSpeed(5)
      testBall.move();

      expect(testBall.getXPos()).to.equal(20)
      expect(testBall.getYPos()).to.equal(15)
    });

    it('inverts the xDirection when it collides with a paddle', function () {
      testBall = new Ball(25, 20, 5, [0,100], [0, 100], 5);
    });

    it('inverts the xDirection when it collides with the leftMost xBounds', function () {
      testBall = new Ball(25, 20, 5, [0,100], [0, 100], 5);
    });

    it('inverts the xDirection when it collides with the rightMost xBounds', function () {
      testBall = new Ball(25, 20, 5, [0,100], [0, 100], 5);
    });
  })
})
