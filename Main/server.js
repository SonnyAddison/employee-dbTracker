const inquirer = require("inquirer");
const table = require("console.table");
const sql = require("./db_query.js");
const entries = require("./entries.js");


//Question for the user to select the action they want to perform

// Departments
const new_Department = async () => {
    const department = await inquirer.prompt([
        {
            type: "list";
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
            message: "What is the employee's first name?"
            validate: (first_name) => {
                if (first_name && isNaN(first_name)) {
                    return true;
                } else {
                    console.log("Please enter a valid first name");
                        return false;
                }
            }
        }
        {
            type: "input",
            name: "last_name",
            message: "What is the employee's last name?"
            validate: (last_name) => {
                if (last_name && isNaN(last_name)) {
                    return true;
                } else {
                     console.log("Please enter a valid last name");
                        return false;
                }
            }
        }
        {
            type: "list",
            name: "role_id",
            message: "What is the employee's role?",
            choices: role_arr
            loop: false,
        }
        {
            type: "list",
            name: "manager_id",
            message: "Who is the employee's manager?",
            choices: manager_arr
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
            message: "What is the role's title?"
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
            message: "What is the role's salary?"
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


