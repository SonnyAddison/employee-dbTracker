const inquirer = import("inquirer");
const c_table = require("console.table");
const sql = require("./db/db_query");
const entries = require("./db/entries");
const express = require('express');
const sequelize = require('./config/connection');


const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});



//Question for the user to select the action they want to perform

// Departments
const new_Department = async () => {
    const department = await inquirer.prompt([
        {
            type: "list",
            name: "department",
            message: "What department would you like to add?",
            choices: ["Sales","Engineering","Finance","Legal",]
        }    
    ])
    await sql.add_department(department);
    console.log("Department added successfully!");

    entryRequest();
}

// Employees
const new_Employee = async () => {
    const role_arr = await entries.roleChoices();
    const manager_arr = await entries.managerChoices();
    const employee = await inquirer.prompt([
        {
            type: "input",
            name: "first_name",
            message: "What is the employee's first name?",
            validate: (first_name) => {
                if (first_name && isNaN(first_name)) {
                    return true;
                } else {
                    console.log("Please enter a valid first name");
                        return false;
                }
            }
        },
        {
            type: "input",
            name: "last_name",
            message: "What is the employee's last name?",
            validate: (last_name) => {
                if (last_name && isNaN(last_name)) {
                    return true;
                } else {
                     console.log("Please enter a valid last name");
                        return false;
                }
            }
        },
        {
            type: "list",
            name: "role_id",
            message: "What is the employee's role?",
            choices: role_arr,
            loop: false,
        },
        {
            type: "list",
            name: "manager_id",
            message: "Who is the employee's manager?",
            choices: manager_arr,
            loop: false,
        }
    ]);

    await sql.add_employee(employee);
    console.log("Employee added successfully!");

    entryRequest();
}

// Roles
const new_Role = async () => {
    const entry_arr = await entries.entryRequest();

    const role = await inquirer.prompt([
        {
            type: "input",
            name: "title",
            message: "What is the role's title?",
            validate: (title) => {
                if (title) {
                    return true;
                } else {
                    console.log("Please enter a valid title");
                        return false;
                }
            }
        },
        {
            type: "input",
            name: "salary",
            message: "What is the role's salary?",
            validate: (salary) => {
                if (salary && !isNaN(salary)) {
                    return true;
                } else {
                    console.log("Please enter a valid salary");
                        return false;
                }
            }
        },
        {
            type: "list",
            name: "department_id",
            message: "What is the role's department?",
            choices: entry_arr,
            loop: false,
        }
    ]);
    await sql.add_role(role);
    console.log("Role added successfully!");

    entryRequest();
}

// Remove Employee
const delete_Employee = async () => {
    const employee_arr = await entries.non_management_Requsets();

    const employee = await inquirer.prompt([
        {
            type: "list",
            name: "employee_id",
            message: "Which employee would you like to remove?",
            choices: employee_arr,
            loop: false,
        }
    ]);
    await sql.remove_employee(employee);
    console.log("Employee removed successfully!");

    entryRequest();
}

// Update Employee and Role
const update_Employee_Role = async () => {
    const role_arr = await entries.roleChoices();
    const employee_arr = await entries.empployeeChoices();
    const employee = await inquirer.prompt([
        {
            type: "list",
            name: "employee_id",
            message: "Which employee's role would you like to update?",
            choices: employee_arr,
            loop: false,
        },
        {
            type: "list",
            name: "role_id",
            message: "What is the employee's new role?",
            choices: role_arr,
            loop: false,
        }
    ]);
    await sql.update_employee_role(employee);
    console.log("Employee role updated successfully!");

    entryRequest();

const update_employee_manager = async () => {
    const employee_arr = await entries.non_management_Requsets();
    const manager_arr = await entries.managerChoices();

    const employee = await inquirer.prompt([
        {
            type: "list",
            name: "employee_id",
            message: "Which employee's manager would you like to update?",
            choices: employee_arr,
            loop: false,
        },
        {
            type: "list",
            name: "manager_id",
            message: "Who is the employee's new manager?",
            choices: manager_arr,
            loop: false,
        }
    ]);
    await sql.update_employee_manager(employee);
    console.log("Employee manager updated successfully!");

    entryRequest();

// Look up information

const view_departments =  () => {
    sql.get_Departments().then(([rows]) => {
            console.log ('\n');
            console.log(c_table.getTable(rows))
        }).then (() => {
            entryRequest();
        }).catch((err) => {
            console.log(err);
        });
    }
}

const view_roles = () => {
    sql.get_role().then(([rows]) => {
            console.log ('\n');
            console.log(c_table.getTable(rows))
        }).then (() => {
            entryRequest();
        }).catch((err) => {
            console.log(err);
        });
    }

const view_employees = () => {
    sql.get_employees().then(([rows]) => {
            console.log ('\n');
            console.log(c_table.getTable(rows))
        }).then (() => {
            entryRequest();
        }).catch((err) => {
            console.log(err);
        });
    }

const view_budget =  async () => {
    sql.get_budget_by_department().then(([rows]) => {
            console.log ('\n');
            console.log(c_table.getTable(rows))
        }).then (() => {
            entryRequest();
        }).catch((err) => {
            console.log(err);
        });
    }

const view_employees_by_department = async () => {
    const department_arr = await entries.departmentChoices();
    const department = await inquirer.prompt([
        {
            type: "list",
            name: "department_id",
            message: "Which department would you like to view?",
            choices: department_arr,
            loop: false,
        }
    ]).then((data) => {
    sql.get_employees_by_department_id(department).then(([rows]) => {
            console.log ('\n');
            console.log(c_table.getTable(rows))
        }).then (() => {
            entryRequest();
        }).catch((err) => {
            console.log(err);
        });
    });
}

const view_employees_by_manager = async () => {
    const manager_arr = await entries.managerChoices();
    const manager = await inquirer.prompt([
        {
            type: "list",
            name: "manager_id",
            message: "Which manager would you like to view?",
            choices: manager_arr,
            loop: false,
        }
    ]).then((data) => {
    sql.get_employees_by_manager_id(manager).then(([rows]) => {
            console.log ('\n');
            console.log(c_table.getTable(rows))
        }).then (() => {
            entryRequest();
        }).catch((err) => {
            console.log(err);
        });
    });
}

entryRequst = () => {
    inquirer.prompt([
        {
            type: "list",
            name: "entry_request",
            message: "What would you like to do?",
            choices: [
                        'Add Department',
                        'Add Role',
                        'Add Employee',
                        'Update Employee Role',
                        'Update Employee Manager',
                        'Remove Employee',
                        'View Departments',
                        'View Roles',
                        'View Employees',
                        'View Budget',
                        'View Employees by Department',
                        'View Employees by Manager',
                        'View Department Budget',
            ],
            loop: false,
        }
    ]).then((data) => {
        const {request} = data;
        console.log(request);
        switch (request) {
            case 'Add Department': new_Department();
            break;
            case 'Add Role': new_role();
            break;
            case 'Add Employee': new_employee();
            break;
            case'Update Employee Role': update_employee_role();
            break;
            case 'Update Employee Manager': update_employee_manager();
            break;
            case 'Remove Employee': delete_employee();
            break;
            case 'View Departments': view_departments();
            break;
            case 'View Roles': view_roles();
            break;
            case 'View Employees': view_employees();
            break;
            case 'View Budget': view_budget();
            break;
            case 'View Employees by Department': view_employees_by_department();
            break;
            case 'View Employees by Manager': view_employees_by_manager();
            break;
            case 'View Department Budget': view_budget();
            break;
            default: console.log("Invalid entry");
            break;
        }
    })
}


entryRequest();

}

