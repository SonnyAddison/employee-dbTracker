const express = require("express");
const inquirer = require("inquirer");
const sql = require("mysql2");
const util = require("util");



const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connection = sql.createConnection({
  host: "localhost",
  user: "root",
  password: "Diego01$onny",
  database: "hr_db"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");

 
 
});

connection.query = util.promisify(connection.query);

viewEntry = () => {
    inquirer.prompt([
      {
        name: "view",
        type: "list",
        message: "What would you like to view?",
        choices: [
          "View departmnets",
          "View roles",
          "View employees",
          "View all employees by department",
          "View all employees by role",
          "View all employees by manager",
          "Return to main menu"
        ]
      }
      ]).then(answer => {
        if (answer.view === "View departmnets"){
          viewDepartments();
        }else if (answer.view === "View roles"){
          viewRoles();
        }else if (answer.view === "View employees"){
          viewEmployees();
        }else if (answer.view === "View all employees by department"){
          viewEmployeesByDepartment();
        }else if (answer.view === "View all employees by role"){
          viewEmployeesByRole();
        }else if (answer.view === "View all employees by manager"){
          viewEmployeesByManager();
        }else if (answer.view === "Return to main menu"){
          initiate();
        }else {
          exit();
        }
      })
    }
  
viewDepartments = () => {
    connection.query("SELECT * FROM department", async function (err, res) {
      try {
        if (err) throw err;
        console.log("\n");
        console.table("department", res);
        console.log("\n");
        await initiate();
      } catch (err) {
        console.log(err);
      }
    })
  }
  
viewRoles = () => {
    connection.query("SELECT * FROM role", async function (err, res) {
      try {
        if (err) throw err;
        console.log("\n");
        console.table("role", res);
        console.log("\n");
        await initiate();
      } catch (err) {
        console.log(err);
      }
    })
  }
  
viewEmployees = () => {
    connection.query("SELECT * FROM employee", async function (err, res) {
      try {
        if (err) throw err;
        console.log("\n");
        console.table("employee", res);
        console.log("\n");
        await initiate();
      } catch (err) {
        console.log(err);
      }
    })
  }
  
viewEmployeesByDepartment = () => {
    readDepartments().then(departments => {
      const employeeDept = departments.map(({ name: name, id: value}) => ({ name, value }));
      inquirer.prompt([
        {
          name: "department",
          type: "list",
          message: "Which department would you like to view?",
          choices: employeeDept
        }
      ]).then(answer => {
        let query = "SELECT * FROM employee WHERE role_id = ?";
        connection.query(query, [answer.department], async function (err, res) {
          if (err) throw err;
            try {
              console.log("\n");
              console.table("roles", res);
              console.log("\n");
              await initiate();
            }
            catch (err) {
              console.log(err);
            }
        }
        )})
        .catch(err => {
          console.log(err);
        })
    })};
  
viewEmployeesByRole = () => {
    readRoles().then(roles => {
      const employeeRole = roles.map(({ name: name, id: value}) => ({ name, value }));
      inquirer.prompt([
        {
          name: "role",
          type: "list",
          message: "Which role would you like to view?",
          choices: employeeRole
        }
      ]).then(answer => {
        let query = "SELECT * FROM employee WHERE role_id = ?";
        connection.query(query, [answer.role], async function (err, res) {
          if (err) throw err;
            try {
              console.log("\n");
              console.table("roles", res);
              console.log("\n");
              await initiate();
            }
            catch (err) {
              console.log(err);
            }
        }
        )})
        .catch(err => {
          console.log(err);
        })
    })
  }
  
viewEmployeesByManager = () => {
    connection.query("SELECT manager_name AS Manager, CONCAT(first_name, ' ', last_name) AS Employee FROM employee", async function (err, res) {
      try {
        if (err) throw err;
        console.log("\n");
        console.table("employee", res);
        console.log("\n");
        await initiate();
      } catch (err) {
        console.log(err);
      }
    })
  }
  
readRoles = () => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM role", function (err, res) {
            if (err) reject(err);
            resolve(res);
        })
    })
  }
  
readEmployees = () => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM employee", function (err, res) {
            if (err) reject(err);
            resolve(res);
        })
    })
  }
  
readDepartments = () => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM department", function (err, res) {
            if (err) reject(err);
            resolve(res);
        })
    })
  }

  module.exports = {viewEntry};
