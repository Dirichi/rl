class StateInterpreter {
  constructor(strategy){
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
    return StateInterpreter.allowedStrategies().indexOf(strategy) == -1
  };

  interpreteState(observables){
    this.checkStrategyIsAllowed(this.strategy);
    if (this.strategy == 'string-concat') {
      return observables.reduce((accumulator, observable) => accumulator + observable, '');
    }
    else if (this.strategy == 'array-of-features') {
      return observables;
    }
  }
}

module.exports = StateInterpreter;
