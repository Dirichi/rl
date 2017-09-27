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

  dimensions(){
    return [this.numRows, this.numColumns]
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
