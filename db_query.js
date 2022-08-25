// building query for db

const db = require('./config/connection');

class DBQuery {
    constructor(db) {
        this.db = db;
    }

    add_department(data) {
        const values = [data.name];
        return this.db
        .promise()
        .query(`INSERT INTO department (name) VALUES (?)`, values);
    }
    add_role(data) {
        const values = [data.title, data.salary, data.department_id];
        return this.db
        .promise()
        .query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, values);
    }
    add_employee(data) {
        const values = [data.first_name, data.last_name, data.role_id, data.manager_id];
        return this.db
        .promise()
        .query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, values);
    }
    delete_employee(data) {
        const values = [data.emp_id];
        return this.db
        .promise()
        .query(`DELETE FROM employee WHERE id = ?`, values);
    }
    update_employee_role(data) {
        const values = [data.role_id, data.employee_id];
        return this.db
        .promise()
        .query(`UPDATE employee SET role_id = ? WHERE id = ?`, values);
    }
    update_employee_manager(data) {
        const values = [data.manager_id, data.emp_id];
        return this.db
        .promise()
        .query(`UPDATE employee SET manager_id = ? WHERE id = ?`, values);
    }
    get_all_departments() {
        return this.db
        .promise()
        .query(`SELECT * FROM department`);
    }
    get_employee_by_department(data) {
        const values = [data.department_id];
        return this.db
        .promise()
        .query(`SELECT e.first_name AS 'First Name', e.last_Name AS 'Last Name', d.department_name AS 'Department' FROM employee e INNER JOIN role r ON e.role_id = r.id INNER JOIN department d ON r.department_id =d.id WHERE d.id = ?`, values);
    }
    get_employee_by_manager(data) {
        const values = [data.manager_id];
        return this.db
        .promise()
        .query(`SELECT e.first_name AS 'First Name', e.last_Name AS 'Last Name', CONCAT (manager.first_name ' ', manager.last_name) AS Manager FROM employee e INNER JOIN employee manager ON e.manager_id =mgmt.id WHERE e.manager_id = ?`, values);
    }
    get_budget_by_department() {
        return this.db
        .promise()
        .query(`SELECT d.department_name AS "Department", SUM(r.salary) AS "Budget" FROM role r INNER JOIN department d ON r.department_id = d.id GROUP BY department_name`);
    }
    get_roles() {
        return this.db
        .promise()
        .query(`SELECT * r.title AS Title, r.salary AS Salary, d.department_name AS Department FROM role r LEFT JOIN department d ON r.department_id = d.id ORDER BY Department, r.id ASC`);
    }
    get_role_by_id() {
        return this.db
        .promise()
        .query(`SELECT * FROM role`);
    }
    get_employees() {
        return this.db
        .promise()
        .query (`SELECT e.id as 'Employee_ID', e.first_name AS 'First_Name', e.last_name AS 'Last_Name', department.department_name AS Department, role.salary AS Salary, role.title AS Role,
        CONCAT(mgmt.first_name,' ',mgmt.last_name) as Manager FROM employee e LEFT JOIN employee mgmt ON e.manager_id = mgmt.id  INNER JOIN role ON e.role_id = role.id  LEFT JOIN department  ON role.department_id = department.id ORDER BY e.id;.`);
    }
    get_managers() {
        return this.db
        .promise()
        .query(`SELET id, CONCAT(first_name,' ',last_name) AS Name FROM employee WHERE manager_id IS NULL`);
    }

}

module.exports = new DBQuery(db);
