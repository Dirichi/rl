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
    this.bellmanUpdate(newState, action, reward);
    this.setState(newState);
    this.decayEpilson();
  }

  bellmanUpdate(newState, action, reward){
    var bellmanValue = this.modifiedBellman(this.state, newState, action, reward)
    this.q.set(this.state, action, bellmanValue)
  }

  modifiedBellman(oldState, newState, action, reward){
    var Qsa = this.q.get(oldState, action);
    var aPrime = this.argMaxQ(newState);
    var QsPrimeAPrime = this.q.get(newState, aPrime);

    return Qsa + (this.alpha * (reward + (this.gamma * QsPrimeAPrime) - Qsa))
  }

  argMaxQ(state){
    return this.q.argMax(state);
  }

  selectAction(){
    var choice = Math.random() > this.epilson ? this.selectBestAction() : this.selectRandomAction();
    return choice;
  }

  selectBestAction(){
    return this.argMaxQ(this.state);
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
