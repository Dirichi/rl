class QRegression {
  constructor(numFeatures, actions, weights = new Matrix(actions.length, numFeatures)) {
    this.numFeatures = numFeatures
    this.actions = actions;
    this.weights = weights; // add a set weights method
    this.experience = [];
    this.experienceSize = 100;
  }

  setLearningParameters(alpha, gamma, epilson){
    this.alpha = alpha;
    this.gamma = gamma;
    this.epilson = epilson;
  }

  get(features, action){
    this.preventInexistentAction(action)
    var values = this.getValuesForAllActions(features)
    var actionIndex = this.actionIndex(action)

    return values[actionIndex]
  }

  getValuesForAllActions(features){
    var featuresMatrix = new Matrix(this.numFeatures, 1);
    var featuresMatrixBody = features.map((f) => [f])

    featuresMatrix.setBody(featuresMatrixBody)
    var resultMatrix = Matrix.product(this.weights, featuresMatrix)
    var resultMatrixBody = resultMatrix.body
    var flattenedResult = [].concat.apply([], resultMatrixBody)

    return flattenedResult
  }

  learn(features, action, rewards, nextFeatures, alpha = this.alpha, gamma = this.gamma){
    this.storeExperience(features, action, rewards, nextFeatures);

    var transition = this.sampleFromExperience();

    var tFeatures = transition.features
    var tAction = transition.action
    var tRewards = transition.rewards
    var tNextFeatures = transition.nextFeatures
    var tNextAction = this.bestAction(tNextFeatures);

    var h = this.bellmanStepSize(tFeatures, tAction, tNextFeatures, tRewards, alpha, gamma);
    var rowIndex = this.actionIndex(tAction);
    var chosenWeights = this.weights.row(rowIndex)
    var that = this;

    chosenWeights.forEach(function (weight, weightIndex) {
      var gradient = that.gradient(tFeatures, weightIndex);
      var newWeightValue = weight + (gradient * h);
      that.weights.set(rowIndex, weightIndex, newWeightValue);
    })
    // var gradient
    // a * (reward + (y * argMax(features)) - get(features, action) )
    // w = w + (gradient * stepSize)
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

  gradient(features, weightIndex){
    return features[weightIndex]
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
