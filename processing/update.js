

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
            sequelize.query(
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
            sequelize.query(
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
            sequelize.query(
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
            sequelize.query(
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

module.exports = update;