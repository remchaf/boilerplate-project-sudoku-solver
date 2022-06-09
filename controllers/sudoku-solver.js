class SudokuSolver {
  validate(puzzleString) {
    return /^[1-9]{81}$/.test(puzzleString);
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const index = (row - 1) * 9 + column - 1;
    let string = "".concat(puzzleString);
    string = string
      .slice(0, index)
      .concat(value)
      .concat(string.slice(index + 1));

    const returnPuzzleString = string.slice((row - 1) * 9, (row - 1) * 9 + 9);

    return checker(returnPuzzleString);
  }

  checkColPlacement(puzzleString, row, column, value) {
    let str = "".concat(puzzleString);
    let index = (row - 1) * 9 + column - 1;
    str = str
      .slice(0, index)
      .concat(value)
      .concat(str.slice(index + 1));

    let string = "";
    for (let i = column - 1; i < str.length; i += 9) {
      string += str[i];
    }
    return checker(string);
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let index = (Math.ceil(row / 3) - 1) * 27 + (Math.ceil(column / 3) - 1) * 3;
    let str = "".concat(puzzleString);
    str = str
      .slice(0, (row - 1) * 9 + (column - 1))
      .concat(value)
      .concat(str.slice((row - 1) * 9 + (column - 1) + 1));

    let string = "";
    for (let i = 0; i < 3; i++) {
      string = string.concat(str.slice(index, index + 3));
      index += 9;
    }
    return checker(string);
  }

  solve(puzzleString) {
    let array = [];
    for (let i = 0; i < 9; i++) {
      array.push(
        this.checkColPlacement(puzzleString, 1, i + 1, puzzleString[i])
      );
      array.push(
        this.checkRowPlacement(puzzleString, i + 1, 1, puzzleString[i * 9])
      );
      array.push(
        this.checkRegionPlacement(
          puzzleString,
          i + 1,
          (i % 3) * 3 + 1,
          puzzleString[i * 9 + (i % 3) * 3]
        )
      );
    }
    return array.every((e) => Boolean(e));
  }
}

function checker(params) {
  array = params
    .replace(/\./g, "")
    .split("")
    .sort((a, b) => a - b);
  return array.every((n, i) => n !== array[i + 1]);
}
 
// const func = new SudokuSolver();
// console.log(
//   func.validate(
//     "135762984946381257728459613694517832812936745357824196473298561581673429269145378"
//   )
// );

module.exports = SudokuSolver;
