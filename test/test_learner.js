var chai = require("chai");
var expect = chai.expect;
var sinon = require('sinon')
var Learner = require('../public/lib/q/learner');
var Q = require("../public/lib/q/q");

describe('Learner', function () {
  describe('constructor', function () {
    it('initializes the learner state', function () {
      testQ = new Q(['a'], [1]);
      sinon.stub(Learner.prototype, 'getCurrentState').returns('a')
      testLearner = new Learner(testQ, 0.2, 0.9, 0.5, {});

      expect(testLearner.getState()).to.equal('a');
      Learner.prototype.getCurrentState.restore();
    })
  });

  describe('setState', function () {
    it('sets learner state', function () {
      testQ = new Q(['a', 'b'], [1]);
      sinon.stub(Learner.prototype, 'getCurrentState').returns('a')
      testLearner = new Learner(testQ, 0.2, 0.9, 0.5, {});

      testLearner.setState('b');
      expect(testLearner.getState()).to.equal('b');
      Learner.prototype.getCurrentState.restore();
    });

    it('throws an error if the provided state is not included in the Q table', function () {
      testQ = new Q(['a'], [1]);
      sinon.stub(Learner.prototype, 'getCurrentState').returns('a');
      testLearner = new Learner(testQ, 0.2, 0.9, 0.5, {});

      expect(testLearner.setState.bind(testLearner, 'b')).to.throw('b is not an allowed state');
      Learner.prototype.getCurrentState.restore();
    });
  });

  describe('modifiedBellman', function () {
    it('returns the q value for a given state update, action, and reward', function () {
      testQ = new Q(['a', 'b'], [1, 2]);
      sinon.stub(Learner.prototype, 'getCurrentState').returns('a');
      testLearner = new Learner(testQ, 0.2, 0.9, 0.5, {});
      testQ.set('b', 1, 10);
      testQ.set('a', 2, 1);

      expect(testLearner.modifiedBellman('a', 'b', 2, 10)).to.equal(4.6)
      Learner.prototype.getCurrentState.restore();
    })
  });

  describe('selectBestAction', function () {
    it('returns argMaxQ at the current state', function () {
      testQ = new Q(['a', 'b'], [1, 2]);
      sinon.stub(Learner.prototype, 'getCurrentState').returns('a');
      testLearner = new Learner(testQ, 0.2, 0.9, 0.5, {});
      testQ.set('a', 2, 10)

      expect(testLearner.selectBestAction()).to.equal(2)
      Learner.prototype.getCurrentState.restore();
    })
  });

  describe('learn', function () {
    it('selects and has the agent perform an action', function () {
      testQ = new Q(['a', 'b'], [1, 2]);
      testQ.set('a', 2, 10);
      sinon.stub(Learner.prototype, 'getCurrentState').returns('a');
      sinon.stub(Learner.prototype, 'selectAction').returns(2);
      sinon.stub(Learner.prototype, 'getReward').returns(10);

      learnerPerformSpy = sinon.stub(Learner.prototype, 'perform')

      testLearner = new Learner(testQ, 0.2, 0.9, 0.5, {});

      testLearner.learn();

      expect(learnerPerformSpy.calledWith(2)).to.be.true;

      Learner.prototype.getCurrentState.restore();
      Learner.prototype.selectAction.restore();
      Learner.prototype.perform.restore();
      Learner.prototype.getReward.restore();
    });

    it('sets Q(currentState, currentAction) using modifiedBellman equation',function () {
      testQ = new Q(['a', 'b'], [1, 2]);
      testQ.set('b', 1, 10);
      testQ.set('a', 2, 10);

      stateSpy = sinon.stub(Learner.prototype, 'getCurrentState');
      stateSpy.onCall(0).returns('a');
      stateSpy.onCall(1).returns('b');


      sinon.stub(Learner.prototype, 'selectAction').returns(2);
      sinon.stub(Learner.prototype, 'getReward').returns(10);
      sinon.stub(Learner.prototype, 'perform');

      testLearner = new Learner(testQ, 0.2, 0.9, 0.5, {});
      modifiedBellmanSpy = sinon.spy(testLearner, 'modifiedBellman')

      testLearner.learn();

      expect(modifiedBellmanSpy.calledWithExactly('a', 'b', 2, 10)).to.be.true;
      expect(testLearner.q.get('a', 2)).to.equal(11.8);

      Learner.prototype.getCurrentState.restore();
      Learner.prototype.selectAction.restore();
      Learner.prototype.perform.restore();
      Learner.prototype.getReward.restore();
    });

    it('updates its state', function () {
      testQ = new Q(['a', 'b'], [1, 2]);
      testQ.set('b', 1, 10);
      testQ.set('a', 2, 10);

      stateSpy = sinon.stub(Learner.prototype, 'getCurrentState');
      stateSpy.onCall(0).returns('a');
      stateSpy.onCall(1).returns('b');


      sinon.stub(Learner.prototype, 'selectAction').returns(2);
      sinon.stub(Learner.prototype, 'getReward');
      sinon.stub(Learner.prototype, 'perform');
      sinon.stub(Learner.prototype, 'bellmanUpdate');

      testLearner = new Learner(testQ, 0.2, 0.9, 0.5, {});

      testLearner.learn();

      expect(testLearner.getState()).to.equal('b')

      Learner.prototype.getCurrentState.restore();
      Learner.prototype.selectAction.restore();
      Learner.prototype.perform.restore();
      Learner.prototype.bellmanUpdate.restore();
    })
  })
})
