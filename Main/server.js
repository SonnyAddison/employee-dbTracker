const express = require("express");
const inquirer = require("inquirer");
const clear = require("clear");
const consTable = require("console.table");
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

  clear();
  initiate();
});

connection.query = util.promisify(connection.query);


initiate = () => {
  inquirer.prompt([
    {
      name: "select",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View an Entry",
        "Add an Entry",
        "Update an Entry",
        "Exit Program"
      ]
    }
  ]).then(answer => {
      if (answer.select === "View an Entry"){
        viewEntry();
      }
      else if (answer.select === "Add an Entry"){
        addEntry();
      }  
      else if (answer.select === "Update an Entry"){
        updateEntry();
      }
      else if (answer.select === "Exit Program"){
        exit();
      }
  });

}

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

addEntry = () => {
  inquirer.prompt([
      {
          name: "add",
          type: "list",
          message: "What would you like to add?",
          choices: [
              "Add a department",
              "Add an employee",
              "Add a role",
              "Return to main menu"
          ]
      }
  ]).then(answer => {
      if (answer.add === "Add a department"){
          addDepartment();
      }else if (answer.add === "Add an employee"){
          addEmployee();
      }else if (answer.add === "Add a role"){
          addRole();
      }else if (answer.add === "Return to main menu"){
          initiate();
      }else {
          exit();
      }
  })
}

addDepartment = () => {
  inquirer.prompt([
      {
          name: "department",
          type: "input",
          message: "What is the name of the department?",
          validate: (value) => {
              if (value.length > 0) {
                  return true;
              } else {
                  return "Please enter a valid department name.";
              }
          }
      }
  ]).then(answer => {
      connection.query(
          "INSERT INTO department SET ? ", {
              name: answer.department
          }, (err => {
              if (err) throw err;
              console.log("\n");
              console.log(`${answer.department} has been added to the department table.`);
              console.log("\n");
              initiate();
          }))
  })  
}

addEmployee = () => {
  readRoles().then(roles => {
      const roleChoices = roles.map(({title: name, id: value}) => ({name, value}));
      inquirer.prompt([
          {
              name: "firstName",
              type: "input",
              message: "What is the employee's first name?",
              validate: (value) => {
                  if (value.length > 0) {
                      return true;
                  } else {
                      return "Please enter a valid first name.";
                  }
              }
          },
          {
              name: "lastName",
              type: "input",
              message: "What is the employee's last name?",
              validate: (value) => {
                  if (value.length > 0) {
                      return true;
                  } else {
                      return "Please enter a valid last name.";
                  }
              }
          },
          {
              name: "empRole",
              type: "list",
              message: "What is the employee's role?",
              choices: roleChoices
          },
          {
              name: "empManager",
              type: "input",
              message: "Who is the employee's manager? (Enter N/A if no manager)",
              validate: (value) => {
                  if (value.length > 0) {
                      return true;
                  } else {
                      return "Please enter a valid manager.";
                  }
              }
          }
      ]).then(answer => {
          connection.query(
              "INSERT INTO employee SET ? ", {
                  first_name: answer.firstName,
                  last_name: answer.lastName,
                  role_id: answer.empRole,
                  manager_id: answer.empManager
              }, (err => {
                  if (err) throw err;
                  console.log("\n");
                  console.log(`${answer.firstName} ${answer.lastName} has been added to the employee table.`);
                  console.log("\n");
                  initiate();
              }))
      })
  })
}

addRole = () => {
  readDepartments().then(departments => {
      const departmentChoices = departments.map(({name: name, id: value}) => ({name, value}));
      inquirer.prompt([
          {
              name: "title",
              type: "input",
              message: "What is the role's title?",
              validate: (value) => {
                  if (value.length > 0) {
                      return true;
                  } else {
                      return "Please enter a valid title.";
                  }
              }
          },
          {
              name: "salary",
              type: "input",
              message: "What is the role's salary?",
              validate: (value) => {
                  if (value.length > 0) {
                      return true;
                  } else {
                      return "Please enter a valid salary.";
                  }
              }
          },
          {
              name: "department",
              type: "list",
              message: "What is the role's department?",
              choices: departmentChoices
          }
      ]).then(answer => {
          connection.query(
              "INSERT INTO role SET ? ", {
                  title: answer.title,
                  salary: answer.salary,
                  department_id: answer.department
              }, (err => {
                  if (err) throw err;
                  console.log("\n");
                  console.log(`${answer.title} has been added to the role table.`);
                  console.log("\n");
                  initiate();
              }))
      })
  })
}

updateEntry = () => {
  inquirer.prompt([
      {
          name: "update",
          type: "list",
          message: "What would you like to do?",
          choices: [
              "Delete a department",
              "Delete an employee",
              "Delete a role",
              "Update an employee's role",
              "Return to main menu"
          ]
      }
  ]).then(answer => {
      if (answer.update === "Delete a department"){
          deleteDepartment();
      }else if (answer.update === "Delete an employee"){
          deleteEmployee();
      }else if (answer.update === "Delete a role"){
          deleteRole();
      }else if (answer.update === "Update an employee's role"){
          updateEmployeeRole();
      }else if (answer.update === "Return to main menu"){
          initiate();
      }else {
          exit();
      }
  })
}

deleteDepartment = () => {
  readDepartments().then(departments => {
      const deleteDep = department.map(({name: name, id: value}) => ({name, value}));
      inquirer.prompt([
          {
              name: "delDepartment",
              type: "list",
              message: "Which department would you like to delete?",
              choices: deleteDep
          }
      ]).then(answer => {
          connection.query(
              "DELETE FROM department WHERE id = ?", [answer.delDepartment],
                  async function (err, res) {
                      try {
                          if (err) throw err;
                          console.log("\n");
                          console.log("Department deleted");
                          console.log("\n");
                          await initiate();
                      } catch (err) {
                          console.log(err);
                      }
                  });
      })

  })
}

deleteEmployee = () => {
  readEmployees().then(employees => {
      const deleteEmp = employees.map(({first_name: name, id: value}) => ({name, value}));
      inquirer.prompt([
          {
              name: "delEmployee",
              type: "list",
              message: "Which employee would you like to delete?",
              choices: deleteEmp
          }
      ]).then(answer => {
          connection.query(
              "DELETE FROM employee WHERE id = ?", [answer.delEmployee],
                  async function (err, res) {
                      try {
                          if (err) throw err;
                          console.log("\n");
                          console.log("Employee deleted");
                          console.log("\n");
                          await initiate();
                      } catch (err) {
                          console.log(err);
                      }
                  });
      })

  })
}

deleteRole = () => {
  readRoles().then(roles => {
      const deleteRole = roles.map(({title: name, id: value}) => ({name, value}));
      inquirer.prompt([
          {
              name: "delRole",
              type: "list",
              message: "Which role would you like to delete?",
              choices: deleteRole
          }
      ]).then(answer => {
          connection.query(
              "DELETE FROM role WHERE id = ?", [answer.delRole],
                  async function (err, res) {
                      try {
                          if (err) throw err;
                          console.log("\n");
                          console.log("Role deleted");
                          console.log("\n");
                          await initiate();
                      } catch (err) {
                          console.log(err);
                      }
                  });
      })

  })
}

async function updateEmployeeRole(){
  try{
      const roles = await readRoles();
      const employees = await readEmployees();
      const roleChoices = roles.map(({title: name, id: value}) => ({name, value}));
      const employeeChoices = employees.map(({first_name: name, id: value}) => ({name, value}));
      inquirer.prompt([
          {
              name: "employee",
              type: "list",
              message: "Which employee would you like to update?",
              choices: employeeChoices
          },
          {
              name: "role",
              type: "list",
              message: "What is the new role?",
              choices: roleChoices
          }
      ]).then(answer => {
          connection.query(
              "UPDATE employee SET role_id = ? WHERE id = ?", [answer.role, answer.employee],
                  async function (err, res) {
                      try {
                          if (err) throw err;
                          console.log("\n");
                          console.log("Employee role updated");
                          console.log("\n");
                          await initiate();
                      } catch (err) {
                          console.log(err);
                      }
                  });
      })
  }
  catch(err){
      console.log(err);
  }
}


exit = () => {
  process.exit();
}


