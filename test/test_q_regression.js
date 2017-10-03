var expect = require("chai").expect;
var QRegression = require("../public/lib/q/q_regression");
var Matrix = require("../public/lib/q/matrix");
var sinon = require('sinon');
var StateInterpreter = require("../public/lib/q/state_interpreter");

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
    });
  });

  describe('get', function () {
    it('returns a Q value for the provided feature values and actions as a linear function of weights', function () {
      testQRegression = new QRegression(2, ['up', 'down']);
      testQRegression.weights.setBody([[1, 0],[2, 1]])

      expect(testQRegression.get([0.5, 0.8], 'down')).to.eql(1.8);
    })
  });

  describe('setLearningParameters', function () {
    it('sets alpha, gamma and epilson', function () {
      testQRegression = new QRegression(2,[1, 2]);

      testQRegression.setLearningParameters(0.2, 0.8, 0.9);
      expect(testQRegression.alpha).to.eql(0.2)
      expect(testQRegression.gamma).to.eql(0.8)
      expect(testQRegression.epilson).to.eql(0.9)
    });
  });

  describe('learn', function () {
    it('updates the weights of Q', function () {
      testQRegression = new QRegression(2, ['up', 'down']);
      testQRegression.weights.setBody([[1, 0],[2, 1]])
      testQRegression.setLearningParameters(0.2, 0.8, 0.9);

      testQRegression.learn([0.5, 0.8], 'up', 3, [0.3, 0.6]);
      // w1 = 1
      // w2 = 0
      // w = w + (gradient * stepSize)
      // w1 = 1 + (0.5 * 0.692)
      // w2 = 0 + (0.8 * 0.692)
      // w1 = 1.346
      // w2 = 0.5536
      expect(testQRegression.weights.roundedBody(4)).to.eql([[1.346, 0.5536], [2, 1]]);
    });

    it('does not update weights if the size of the experience buffer < batchSize', function () {
      testQRegression = new QRegression(2, ['up', 'down']);
      testQRegression.weights.setBody([[1, 0],[2, 1]])
      testQRegression.setLearningParameters(0.2, 0.8, 0.9);
      testQRegression.setBatchSize(2);

      testQRegression.learn([0.5, 0.8], 'up', 3, [0.3, 0.6]);
      expect(testQRegression.weights.roundedBody(4)).to.eql([[1, 0], [2, 1]]);
    });

    it('correctly handles weight updates for batchsizes greater than 1', function () {
      testQRegression = new QRegression(2, ['up', 'down']);
      testQRegression.weights.setBody([[1, 0],[2, 1]])
      testQRegression.setLearningParameters(0.2, 0.8, 0.9);
      testQRegression.setBatchSize(2);

      var randomSampleStub = sinon.stub(QRegression.prototype, 'sampleFromExperience');

      var pastExperience = {
        features: [0.5, 0.6],
        action: 'down',
        rewards: 4,
        nextFeatures: [0.5, 0.8]
      }

      var currentExperience = {
        features: [0.5, 0.8],
        rewards: 3,
        action: 'up',
        nextFeatures: [0.3, 0.6]
      }

      randomSampleStub.onCall(0).returns(pastExperience);
      randomSampleStub.onCall(1).returns(currentExperience);


      testQRegression.experience.push(pastExperience)
      testQRegression.learn([0.5, 0.8], 'up', 3, [0.3, 0.6]);

      // for pastExperience

      // weights = [2, 1]
      // stepSize = (r + gamma * Q(sprime, aprime)) - Q(s,a)
      // Q(s, a) = [2, 1] * [0.5, 0.6] = 1.6
      // Q(sprime) => 1 0   0.5 -->  0.5
      //              2 1   0.8 -->  1.8
      // Q(sprime, aprime) = 1.8
      // r = 4
      // stepSize = (4 + 0.8 * 1.8) - (1.6) = 3.84
      // h = alpha * stepsize = 0.2 * 3.84 = 0.768

      //w0 = 2
      //w1 = 1
      //w = w + (gradient * stepSize)
      //w0 = 2 + (0.5 * 0.768) = 2.384
      //w1 = 1 + (0.6 * 0.768) = 1.4608
      //wpast = [1,0],[2.384, 1.4608]

      //for nextExperience
      //wnext = [1.346, 0.5536],[2,1]

      //group by action
      // up -> [1.346, 0.5536]
      // down -> [2.384, 1.4608]

      //wavg = [1.346, 0.5536], [2.384, 1.4608]

      expect(testQRegression.weights.roundedBody(4)).to.eql([[1.346, 0.5536], [2.384, 1.4608]]);
      QRegression.prototype.sampleFromExperience.restore();
    });
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

  describe('getCurrentState', function () {
    it('returns the state of the environment', function () {
      environment = { observables: function () { return [10] } }
      testQRegression = new QRegression(5, [1, 2]);
      testQRegression.setEnvironment(environment);

      expect(testQRegression.getCurrentState()).to.eql([10]);
    })
  });
});
