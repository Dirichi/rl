Matrix = require('../q/matrix');
StateInterpreter = require('../q/state_interpreter');
_ = require('underscore');

class QRegression {
  static defaults(numFeatures, actions){
    var actionsSize = actions.length;

    return {
      weights: new Matrix(actionsSize, numFeatures),
      interpreter: new StateInterpreter('array-of-features'),
      experienceSize: 1000,
      batchSize: 1
     }
  }

  constructor(args) {
    var newArgs = _.extend(QRegression.defaults(args.numFeatures, args.actions), args)
    this.numFeatures = newArgs.numFeatures;
    this.actions = newArgs.actions;
    this.weights = newArgs.weights; // add a set weights method
    this.experience = [];
    this.experienceSize = newArgs.experienceSize;
    this.batchSize = newArgs.batchSize;
    this.interpreter = newArgs.interpreter;
  }

  setEnvironment(environment){
    this.environment = environment
  };

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
    //requires refactoring
    this.storeExperience(features, action, rewards, nextFeatures);

    if (this.canUpdateWeights()) {
      var newWeightValuesHash = {}
      for (var i = 0; i < this.batchSize; i++) {
        this.collectWeightValuesIntoHash(newWeightValuesHash)
      }
      this.updateWeightsWithHash(newWeightValuesHash)
    }
  };

  canUpdateWeights(){
    return this.experience.length >= this.batchSize
  }

  collectWeightValuesIntoHash(newWeightValuesHash){
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

  updateWeightsWithHash(newWeightValuesHash){
    var that = this;

    Object.keys(newWeightValuesHash).forEach(function (actionIndex) {
      var summedWeightValues = newWeightValuesHash[actionIndex].val;
      var average = summedWeightValues.map((v) => v / newWeightValuesHash[actionIndex].count);
      that.updateWeights(actionIndex, average);
    });
  }

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
    return h;
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

  getCurrentState(){
    return this.interpreter.interpreteState(this.environment.observables());
  }
}

module.exports = QRegression
