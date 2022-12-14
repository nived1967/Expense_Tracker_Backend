const mysql = require("mysql");
const express = require("express");
const bodyparser = require("body-parser");
var app = express();
const cors=require("cors");

app.use(bodyparser.json());
app.use(cors());

var mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "niveddb",
  password: "abc",
  database: "expense_track",
  multipleStatements: true
});

mysqlConnection.connect((err) => {
  if (!err) console.log("Connection Established Successfully");
  else console.log("Connection Failed!" + JSON.stringify(err, undefined, 2));
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}..`));

app.get("/expense_track/expense", (req, res) => {
  mysqlConnection.query("SELECT * FROM expense", (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

app.get("/expense_track/users", (req, res) => {
  mysqlConnection.query(
    "SELECT * FROM users",
    (err, rows, fields) => {
      if (!err) res.send(rows);
      else console.log(err);
    }
  );
});

app.get("/expense_track/:id", (req, res) => {
  mysqlConnection.query(
    "SELECT * FROM expense WHERE user_id = ?",
    [req.params.id],
    (err, rows, fields) => {
      if (!err) res.send(rows);
      else console.log(err);
    }
  );
});

app.get("/expense_track/users/:id", (req, res) => {
    mysqlConnection.query(
      "SELECT * FROM users WHERE user_id = ?",
      [req.params.id],
      (err, rows, fields) => {
        if (!err) res.send(rows);
        else console.log(err);
      }
    );
  });

app.post("/expense_track/users/login", (req, res) => {
    let exp=req.body;
    mysqlConnection.query(
      "SELECT * FROM users WHERE user_name = ? AND user_password = ?",
      [exp.user_name,exp.user_password],
      (err, rows, fields) => {
        if (!err) res.send(rows);
        else console.log(err);
      }
    );
  });

app.post("/expense_track/users/register", (req, res) => {
  let exp = req.body;
  var sql =
    "SET @user_id = ?;SET @user_name = ?;SET @user_password = ?; CALL userAddOrEdit(@user_id,@user_name,@user_password);";
  mysqlConnection.query(
    sql,
    [exp.user_id, exp.user_name, exp.user_password],
    (err, rows, fields) => {
      if (!err)
        rows.forEach((element) => {
          if (element.constructor == Array)
          {
            if(element[0].user_id==0)
            res.send("User already exists");
            else
            res.send("New User ID : " + element[0].user_id);
          }
        });
      else console.log(err);
    }
  );
});

app.post("/expense_track", (req, res) => {
  let exp = req.body;
  var sql =
    "SET @user_id = ?;SET @user_name = ?;SET @user_expense = ?; CALL expenseAddOrEdit(@user_id,@user_name,@user_expense);";
  mysqlConnection.query(
    sql,
    [exp.user_id, exp.user_name, exp.user_expense],
    (err, rows, fields) => {
      if (!err)
        rows.forEach((element) => {
          if (element.constructor == Array)
            res.send("New User ID : " + element[0].user_id);
        });
      else console.log(err);
    }
  );
});

app.put("/expense_track", (req, res) => {
  let exp = req.body;
  var sql =
    "SET @user_id = ?;SET @user_name = ?;SET @user_expense = ?; CALL expenseAddOrEdit(@user_id,@user_name,@user_expense);";
  mysqlConnection.query(
    sql,
    [exp.user_id, exp.user_name, exp.user_expense],
    (err, rows, fields) => {
      if (!err) res.send("User Details Updated Successfully");
      else console.log(err);
    }
  );
});

app.delete("/expense_track/:id", (req, res) => {
  mysqlConnection.query(
    "DELETE FROM expense WHERE user_id = ?",
    [req.params.id],
    (err, rows, fields) => {
      if (!err) res.send("User Record deleted successfully.");
      else console.log(err);
    }
  );
});

app.delete("/expense_track/users/:id", (req, res) => {
    mysqlConnection.query(
      "DELETE FROM users WHERE user_id = ?",
      [req.params.id],
      (err, rows, fields) => {
        if (!err) res.send("User Record deleted successfully.");
        else console.log(err);
      }
    );
  });
