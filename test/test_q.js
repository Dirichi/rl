var expect = require("chai").expect;
var Q = require("../public/lib/q/q");

describe('Q', function () {
  describe('constructor', function () {
    it('creates a table for each instance of Q', function () {
      testQ = new Q(['a','b'],[1,2,3]);

      expect(testQ.table.numRows).to.eql(2);
      expect(testQ.table.numColumns).to.eql(3);
    })
  });

  describe('get', function () {
    it('returns the value at the provided state and action pair', function () {
      testQ = new Q(['a', 'b'],[1, 2]);

      expect(testQ.get('a', 2)).to.equal(testQ.table.body[0][1]);
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

  describe('toHash', function () {
    it('returns its table as a hash', function () {
      testQ = new Q(['a', 'b'], [1,2]);
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
  })
})
