class Learner {
  constructor(q, alpha, gamma, epilson, agent) {
    this.q = q;
    this.alpha = alpha; //learning rate
    this.gamma = gamma; //rate of decay of discounted rewards
    this.epilson = epilson //exploration rate
    this.agent = agent;
    this.episodes = [];
    this.rewards = 0;
    this.setState(this.getCurrentState());
    this.setLearningParameters();
  }

  learn(){
    var action = this.selectAction();
    this.perform(action);
    var newState = this.getCurrentState();
    var reward = this.getReward();
    this.q.learn(this.state, action, reward, newState);
    this.setState(newState);
    this.decayEpilson();
  }

  setLearningParameters(){
    this.q.setLearningParameters(this.alpha, this.gamma, this.epilson);
  }

  selectAction(){
    var choice = Math.random() > this.epilson ? this.selectBestAction() : this.selectRandomAction();
    return choice;
  };

  selectBestAction(){
    return this.q.bestAction(this.state);
  }

  selectRandomAction(){
    return this.q.randomAction();
  }

  getState(){
    return this.state
  }

  perform(action){
    this.agent.perform(action);
  }

  setState(newState){
    this.state = newState;
  }

  getCurrentState(){
    return this.q.getCurrentState();
  }

  getReward(){
    var currentReward = this.rewards;
    this.rewards = 0;
    return currentReward;
  }

  decayEpilson(){
    this.epilson *= 0.9999
  }
}

module.exports = Learner
