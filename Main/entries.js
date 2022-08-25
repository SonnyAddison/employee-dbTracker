const sql = require("./db_query.js");

// Calling the database and passing through inquirer

const dep_entry = async () => {
    const temp_arr = await sql.get_departments();

    const entries = temp_arr[0];

    let entry_arr = [];

    entries.forEach(element => {
        let valueObj = {
            name: element.department_name,
            value: element.id
        }
        entry_arr.push(valueObj);
    })
    return entry_arr;
}

const mgmt_entry = async () => {
    const temp_arr = await sql.get_managers();

    const entries = temp_arr[0];

    let entry_arr = [];

    entries.forEach(element => {
        let valueObj = {
            name: element.manager_name,
            value: element.id
        }
        entry_arr.push(valueObj);
    })

    return entry_arr;
}

const role_entry = async () => {
    const temp_arr = await sql.get_roles();

    const entries = temp_arr[0];

    let entry_arr = [];

    entries.forEach(element => {
        let valueObj = {
            name: element.title,
            value: element.id
        }
        entry_arr.push(valueObj);
    })

    return entry_arr;
}

const emp_entry = async () => {
    const temp_arr = await sql.get_employees();

    const entries = temp_arr[0];

    let entry_arr = [];

    entries.forEach(element => {
        let valueObj = {
            name: element.first_name + " " + element.last_name,
            value: element.id
        }
        entry_arr.push(valueObj);
    })

    return entry_arr;
}

module.exports = { dep_entry, mgmt_entry, role_entry, emp_entry };