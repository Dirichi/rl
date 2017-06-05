class Episode {
  constructor() {
    this.events = [];
  }

  updateEvents(state, action, reward){
    var newEvent = { state: state, action: action, reward: reward }
    this.events.push(newEvent);
  }
}

module.exports = Episode
