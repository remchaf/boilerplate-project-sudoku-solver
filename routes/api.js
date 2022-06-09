"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    const { puzzle, coordinate, value } = req.body;
    if (!puzzle || !coordinate || !value) {
      res.json({
        error: "Required field(s) missing",
      });
      return;
    } else if (puzzle.length !== 81) {
      res.json({
        error: "Expected puzzle to be 81 characters long",
      });
      return;
    } else if (/[^1-9\.]/.test(puzzle)) {
      res.json({
        error: "Invalid characters in puzzle",
      });
      return;
    } else if (
      /[^A-I1-9]/.test(coordinate) ||
      /[^A-I]/.test(coordinate[0]) ||
      /[^1-9]/.test(coordinate[1]) ||
      coordinate.length > 1
    ) {
      res.json({
        error: "Invalid coordinate",
      });
      return;
    } else if (/[^1-9\.]/.test(value)) {
      res.json({
        error: "Invalid value",
      });
      return;
    } else {
      let arr = [];
      const row = coordinate[0].charCodeFrom(0);
      const column = coordinate[1] - 0;
      if (!SudokuSolver.checkRowPlacement(puzzle, row, column, value)) {
        arr.push("row");
      }
      if (!SudokuSolver.checkColumnPlacement(puzzle, row, column, value)) {
        arr.push("column");
      }
      if (!SudokuSolver.checkRegionPlacement(puzzle, row, column, value)) {
        arr.push("region");
      }

      !arr.length
        ? res.json({
            valid: true,
          })
        : res.json({
            valid: false,
            conflict: arr,
          });
    }
    return;
  });

  app.route("/api/solve").post((req, res) => {
    let puzzle = req.body.puzzle;
    const solution = SudokuSolver.solver(puzzle);
    if (!puzzle || puzzle == undefined) {
      res.json({
        error: "Required field missing",
      });
      return;
    } else if (/[^1-9\.]/.test(puzzle)) {
      res.json({
        error: "Invalid characters in puzzle",
      });
      return;
    } else if (puzzle.length !== 81) {
      res.json({
        error: "Expected puzzle to be 81 characters long",
      });
      return;
    } else if (!solution) {
      return res.json({
        error: "Puzzle cannot be solved",
      });
    } else {
      return res.json({
        solution: solution,
      });
    }
  });
};
