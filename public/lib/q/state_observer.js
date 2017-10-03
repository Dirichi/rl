class StateObserver {
  constructor(observables = [], strategy){
    this.observables = observables;
    this.setStrategy(strategy);
  }

  static allowedStrategies(){
    return ['string-concat', 'array-of-features'];
  };

  setStrategy(strategy){
    this.strategy = strategy
  }

  checkStrategyIsAllowed(strategy){
    if (this.strategyNotAllowed(strategy)) {
      throw new Error(strategy + ' is not an allowed strategy');
    };
  };

  strategyNotAllowed(strategy){
    return StateObserver.allowedStrategies().indexOf(strategy) == -1
  };

  getCurrentState(){
    this.checkStrategyIsAllowed(this.strategy);
    if (this.strategy == 'string-concat') {
      return this.observables.reduce((accumulator, observable) => accumulator + observable, '');
    }
    else if (this.strategy == 'array-of-features') {
      return this.observables;
    }
  }
}

module.exports = StateObserver;
