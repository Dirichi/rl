var expect = require("chai").expect;
var Matrix = require("../public/lib/q/matrix");

describe('Matrix', function () {
  describe('constructor', function () {
    it('sets the body of the Matrix on creation', function () {
      var testMatrix = new Matrix(2, 2)

      expect(testMatrix.body).to.be.an('array').that.is.not.empty;
    })
  })

  describe('zeroes', function () {
    it('returns a matrix of zeroes with provided dimensions', function (){
      var testMatrixZeroes = Matrix.zeroes(2, 2);

      expect(testMatrixZeroes).to.eql([[0, 0], [0, 0]]);
    })
  });

  describe('setBody', function () {
    it('sets the content of the matrix with provided data', function () {
      var testMatrix = new Matrix(2,2);
      var testMatrixZeroes = Matrix.zeroes(2, 2);
      testMatrix.setBody(testMatrixZeroes);

      expect(testMatrix.body).to.eql([[0, 0], [0, 0]]);
    });

    it('throws an error if provided data is not an array', function () {
      var testMatrix = new Matrix(2, 2);

      expect(testMatrix.setBody.bind(testMatrix, 'bad data')).to.throw('bad data is not an array');
    });

    it('throws an error if dimensions of provided data are different from matrix dimensions', function () {
      var testMatrix = new Matrix(2, 2);

      expect(testMatrix.setBody.bind(testMatrix, [0])).to.throw('provided array has different dimensions from matrix');
    })
  });

  describe('get', function () {
    it('returns the value at the provided index', function () {
      var testMatrix = new Matrix(2, 2);

      expect((testMatrix.get(0, 0))).to.equal(testMatrix.body[0][0]);
    });

    it('throws an error if the provided index is out of range of the matrix', function () {
      var testMatrix = new Matrix(2, 2);

      expect((testMatrix.get.bind(testMatrix, 1, 3))).to.throw('provided index is out of range of matrix dimensions')
    })
  })

  describe('set', function () {
    it('sets the value at the provided index to the provided value', function () {
      var testMatrix = new Matrix(2, 2);
      testMatrix.set(0,1,10);

      expect(testMatrix.get(0, 1)).to.equal(10);
    });

    it('throws an error if the provided index is out of range of matirx dimensions', function () {
      var testMatrix = new Matrix(2, 2);

      expect((testMatrix.set.bind(testMatrix, 1, 3, 10))).to.throw('provided index is out of range of matrix dimensions')
    });
  })

})
