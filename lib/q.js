var has_require = typeof require !== 'undefined'

if( typeof Matrix === 'undefined' ) {
  if( has_require ) {
    Matrix = require('../lib/matrix')
  }
  else throw new Error('q requires matrix');
}


class Q {
  constructor(states, actions) {
    this.states = states
    this.actions = actions
    this.table = new Matrix(this.states.length, this.actions.length);
  }

  get(state, action){
    this.preventInexistentStatesOrActions(state, action)
    return this.tableGet(state, action)
  }

  set(state, action, value){
    this.preventInexistentStatesOrActions(state, action);
    this.tableSet(state, action, value);
  }

  tableGet(state, action){
    return this.table.get(this.stateIndex(state), this.actionIndex(action))
  }

  tableSet(state, action, value){
    this.table.set(this.stateIndex(state), this.actionIndex(action), value)
  }

  stateIndex(state){
    return this.states.indexOf(state);
  }

  actionIndex(action){
    return this.actions.indexOf(action);
  }

  hasState(state){
    return this.stateIndex(state) != -1
  }

  hasAction(action){
    return this.actionIndex(action) != -1
  }

  preventInexistentStatesOrActions(state, action){
    this.preventInexistentState(state);
    this.preventInexistentAction(action)

  };

  preventInexistentState(state){
    if (!this.hasState(state)) {
      throw new Error('Q instance does not have provided state '+ state)
    }
  }

  preventInexistentAction(action){
    if (!this.hasAction(action)) {
      throw new Error('Q instance does not have provided action '+ action)
    }
  }

  argMax(state){
    var maxAction = this.actions[0];
    var that = this;
    this.actions.forEach(function (action) {
      if (that.get(state, maxAction) < that.get(state, action)) {
        maxAction = action;
      };
    });

    return maxAction;
  }

  randomAction(){
    var actionIndex = Math.random() * this.actions.length
    actionIndex = Math.floor(actionIndex);

    return this.actions[actionIndex];
  }
}

if( typeof exports !== 'undefined' ) {
  if( typeof module !== 'undefined' && module.exports ) {
    exports = module.exports = Q;
  }
  exports.Q = Q;
}
else {
  this.Q = Q;
}
