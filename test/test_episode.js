var expect = require("chai").expect;
var Episode = require('../lib/episode');

describe('Episode', function () {
  describe('updateEvents', function () {
    it('adds a new state-action-reward hash to the events of the episode', function () {
      testEpisode = new Episode()

      testEpisode.updateEvents('a', 1, 10);
      expect(testEpisode.events[0]).to.eql({ state: 'a', action: 1, reward: 10 })
    })
  })

})
