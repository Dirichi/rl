class Learner {
  constructor(q, alpha, gamma, epilson, agent) {
    this.q = q;
    this.alpha = alpha; //learning rate
    this.gamma = gamma; //rate of decay of discounted rewards
    this.epilson = epilson //exploration rate
    this.agent = agent;
    this.episodes = [];
    this.setState(this.getCurrentState());
    this.setLearningParameters();
    // this.setFeatures(this.getCurrentFeatures());
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

  regressLearn(){
    var action = this.regressSelectAction();
    this.perform(action);
    var reward = this.getReward();
    var newState = this.getCurrentFeatures();
    this.q.learn(this.state, action, reward, newState);
    this.setFeatures(newState);
    this.decayEpilson();
  }

  argMaxQ(state){
    return this.q.argMax(state);
  }

  selectAction(){
    var choice = Math.random() > this.epilson ? this.selectBestAction() : this.selectRandomAction();
    return choice;
  }

  regressSelectAction(){
    var choice = Math.random() > this.epilson ? this.regressSelectBestAction() : this.selectRandomAction();
    return choice;
  }

  selectBestAction(){
    return this.argMaxQ(this.state);
  }

  regressSelectBestAction(){
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
    if (!this.q.hasState(newState)) {
      throw new Error(newState + ' is not an allowed state');
    }
    this.state = newState;
  }

  setFeatures(newFeatures){
    this.state = newFeatures
  }

  getCurrentState(){
    return this.agent.getState()
  }

  getCurrentFeatures(){
    return this.agent.getFeatures();
  }

  getReward(){
    return this.agent.getReward();
  }

  decayEpilson(){
    this.epilson *= 0.9999
  }

  learningMethods(){

  }

}

module.exports = Learner
