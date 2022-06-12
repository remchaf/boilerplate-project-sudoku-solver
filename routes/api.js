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
    } else if (/[^A-I1-9]/.test(coordinate) || coordinate.length > 2) {
      res.json({
        error: "Invalid coordinate",
      });
      return;
    } else if (/[^1-9\.]/.test(value) || value.length !== 1) {
      res.json({
        error: "Invalid value",
      });
      return;
    } else {
      let arr = [];
      const row = coordinate.charCodeAt(0) - 64;
      const column = coordinate[1] - 0;
      if (!solver.checkRowPlacement(puzzle, row, column, value)) {
        arr.push("row");
      }
      if (!solver.checkColPlacement(puzzle, row, column, value)) {
        arr.push("column");
      }
      if (!solver.checkRegionPlacement(puzzle, row, column, value)) {
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
    const solution = solver.solve(puzzle);
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
        solver,
      });
      return;
    } else if (!solution) {
      return res.json({
        error: "Puzzle cannot be solved",
      });
    } else {
      return res.json(solution);
    }
  });
};
