var expect = require("chai").expect;
var sinon = require('sinon')
var Boundary = require('../lib/boundary');

describe('Boundary', function () {
  describe('beyondUpperYBounds', function () {
    it('returns true if provided entity is rect and entity ypos < yBounds[0] ', function () {
      entity = sinon.stub().returns({ xpos: 5, ypos: -1, type: 'rect' })
      testBoundary = new Boundary([0, 20], [0, 20]);

      expect(testBoundary.beyondUpperYBounds(entity())).to.be.true;
    });
    it('returns false if provided entity is rect and entity ypos > yBounds[0] ', function () {
      entity = sinon.stub().returns({ xpos: 5, ypos: 1, type: 'rect' })
      testBoundary = new Boundary([0, 20], [0, 20]);

      expect(testBoundary.beyondUpperYBounds(entity())).to.be.false;
    });
    it('returns true if provided entity is circle and entity ypos + radius >  ', function () {
      entity = sinon.stub().returns({ xpos: 5, ypos: -1, type: 'circle' })
      testBoundary = new Boundary([0, 20], [0, 20]);

      expect(testBoundary.beyondUpperYBounds(entity())).to.be.true;
    });
    it('returns false if provided entity is circle and entity ypos > yBounds[0] ', function () {
      entity = sinon.stub().returns({ xpos: 5, ypos: 1, type: 'circle' })
      testBoundary = new Boundary([0, 20], [0, 20]);

      expect(testBoundary.beyondUpperYBounds(entity())).to.be.false;
    });
  })
})
