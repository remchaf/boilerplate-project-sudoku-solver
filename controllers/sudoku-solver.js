const heapPermutation = require("../permutation.js");

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

  conflicChecker(param) {
    for (let i = 0; i < 9; i++) {
      if (
        !this.checkColPlacement(param, 1, i + 1, param[i]) ||
        !this.checkRowPlacement(param, i + 1, 1, param[i * 9]) ||
        !this.checkRegionPlacement(
          param,
          i + 1,
          (i % 3) * 3 + 1,
          param[i * 9 + (i % 3) * 3]
        )
      ) {
        return false;
      }
    }
    return true;
  }

  solve(puzzleString) {
    const date = new Date();
    const str = "".concat(puzzleString);
    const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let array = [str],
      arr = [];

    const idx = str.split("").indexOf(".");
    let index = idx !== -1 ? Math.floor(idx / 9) * 9 : 81;

    while (array.length && /\./.test(array[0])) {
      arr = [];

      let strArr = array[0].slice(index, index + 9);
      let mArr = values.filter((e) => !strArr.includes(e));
      let permutation = heapPermutation(mArr)[0];

      for (let i = 0; i < array.length; i++) {
        let string = array[i];
        let arr0 = permutation.reduce((result, current) => {
          let this_string = "".concat(string);
          for (let k = 0; k < current.length; k++) {
            const e = current[k];
            this_string = this_string.replace(/\./, e);
          }
          if (this.conflicChecker(this_string)) {
            result.push(this_string);
          }
          return result;
        }, []);
        arr = arr.concat(arr0);
      }

      array = [].concat(arr.filter((a) => this.conflicChecker(a)));

      index += 9;
    }

    const solution = array.find((e) => this.conflicChecker(e));
    console.log(new Date() - date, "ms");
    return solution ? { valid: true, solution } : { valid: false };
  }
}

function checker(params) {
  const array = params
    .replace(/\./g, "")
    .split("")
    .sort((a, b) => a - b);
  return array.every((n, i) => n !== array[i + 1]);
}

// const func = new SudokuSolver();
// console.log(
//   func.solve(
//     "..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1"
//   )
// );

module.exports = SudokuSolver;
