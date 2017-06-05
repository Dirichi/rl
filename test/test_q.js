var expect = require("chai").expect;
var Q = require("../lib/q");

describe('Q', function () {
  describe('constructor', function () {
    it('creates a table for each instance of Q', function () {
      testQ = new Q(['a','b','c'],[1,2,3]);

      expect(testQ.table.body).to.eql([[0, 0, 0],[0, 0, 0],[0, 0, 0]]);
    })
  });

  describe('get', function () {
    it('returns the value at the provided state and action pair', function () {
      testQ = new Q(['a', 'b'],[1, 2]);

      expect(testQ.get('a', 2)).to.equal(0);
    });

    it('throws an error if the provided state does not exist', function () {
      testQ = new Q(['a', 'b'],[1, 2]);

      expect(testQ.get.bind(testQ, 'd', 2)).to.throw('Q instance does not have provided state d');
    });

    it('throws an error if the provided action does not exist', function () {
      testQ = new Q(['a','b'],[1, 2])

      expect(testQ.get.bind(testQ, 'a', 3)).to.throw('Q instance does not have provided action 3');
    })
  });

  describe('set', function () {
    it('sets the value at the provided state and action pair', function () {
      testQ = new Q(['a', 'b'], [1, 2])
      testQ.set('a', 1, 10);

      expect(testQ.get('a', 1)).to.equal(10);
    });

    it('throws an error if the provided state does not exist', function () {
      testQ = new Q(['a'], [1, 2])

      expect(testQ.set.bind(testQ, 'b', 1, 10)).to.throw('Q instance does not have provided state b')
    });

    it('throws an error if the provided action does not exist', function () {
      testQ = new Q(['a', 'b'], [1]);

      expect(testQ.set.bind(testQ, 'b', 2, 10)).to.throw('Q instance does not have provided action 2');
    })
  });

  describe('argMax', function () {
    it('returns the action arguments for the maxima on Q for a given state', function () {
      testQ = new Q(['a', 'b'], [1, 2]);
      testQ.set('a', 2, 1);

      expect(testQ.argMax('a')).to.equal(2);
    });

    it('throws an error if the provided state does not exist', function () {
      testQ = new Q(['a'], [1, 2]);

      expect(testQ.argMax.bind(testQ, 'b')).to.throw('Q instance does not have provided state b');
    })
  });
})
