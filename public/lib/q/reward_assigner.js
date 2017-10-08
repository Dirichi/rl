class RewardAssigner{
  constructor(environment){
    this.environment = environment;
  }

  assignRewards(){
    this.environment.rewardEvents().forEach((event) => {
      if (event.active) { event.target.rewards += event.reward };
    });
  };
}

module.exports = RewardAssigner;
