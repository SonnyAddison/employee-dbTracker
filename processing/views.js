

viewEntry = () => {
    inquirer.prompt([
      {
        name: "view",
        type: "list",
        message: "What would you like to review?",
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
    sequelize.query("SELECT * FROM department", async function (err, res) {
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
    sequelize.query("SELECT * FROM role", async function (err, res) {
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
    sequelize.query("SELECT * FROM employee", async function (err, res) {
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
    sequelize.query("SELECT manager_name AS Manager, CONCAT(first_name, ' ', last_name) AS Employee FROM employee", async function (err, res) {
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
        sequelize.query("SELECT * FROM role", function (err, res) {
            if (err) reject(err);
            resolve(res);
        })
    })
}

readEmployees = () => {
    return new Promise((resolve, reject) => {
        sequelize.query("SELECT * FROM employee", function (err, res) {
            if (err) reject(err);
            resolve(res);
        })
    })
}

readDepartments = () => {
    return new Promise((resolve, reject) => {
        sequelize.query("SELECT * FROM department", function (err, res) {
            if (err) reject(err);
            resolve(res);
        })
    })
}

