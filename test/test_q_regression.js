var expect = require("chai").expect;
var QRegression = require("../public/lib/q/q_regression");
var Matrix = require("../public/lib/q/matrix");

describe('QRegression', function () {
  describe('constructor', function () {
    it('assigns provided weights', function () {
      var testMatrix = new Matrix(3, 2, [[0,1],[2,3],[4,5]]);
      testQRegression = new QRegression(2,['left', 'right', 'up'], testMatrix);

      expect(testQRegression.weights.body).to.eql([[0,1],[2,3],[4,5]]);;
    })

    it('creates random weights if no weights are provided', function () {
      testQRegression = new QRegression(2,['left', 'right', 'up']);

      expect(testQRegression.weights.numRows).to.eql(3);
      expect(testQRegression.weights.numColumns).to.eql(2);
    })
  });

  describe('get', function () {
    it('returns a Q value for the provided feature values and actions as a linear function of weights', function () {
      testQRegression = new QRegression(2, ['up', 'down']);
      testQRegression.weights.setBody([[1, 0],[2, 1]])

      expect(testQRegression.get([0.5, 0.8], 'down')).to.eql(1.8);
    })
  });

  describe('fit', function () {
    it('updates the weights of Q', function () {
      testQRegression = new QRegression(2, ['up', 'down']);
      testQRegression.weights.setBody([[1, 0],[2, 1]])

      testQRegression.fit([0.5, 0.8], 'up', [0.3, 0.6], 3, 0.2, 0.8);
      // w1 = 1
      // w2 = 0
      // w = w + (gradient * stepSize)
      // w1 = 1 + (0.5 * 0.692)
      // w2 = 0 + (0.8 * 0.692)
      // w1 = 1.346
      // w2 = 0.554
      expect(testQRegression.weights.body).to.eql([[1.346, 0.554], [2, 1]]);
    })
  });

  describe('bellmanStepSize', function () {
    it('returns the difference between Q(s,a) and (r + y * Q(s`, a`))', function () {
      testQRegression = new QRegression(2, ['up', 'down']);
      testQRegression.weights.setBody([[1, 0],[2, 1]])

      expect(testQRegression.bellmanStepSize([0.5, 0.8], 'up', [0.3, 0.6], 3, 0.2, 0.8)).to.eql(0.692);
      // Q(s, a) = 0.5
      // Q(s`, a`) = 1.2
      // r = 3
      // y = 0.8
      // a = 0.2
      // h = a *(r + y * Q(s`, a`)) - (Q(s, a))
      // h = 0.2 * (( 3 + 0.8 * 1.2) - 0.5)
      // h = 0.692

      // 1 0   0.5 --->  0.5
      // 2 1   0.8  -->  1.8

      // 1 0  0.3  -->   0.3
      // 2 1  0.6  -->   1.2
    })
  });

  describe('argMaxValueAndActionFor', function () {
    it('returns the action arguments for the maxima on Q for a given set of features', function () {
      testQRegression = new QRegression(2, ['up', 'down']);
      testQRegression.weights.setBody([[1, 0],[2, 1]])

      expect(testQRegression.argMaxValueAndActionFor([0.5, 0.8])).to.eql([1.8, 'down']);
    });

    it('throws an error if the provided features don\'t match the dimensions of the weight', function () {
      testQRegression = new QRegression(5, ['up', 'down']);

      expect(testQRegression.argMaxValueAndActionFor.bind(testQRegression, [0.5, 0.8])).to.throw('provided features different in dimension from Q instance weights');
    })
  });
});
