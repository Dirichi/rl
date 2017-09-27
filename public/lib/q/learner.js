class Learner {
  constructor(q, alpha, gamma, epilson, agent) {
    this.q = q;
    this.alpha = alpha; //learning rate
    this.gamma = gamma; //rate of decay of discounted rewards
    this.epilson = epilson //exploration rate
    this.agent = agent;
    this.episodes = [];
    this.setState(this.getCurrentState());
  }

  learn(){
    var action = this.selectAction();
    this.perform(action);
    var newState = this.getCurrentState();
    var reward = this.getReward();
    this.q.learn(this.state, action, reward, newState, this.alpha, this.gamma);
    this.setState(newState);
    this.decayEpilson();
  }

  regressLearn(){
    var action = this.regressSelectAction();
    this.perform(action);
    var reward = this.getReward();
    var newState = this.getCurrentFeatures();
    this.q.fit(this.state, action, newState, reward, this.alpha, this.gamma);
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


  getCurrentState(){
    return this.agent.getState()
  }

  getReward(){
    return this.agent.getReward();
  }

  decayEpilson(){
    this.epilson *= 0.99999999

  }

  storeBellmanUpdate(state, action, reward){
    var data = {
      state: state,
      action: action,
      reward: reward
    }

  }

  dbInsert(data){

  }

}

if( typeof exports !== 'undefined' ) {
  if( typeof module !== 'undefined' && module.exports ) {
    exports = module.exports = Learner
  }
  exports.Learner = Learner
}
else {
  this.Learner = Learner
}
