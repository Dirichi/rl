(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
class Learner {
  constructor(q, alpha, gamma, epilson, agent) {
    this.q = q;
    this.alpha = alpha; //learning rate
    this.gamma = gamma; //rate of decay of discounted rewards
    this.epilson = epilson //exploration rate
    this.agent = agent;
    this.episodes = [];
    // this.setState(this.getCurrentState());
    this.setLearningParameters();
    this.setFeatures(this.getCurrentFeatures());
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

},{}],2:[function(require,module,exports){
class Matrix{
  constructor(numRows, numColumns, body = Matrix.random(numRows, numColumns)){
    this.numRows = numRows;
    this.numColumns = numColumns;
    this.body = [];
    this.setBody(body);
  };

  static zeroes(numRows, numColumns){
    var array = []
    for (var i = 0; i < numRows; i++) {
      array.push(Array(numColumns).fill(0));
    }
    return array;
  };

  static random(numRows, numColumns){
    var array = []
    for (var i = 0; i < numRows; i++) {
      var rowArr = [];
      for (var j = 0; j< numColumns; j++) {
        rowArr.push(Math.random());
      }
      array.push(rowArr);
    }
    return array;
  };

  static product(matrix, otherMatrix){
    Matrix.checkCompatibilityForProduct(matrix, otherMatrix);
    var productDimension = [matrix.numRows, otherMatrix.numColumns]

    var product = new Matrix(productDimension[0], productDimension[1]);

    for (var i = 0; i < productDimension[0]; i++) {
      for (var j = 0; j < productDimension[1]; j++) {
        var row = matrix.row(i);
        var column = otherMatrix.column(j)
        product.set(i, j, Matrix.dotProduct(row, column))
      }
    }

    return product;
  }

  static dotProduct(array1, array2){
    Matrix.checkCompatibilityForDotProduct(array1, array2)
    var sum = 0
    for (var i = 0; i < array1.length; i++) {
      sum += array1[i] * array2[i]
    }

    return sum;
  }


  static checkCompatibilityForProduct(matrix, otherMatrix){
    var compatible = matrix.numColumns == otherMatrix.numRows
    if (!compatible) {
      throw new Error('Matrices not compatible for multiplication')
    }
  }

  static checkCompatibilityForDotProduct(array1, array2){
    var compatible = array1.length == array2.length
    if (!compatible) {
      throw new Error('arrays not compatible for dotProduct')
    }
  }

  scalarProduct(scalar) {
    var resultArray = [];
    this.body.forEach(function (row) {
      var newRow = row.map((val) => val * scalar)
      resultArray.push(newRow);
    });
    return new Matrix(this.numRows, this.numColumns, resultArray);
  }

  dimensions(){
    return [this.numRows, this.numColumns]
  }

  roundedBody(val){ //perhaps this method should be given to arrays
    var result = []
    this.body.forEach(function (row) {
      var rowArray = [];
      row.forEach((e) => rowArray.push(Math.round(e * Math.pow(10, val)) / Math.pow(10, val)));
      result.push(rowArray)
    });
    return result;
  }

  toString(){
    var string = '';
    this.body.forEach(function (row) {
      string += row.map((e) => e.toFixed(4)).join(' , ');
      string += '\n'
    });
    return string;
  }

  row(index){
    //should raise error if out of range
    this.checkOutOfRowRange(index)
    return this.body[index]
  }

  checkOutOfRowRange(index){
    var outOfRange = this.numRows <= index
    if (outOfRange) {
      throw new Error('index is out of row range')
    }
  }

  column(index){
    this.checkOutOfColumnRange()
    var arr = [];
    this.body.forEach(function (row) {
      arr.push(row[index])
    });
    return arr;
  }

  checkOutOfColumnRange(index){
    var outOfRange = this.numColumns <= index
    if (outOfRange) {
      throw new Error('index is out of column range')
    }
  }

  setBody(newBody){
    if (!Array.isArray(newBody)) {
      throw new Error(newBody + ' is not an array');
    }
    if (newBody.length != this.numRows || newBody[0].length != this.numColumns) {
      throw new Error('provided array has different dimensions from matrix');
    }
    this.body = newBody
  };

  get(rowIndex, columnIndex){
    this.preventOutOfRange(rowIndex, columnIndex)
    return this.body[rowIndex][columnIndex];
  }

  set(rowIndex, columnIndex, value){
    this.preventOutOfRange(rowIndex, columnIndex)
    this.body[rowIndex][columnIndex] = value
  };

  setRow(rowIndex, value){
    // need to do some checking here
    this.body[rowIndex] = value;
  };

  preventOutOfRange(rowIndex, columnIndex){
    if (this.indexOutOfRange(rowIndex, columnIndex)) {
      throw new Error('provided index is out of range of matrix dimensions');
    }
  }

  indexOutOfRange(rowIndex, columnIndex){
    return rowIndex >= this.numRows || columnIndex >= this.numColumns
  }

  sum(){
    var arr = this.body
    var nestedSum = 0;
    for (var i = 0; i < arr.length; i++) {
      for (var j = 0; j < arr[i].length; j++) {
        nestedSum += arr[i][j]
      }
    }
    return nestedSum;
  }
}

module.exports = Matrix

},{}],3:[function(require,module,exports){
Matrix = require('../q/matrix')

class Q {
  constructor(states, actions, table = new Matrix(states.length, actions.length)) {
    this.states = states
    this.actions = actions
    this.table = table; // replace with a set table method that checks if table matches dimensions
    this.alpha;
    this.gamma;
    this.epilson;
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

  learn(oldState, action, reward, newState){
    var Qsa = this.get(oldState, action)
    var bestAction = this.argMax(newState)
    var QPrimeSa = this.get(newState, bestAction)
    var newQsa = (Qsa * (1 - this.alpha)) + this.alpha * (reward + this.gamma * QPrimeSa)

    this.set(oldState, action, newQsa)
  }

  setLearningParameters(alpha, gamma, epilson){
    this.alpha = alpha;
    this.gamma = gamma;
    this.epilson = epilson;
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

module.exports = Q

},{"../q/matrix":2}],4:[function(require,module,exports){
Matrix = require('../q/matrix')

class QRegression {
  constructor(numFeatures, actions, weights = new Matrix(actions.length, numFeatures)) {
    this.numFeatures = numFeatures
    this.actions = actions;
    this.weights = weights; // add a set weights method
    this.experience = [];
    this.experienceSize = 100;
    this.batchSize = 10;
  }

  setLearningParameters(alpha, gamma, epilson){
    this.alpha = alpha;
    this.gamma = gamma;
    this.epilson = epilson;
  }

  setBatchSize(size){
    this.batchSize = size;
  }

  get(features, action){
    this.preventInexistentAction(action)
    var values = this.getValuesForAllActions(features)
    var actionIndex = this.actionIndex(action)

    return values[actionIndex]
  }

  getValuesForAllActions(features){
    var featuresMatrixBody = features.map((f) => [f])
    var featuresMatrix = new Matrix(this.numFeatures, 1, featuresMatrixBody);

    var resultMatrix = Matrix.product(this.weights, featuresMatrix)
    var resultMatrixBody = resultMatrix.body
    var flattenedResult = [].concat.apply([], resultMatrixBody)

    return flattenedResult
  }

  learn(features, action, rewards, nextFeatures){
    this.storeExperience(features, action, rewards, nextFeatures);

    if (this.experience.length >= this.batchSize) {
      var newWeightValuesHash = {}

      for (var i = 0; i < this.batchSize; i++) {
        var transition = this.sampleFromExperience();
        var rowIndex = this.actionIndex(transition.action)
        var stepSize = this.bellmanStepSizeForTransition(transition);
        var newWeightValues = this.calculatedWeightValues(transition.features, rowIndex, stepSize);

        if (newWeightValuesHash[rowIndex]) {
          var newValue = newWeightValuesHash[rowIndex].val.map((val, index) => val + newWeightValues[index])
          newWeightValuesHash[rowIndex].val = newValue
          newWeightValuesHash[rowIndex].count += 1
        }
        else{
          newWeightValuesHash[rowIndex] = {}
          newWeightValuesHash[rowIndex].val = newWeightValues
          newWeightValuesHash[rowIndex].count = 1
        }
      }
      var that = this;

      Object.keys(newWeightValuesHash).forEach(function (actionIndex) {
        var summedWeightValues = newWeightValuesHash[actionIndex].val
        var average = summedWeightValues.map((v) => v / newWeightValuesHash[actionIndex].count)
        that.updateWeights(actionIndex, average);
      });
    }
  };

  storeExperience(features, action, rewards, nextFeatures){
    var experience = {
      features: features,
      action: action,
      rewards: rewards,
      nextFeatures: nextFeatures
    }
    if (this.experience.length >= this.experienceSize) {
      this.experience.splice(0, 1);
    }
    this.experience.push(experience);
  }

  sampleFromExperience(){
    var transitionIndex = parseInt(Math.random() * this.experience.length);
    return this.experience[this.experience.length - transitionIndex - 1]
  }

  sampleFromExperienceCount(count){
    var experienceArray = []
    for (var i = 0; i < count; i++) {
      experienceArray.push(this.sampleFromExperience());
    }

    return experienceArray;
  }

  gradientsForTransition(transition){
    return transition.features;
  }

  updateWeights(rowIndex, newWeightValues){
    this.weights.setRow(rowIndex, newWeightValues);
  };

  calculatedWeightValues(features, rowIndex, stepSize){
    var selectedWeights = this.weights.row(rowIndex);

    // need to optimize these to use the matrix library
    var weightDeltas = features.map((val) => val * stepSize);
    var newWeightValues = selectedWeights.map((val, index) => val + weightDeltas[index]);

    return newWeightValues;
  }

  gradient(features, weightIndex){
    return features[weightIndex]
  }

  bellmanStepSizeForTransition(transition){
    var tFeatures = transition.features;
    var tAction = transition.action;
    var tRewards = transition.rewards;
    var tNextFeatures = transition.nextFeatures;

    return this.bellmanStepSize(tFeatures, tAction, tNextFeatures, tRewards, this.alpha, this.gamma);
  }

  bellmanStepSize(features, action, nextFeatures, rewards, alpha, gamma){
    var nextAction = this.bestAction(nextFeatures)
    return this.stepSize(features, action, nextFeatures, nextAction, rewards, alpha, gamma)
  }

  stepSize(features, action, nextFeatures, nextAction, rewards, alpha, gamma){
    var Qsa = this.get(features, action);
    var QsPrimeAPrime = this.get(nextFeatures, nextAction);

    var f1 = rewards + (gamma * QsPrimeAPrime);
    var f0 = Qsa

    var h = alpha * (f1 - f0);
    // return h;
    return parseFloat(h.toFixed(5));
  }

  actionIndex(action){
    return this.actions.indexOf(action);
  }

  hasAction(action){
    return this.actionIndex(action) != -1
  }

  preventInexistentAction(action){
    if (!this.hasAction(action)) {
      throw new Error('Q instance does not have provided action '+ action)
    }
  }

  preventIncompatibleFeatureDimensions(features){
    if (this.incompatibleFeatureDimensions(features)) {
      throw new Error('provided features different in dimension from Q instance weights')
    }
  }

  incompatibleFeatureDimensions(features){
    // will be replaced and moved to Matrix when
    // we can cast arrays as matrices

    return this.weights.numColumns != features.length
  }

  argMaxValueAndActionFor(features){
    this.preventIncompatibleFeatureDimensions(features)

    var values = this.getValuesForAllActions(features)
    var maxValue = Math.max(...values)
    var maxActionIndex = values.indexOf(maxValue)
    var maxAction = this.actions[maxActionIndex]

    return [maxValue, maxAction];
  }

  argMax(features){
    return this.argMaxValueAndActionFor(features)[0]
  }

  bestAction(features){
    return this.argMaxValueAndActionFor(features)[1]
  }

  randomAction(){
    var actionIndex = Math.random() * this.actions.length
    actionIndex = Math.floor(actionIndex);

    return this.actions[actionIndex];
  }
}

module.exports = QRegression

},{"../q/matrix":2}],5:[function(require,module,exports){
Matrix = require('./matrix');
Q = require('./q');
QRegression = require('./q_regression');
Learner = require('./learner');

},{"./learner":1,"./matrix":2,"./q":3,"./q_regression":4}]},{},[5]);
