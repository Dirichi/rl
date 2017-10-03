var expect = require("chai").expect;
var StateObserver = require("../public/lib/q/state_observer");

describe('StateObserver', function () {
  describe('getCurrentState', function () {
    it('presents its observed parameters based on type specified', function () {
      stringConcatStateObserver = new StateObserver([100, 5], 'string-concat');
      featuresArrayStateObserver = new StateObserver([100, 5], 'array-of-features');

      expect(stringConcatStateObserver.getCurrentState()).to.eql('1005');
      expect(featuresArrayStateObserver.getCurrentState()).to.eql([100, 5]);
    });
    it('raises an error if the provided state is not allowed', function () {
      BadstringConcatStateObserver = new StateObserver([100, 5], 'bad-string-concat');
      expect(BadstringConcatStateObserver.getCurrentState.bind(BadstringConcatStateObserver, [100, 5], 'bad-string-concat')).to.throw('bad-string-concat is not an allowed strategy');
    });
  });
});
