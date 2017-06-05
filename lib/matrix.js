class Matrix{
  constructor(numRows, numColumns){
    this.numRows = numRows;
    this.numColumns = numColumns;
    this.body = [];
    this.setBody(Matrix.random(numRows, numColumns));
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

if( typeof exports !== 'undefined' ) {
  if( typeof module !== 'undefined' && module.exports ) {
    exports = module.exports = Matrix;
  }
  exports.Matrix = Matrix;
}
else {
  this.Matrix = Matrix;
}
