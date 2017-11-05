var expect = require("chai").expect;
var Q = require("../public/lib/q/q");
var Matrix = require("../public/lib/q/matrix");
var StateInterpreter = require("../public/lib/q/state_interpreter");

describe('Q', function () {
  describe('constructor', function () {
    it('creates a table for each instance of Q', function () {
      testMatrix = new Matrix(2, 2, [[1,1],[1,1]]);
      initValues = { states: ['a', 'b'], actions: [1, 2, 3],  table: testMatrix }
      testQ = new Q(initValues);

      expect(testQ.table.body).to.eql([[1,1],[1,1]]);
    })

    it('creates a random table if no table is provided', function () {
      initValues = { states: ['a', 'b'], actions: [1, 2, 3] }
      testQ = new Q(initValues);

      expect(testQ.table.numRows).to.eql(2);
      expect(testQ.table.numColumns).to.eql(3);
    })
  });

  describe('setLearningParameters', function () {
    it('sets alpha, gamma and epilson', function () {
      initValues = { states: ['a', 'b'], actions: [1, 2] }
      testQ = new Q(initValues);

      testQ.setLearningParameters(0.2, 0.8, 0.9);
      expect(testQ.alpha).to.eql(0.2)
      expect(testQ.gamma).to.eql(0.8)
      expect(testQ.epilson).to.eql(0.9)
    });
  });

  describe('learn', function () {
    it('returns the value at the provided state and action pair', function () {
      testMatrix = new Matrix(2, 2, [[1,3],[1,3]]);
      initValues = { states: ['a', 'b'], actions: [1, 2], table: testMatrix }

      testQ = new Q(initValues);
      testQ.setLearningParameters(0.2, 0.8, 0.9);

      testQ.learn('a', 1, 5, 'b')

      //Q(s,a) = (Q(s,a) * (1 - alpha)) + (alpha * [r + gamma * Qprime(s,a)])
      // = (1 * (1 - 0.2)) + (0.2 * (5 + (0.8 * 3)))
      expect(testQ.table.roundedBody(4)).to.eql([[2.28, 3],[1,3]])
    });
  });

  describe('get', function () {
    it('returns the value at the provided state and action pair', function () {
      initValues = { states: ['a', 'b'], actions: [1, 2] }
      testQ = new Q(initValues);

      expect(testQ.get('a', 2)).to.equal(testQ.table.body[0][1]);
    });

    it('throws an error if the provided state does not exist', function () {
      initValues = { states: ['a', 'b'], actions: [1, 2] };
      testQ = new Q(initValues);

      expect(testQ.get.bind(testQ, 'd', 2)).to.throw('Q instance does not have provided state d');
    });

    it('throws an error if the provided action does not exist', function () {
      initValues = { states: ['a', 'b'], actions: [1, 2] };
      testQ = new Q(initValues)

      expect(testQ.get.bind(testQ, 'a', 3)).to.throw('Q instance does not have provided action 3');
    })
  });

  describe('set', function () {
    it('sets the value at the provided state and action pair', function () {
      initValues = { states: ['a', 'b'], actions: [1, 2] };
      testQ = new Q(initValues);
      testQ.set('a', 1, 10);

      expect(testQ.get('a', 1)).to.equal(10);
    });

    it('throws an error if the provided state does not exist', function () {
      initValues = { states: ['a'], actions: [1, 2] };
      testQ = new Q(initValues)

      expect(testQ.set.bind(testQ, 'b', 1, 10)).to.throw('Q instance does not have provided state b')
    });

    it('throws an error if the provided action does not exist', function () {
      initValues = { states: ['a', 'b'], actions: [1] };
      testQ = new Q(initValues);

      expect(testQ.set.bind(testQ, 'b', 2, 10)).to.throw('Q instance does not have provided action 2');
    })
  });

  describe('bestAction', function () {
    it('returns the action arguments for the maxima on Q for a given state', function () {
      initValues = { states: ['a', 'b'], actions: [1, 2] }
      testQ = new Q(initValues);
      testQ.set('a', 2, 1);

      expect(testQ.bestAction('a')).to.equal(2);
    });

    it('throws an error if the provided state does not exist', function () {
      initValues = { states: ['a'], actions: [1, 2] }
      testQ = new Q(initValues);

      expect(testQ.bestAction.bind(testQ, 'b')).to.throw('Q instance does not have provided state b');
    })
  });

  describe('toHash', function () {
    it('returns its table as a hash', function () {
      initValues = { states: ['a', 'b'], actions: [1, 2] }
      testQ = new Q(initValues);
      testQ.table.setBody([[5,7],[6,3]]);
      expect(testQ.toHash()).to.eql({ a: { 1: 5, 2: 7 }, b: { 1: 6, 2: 3 } })
    })
  });

  describe('fromHash', function () {
    it('returns a Q instance with a table corresponding to the provided hash', function () {
      testQ = Q.fromHash({ a: { 1: 5.00, 2: 7.00 }, b: { 1: 6.00, 2: 3.00 } });

      expect(testQ.states).to.eql(['a', 'b'])
      expect(testQ.actions).to.eql(['1', '2']);
      expect(testQ.table.body).to.eql([[5,7],[6,3]]);

    })
  });

  describe('getCurrentState', function () {
    it('returns the state of the environment', function () {
      environment = { observables: function () { return [10, 5] } };
      initValues = { states: ['a', 'b'], actions: [1, 2] }
      testQ = new Q(initValues);
      testQ.setEnvironment(environment);

      expect(testQ.getCurrentState()).to.eql('105');
    })
  });
})
