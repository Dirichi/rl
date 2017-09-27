var has_require = typeof require !== 'undefined'

if( typeof Matrix === 'undefined' ) {
  if( has_require ) {
    Matrix = require('../q/matrix')
  }
  else throw new Error('q requires matrix');
}


class Q {
  constructor(states, actions, table = new Matrix(states.length, actions.length)) {
    this.states = states
    this.actions = actions
    this.table = table; // replace with a set table method that checks if table matches dimensions
    this.setCount = 0;
  }

  static fromHash(hash){
    var states = Object.keys(hash);

    //assumes that first state hash has all actions
    var actions = Object.keys(hash[states[0]]);
    var q = new Q(states, actions);
    var tableBody = [];

    states.forEach(function (state) {
      var valueArray = [];
      actions.forEach(function (action) {
        valueArray.push(parseInt(hash[state][action]));
      });
      tableBody.push(valueArray);
    });

    q.table.setBody(tableBody);
    return q;
  }

  learn(oldState, action, reward, newState, alpha, gamma){
    var Qsa = this.get(oldState, action)
    var bestAction = this.argMax(newState)
    var QPrimeSa = this.get(newState, bestAction)
    var newQsa = (Qsa * (1 - alpha)) + alpha * (reward + gamma * QPrimeSa)

    newQsa = Math.round(newQsa * Math.pow(10, 6)) / Math.pow(10, 6) // extract rounding into a common function

    this.set(oldState, action, newQsa)
  }

  get(state, action){
    this.preventInexistentStatesOrActions(state, action)
    return this.tableGet(state, action)
  }

  set(state, action, value){
    this.preventInexistentStatesOrActions(state, action);
    this.tableSet(state, action, value);
    this.publishTableOnIntervalExceeded();
    this.updateSetCount();
  }

  updateTablePublishCount(){
    this.tablePublishCount += 1;
  }

  updateSetCount(){
    this.setCount += 1;
  }

  publishTableOnIntervalExceeded(){
    if (this.setCount >= this.nextSetCountMark) {
      console.log('PUBLISSSSSSSSSH');
      this.publishTable();
      this.nextSetCountMark += this.setCountInterval;
    }
  }

  publishTable(){
    if (this.isPublishing) {
      var data = this.toHash();
      data.id = this.tableID();
      this.messenger.send('insert', data);
      this.updateTablePublishCount();
    };
  }

  tableID(){
    new Date().getTime() + '_' + this.tablePublishCount
  }

  startPublishing(){
    this.isPublishing = true;
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

  toHash(){
    var table = this.table.body;
    var tableHash = {};
    var that = this;
    table.forEach(function (row, index){
      var state = that.states[index];
      tableHash[state] = that.actionHashFor(row);
      }
    );
    return tableHash;
  }

  actionHashFor(row){
    var hash = {};
    var that = this;
    row.forEach(function(value, index){
      var action = that.actions[index];
      hash[action] = parseFloat(value.toFixed(2));
    })
    return hash;
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
