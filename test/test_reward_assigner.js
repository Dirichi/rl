var expect = require("chai").expect;
var RewardAssigner = require("../public/lib/q/reward_assigner");

describe('RewardAssigner', function () {
  describe('assignRewards', function () {
    it('assigns rewards to the right targets', function () {
      targetA = { status: 'good', health: 'low', rewards: 0 }
      targetB = { status: 'good', health: 'high', rewards: 0 }

      goodStatus = (target) => target.status == 'good'
      goodHealth = (target) => target.health == 'high'

      rewardEvents = [
        {
          target: targetA,
          active: goodStatus(targetA),
          reward: 2
        },
        {
          target: targetA,
          active: goodHealth(targetA),
          reward: 5
        },
        {
          target: targetB,
          active: goodStatus(targetB),
          reward: 3
        },
        {
          target: targetB,
          active: goodHealth(targetB),
          reward: 3
        }
      ]

      environment = { rewardEvents: () => rewardEvents };

      rewardAssigner = new RewardAssigner(environment);
      rewardAssigner.assignRewards();

      expect(targetA.rewards).to.eql(2);
      expect(targetB.rewards).to.eql(6);
    })
  });
});
