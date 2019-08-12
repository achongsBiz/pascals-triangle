let should = chai.should();

describe('Triangle Render', function() {
    it('Triangle Size of Exponent 1', expoOne);
    it('Triangle Size of Exponent 2', expoTwo);
    it('Triangle Size of Exponent 3', expoThree);
})

describe('Prelim Formula Render', function() {
  it('Triangle Size of Exponent 3', prelimFormulaThree);
})

describe('Simplified Formula Render', function() {
  it('Triangle Size of Exponent 3', simplifiedFormulaThree);
})

function expoOne() {

  let output = buildPascal(1);
  output.length.should.equal(2);

  output[0][0].should.equal(1);
  output[1][0].should.equal(1);
  output[1][1].should.equal(1);
}

function expoTwo() {

  let output = buildPascal(2);
  output.length.should.equal(3);

  output[0][0].should.equal(1);

  output[1][0].should.equal(1);

  output[1][1].should.equal(1);

  output[2][0].should.equal(1);
  output[2][1].should.equal(2);
  output[2][2].should.equal(1);
}

function expoThree() {
  let output = buildPascal(3);
  output.length.should.equal(4);

  output[0][0].should.equal(1);

  output[1][0].should.equal(1);
  output[1][1].should.equal(1);

  output[2][0].should.equal(1);
  output[2][1].should.equal(2);
  output[2][2].should.equal(1);

  output[3][0].should.equal(1);
  output[3][1].should.equal(3);
  output[3][2].should.equal(3);
  output[3][3].should.equal(1);
}

function prelimFormulaThree () {

  let terms = ["1*x^3*2^0", "3*x^2*2^1", "3*x^1*2^2", "1*x^0*2^3"]
  let symbol = "+";
  let expectedString = "<strong>Preliminary formula:</strong><br>(<span id=\"coefficient\" style=\"color:red\">1</span>)(x<sup>3</sup>) + (<span id=\"coefficient\" style=\"color:red\">3</span>)(x<sup>2</sup>)(2) + (<span id=\"coefficient\" style=\"color:red\">3</span>)(x)(2<sup>2</sup>) + (<span id=\"coefficient\" style=\"color:red\">1</span>)(2<sup>3</sup>)";
  let actualResult = obtainPrelim(terms, symbol);
  actualResult.should.equal(expectedString);
}

function simplifiedFormulaThree() {

  let terms = ["1*x^3*2^0", "3*x^2*2^1", "3*x^1*2^2", "1*x^0*2^3"]
  let symbol = "+";
  let expectedString = "<strong>Further simplified:</strong><br>x<sup>3</sup> + 6x<sup>2</sup> + 12x + 8";
  let actualResult = obtainSimplified(terms, symbol);
  actualResult.should.equal(expectedString);
}

