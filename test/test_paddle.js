var expect = require("chai").expect;
var Paddle = require("../lib/paddle");

describe('Paddle', function () {
  describe('beyondUpperYBounds', function () {
    it('returns true if ypos is less than the first element in yBounds', function () {
      testPaddle = new Paddle(20, -20, 20, 20, 5);
      testPaddle.setYBounds([0, 100]);

      expect(testPaddle.beyondUpperYBounds()).to.be.true
    });

    it('returns false if ypos is greater than the first element in yBounds', function () {
      testPaddle = new Paddle(20, 20, 20, 20, 5);
      testPaddle.setYBounds([0, 100]);

      expect(testPaddle.beyondUpperYBounds()).to.be.false
    });

    it('throws an error if elements in yBounds are undefined', function () {
      testPaddle = new Paddle(20, -20, 20, 20, 5);

      expect(testPaddle.beyondUpperYBounds.bind(testPaddle)).to.throw('yBounds not set')
    });
  });

  describe('beyondLowerYBounds', function () {
    it('returns true if ypos + height is greater than the second element in yBounds', function () {
      testPaddle = new Paddle(20, 100, 20, 20, 5);
      testPaddle.setYBounds([0, 100]);

      expect(testPaddle.beyondLowerYBounds()).to.be.true
    });

    it('returns false if ypos + height is less than the second element in yBounds', function () {
      testPaddle = new Paddle(20, 20, 20, 20, 5);
      testPaddle.setYBounds([0, 100]);

      expect(testPaddle.beyondLowerYBounds()).to.be.false
    });

    it('throws an error if elements in yBounds are undefined', function () {
      testPaddle = new Paddle(20, -20, 20, 20, 5);

      expect(testPaddle.beyondLowerYBounds.bind(testPaddle)).to.throw('yBounds not set')
    });
  });

  describe('moveUp', function () {
    it('decrements y coordinate by speed', function () {
      testPaddle = new Paddle(20, 20, 20, 20, 5);
      testPaddle.setYBounds([0, 30]);
      testPaddle.moveUp();

      expect(testPaddle.getYPos()).to.equal(15);
    });

    it('does not decrement y coordinate if beyond upper Y bounds', function () {
        testPaddle = new Paddle(20, -1, 20, 20, 5);
        testPaddle.setYBounds([0, 10]);
        testPaddle.moveUp();

        expect(testPaddle.getYPos()).to.equal(-1);
    })
  });

  describe('moveDown', function () {
    it('increments y coordinate by speed', function () {
      testPaddle = new Paddle(20, 20, 20, 20, 5);
      testPaddle.setYBounds([0, 40]);
      testPaddle.moveDown();

      expect(testPaddle.getYPos()).to.equal(25);
    });

    it('does not increment y coordinate if beyond lower Y bounds', function () {
        testPaddle = new Paddle(20, 17, 20, 20, 5);
        testPaddle.setYBounds([0, 20]);
        testPaddle.moveDown();

        expect(testPaddle.getYPos()).to.equal(17);
    });
  });
})
