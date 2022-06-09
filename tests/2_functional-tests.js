const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

const string =
  ".7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6";
const solutionString =
  "473891265851726394926345817568913472342687951197254638734162589685479123219538746";

suite("Functional Tests", () => {
  test("#1 Solve a puzzle with valid puzzle string: POST request to /api/solve", function (done) {
    chai
      .request(server)
      .post("/api/solve")
      .send({
        puzzle: string,
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, true);
        assert.equal(res.body.solution, solutionString);
      });
    done();
  });

  test("#2 Solve a puzzle with missing puzzle string: POST request to /api/solve", function (done) {
    chai
      .request(server)
      .post("/api/solve")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Required field missing");
      });
    done();
  });

  test("#3 Solve a puzzle with invalid characters: POST request to /api/solve", function (done) {
    chai
      .request(server)
      .post("/api/solve")
      .send({
        puzzle: "a?{]" + string.slice(4),
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid characters in puzzle");
      });
    done();
  });

  test("#4 Solve a puzzle with incorrect length: POST request to /api/solve", function (done) {
    chai
      .request(server)
      .post("/api/solve")
      .send({
        puzzle: string.slice(2),
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Expected puzzle to be 81 charaters long");
      });
    done();
  });

  test("#5 Solve a puzzle that cannot be solved: POST request to /api/solve", function (done) {
    chai
      .request(server)
      .post("/api/solve")
      .send({
        puzzle: string,
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Puzzle cannot be solved");
      });
    done();
  });

  test("#6 Check a puzzle placement with all fields: POST request to /api/check", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: string,
        coordinate: A5,
        value: 5,
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.notProperty(res.body, "error");
      });
    done();
  });

  test("#7 Check a puzzle placement with single placement conflict: POST to /api/check", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: string,
        coordinate: "A1",
        value: "9",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isNotOk(res.body.valid);
        assert.equal(res.body.conflict.length, 1);
      });
    done();
  });

  test("#8 Check a puzzle placement with multiple placement conflict: POST to /api/check", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: string,
        coordinate: "A3",
        value: "8",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isNotOk(res.body.valid);
        assert.equal(res.body.conflict.length, 2);
        done();
      });
  });

  test("#9 Check a puzzle placement with all placement conflicts: POST to /api/check", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: string,
        coordinate: "C1",
        value: "2",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isNotOk(res.body.valid);
        assert.equal(res.body.conflict.length, 3);
      });
    done();
  });

  test("#10 Check a puzzle placement with missing required fields: POST to /api/check", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: string,
        value: "4",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Required field(s) missing");
      });
    done();
  });

  test("#11 Check a puzzle placement with invalid characters: POST to /api/check", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: string,
        coordinate: "K4",
        value: "5",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, "error");
      });
    done();
  });

  test("#12 Check a puzzle placement with incorrect length: POST  to /api/check", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: string.slice(1),
        coordinate: "A5",
        value: "6",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, "error");
      });
    done();
  });

  test("#13 check a puzzle placement with invalid placement coordinate: POST to /api/check", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: string,
        coordinate: "J6",
        value: "3",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, "error");
      });
    done();
  });

  test("#14 Check a puzzle placement with invalid placement value: POST to /api/check", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: string,
        coordinate: "C4",
        value: "25",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, "error");
      });
    done();
  });
});
