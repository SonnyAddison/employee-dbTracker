

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
        sequelize.query(
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
            sequelize.query(
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
            sequelize.query(
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

module.exports = adds;