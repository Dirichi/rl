var expect = require("chai").expect;
var StateInterpreter = require("../public/lib/q/state_interpreter");

describe('StateInterpreter', function () {
  describe('interpreteState', function () {
    it('presents its provided parameters based on strategy specified', function () {
      var stringConcatStateInterpreter = new StateInterpreter('string-concat');
      var featuresArrayStateInterpreter = new StateInterpreter('array-of-features');

      expect(stringConcatStateInterpreter.interpreteState([100, 5])).to.eql('1005');
      expect(featuresArrayStateInterpreter.interpreteState([100, 5])).to.eql([100, 5]);
    });
    it('raises an error if the provided parameters based on strategy specified', function () {
      var BadstringConcatStateInterpreter = new StateInterpreter('bad-string-concat');
      expect(BadstringConcatStateInterpreter.interpreteState.bind(BadstringConcatStateInterpreter, [100, 5])).to.throw('bad-string-concat is not an allowed strategy');
    });
  });
});
