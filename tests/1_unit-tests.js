const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
let solver = new Solver();

const string1 =
  "827549163531672894649831527496157382218396475753284916962415738185763249374928651";
const string2 =
  "82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51";

suite("UnitTests", () => {
  test("#1 - Logic handles a valid puzzle sting of 81 characters", function (done) {
    assert.equal(solver.validate(string1), true);
    done();
  });

  test("#2 - Logic handles a puzzle sting with invalid characters (not 1-9 or .)", function (done) {
    assert.equal(solver.validate("0" + string2.slice(2) + "a"), false);
    done();
  });

  test("#3 - Logic handles a puzzle string that is not 81 characters in length", function (done) {
    assert.equal(solver.validate(string2.slice(2)), false);
    done();
  });

  test("#4 - Logic handles a valid row placement", function (done) {
    assert.equal(solver.checkRowPlacement(string2, 1, 3, "7"), true);
    done();
  });

  test("#5 - Logic handles an invalid row placement", function (done) {
    assert.notOk(solver.checkRowPlacement(string2, 1, 3, "2"));
    done();
  });

  test("#6 - Logic handles a valid column placement", function (done) {
    assert.isOk(solver.checkColPlacement(string2, 1, 3, "7"));
   done()
  });

  test("#7 - Logic handles an invalid column placement", function (done) {
    assert.isNotOk(solver.checkColPlacement(string1, 1, 1, 2));
   done()
  });

  test("#8 - Logic handles a valid region (3*3 grid) placement", function (done) {
    assert.isOk(solver.checkRegionPlacement(string1, 1, 2, 2));
   done()
  });

  test("#9 - Logic handles an invalid region (3*3 grid) placement", function (done) {
    assert.isNotOk(solver.checkRegionPlacement(string1, 1, 2, 8));
   done()
  });

  // test("#10 - Valid puzzle stings pass the solver", function (done) {
  //   assert.isOk(solver.solve(string2).valid);
  //   assert.property(solver.solve(string2), "solution");
  //  done()
  // });

  // test("#11 - Invalid puzzle strings fail the solver", function (done) {
  //   assert.isNotOk(
  //     solver.solve(
  //       "..9..5.1.8574....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
  //     ).valid
  //   );
  //  done()
  // });

  // test("#12 - Solver returns the expected solution for an incomplete puzzle", function (done) {
  //   assert.equal(solver.solve(string2).solution, string1);
  //  done()
  // });
});
