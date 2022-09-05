const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');
const util = require('util');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employees_db'
})

connection.query = util.promisify(connection.query)
connection.connect(function(err){
    if (err) {
        return console.error("error" + err.message)
    }
    console.log('Connected to server')

    promptMessages();
})

const promptMessages = async () => {
    try {
        let answer = await inquirer.prompt({
            name: 'action',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                'View Employees',
                'View Departments',
                'View Roles',
                'Add Employees',
                'Add Departments',
                'Add Roles',
                'Update Employee Role',
                'Exit'
            ]
        });
        switch (answer.action) {
            case 'View Employees':
                employeeView();
                break;

            case 'View Departments':
                departmentView();
                break;

            case 'View Roles':
                roleView();
                break;

            case 'Add Employees':
                employeeAdd();
                break;

            case 'Add Departments':
                departmentAdd();
                break;

            case 'Add Roles':
                roleAdd();
                break;

            case 'Update Employee Role':
                employeeUpdate();
                break;

            case 'Exit':
                connection.end();
                break;
        }
    } catch (err) {
        console.log(err);
        promptMessages();
    }
}

const viewEmployees = async () => {
    console.log('Employees');
    try {
        let query = 'SELECT employee.id, employee.first_name, employee.last_name, role.title, manager.first_name AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN employee manager ON manager.id = employee.manager_id;';
        connection.query(query, function (err, res) {
            if (err) throw err;
            let allEmployees = [];
            res.forEach(employee => allEmployees.push(employee));
            console.table(allEmployees);
            promptMessages();
        });
    } catch (err) {
        console.log(err);
        promptMessages();
    }
}

const viewDepartments = async () => {
    console.log('Departments');
    try {
        let query = 'SELECT * FROM department';
        connection.query(query, function (err, res) {
            if (err) throw err;
            let allDepartments = [];
            res.forEach(department => allDepartments.push(department));
            console.table(allDepartments);
            promptMessages();
        });
    } catch (err) {
        console.log(err);
        promptMessages();
    }
}

const viewRoles = async () => {
    console.log('Roles');
    try {
        let query = 'SELECT role.id, role.title, role.salary, department.name AS department FROM role LEFT JOIN department ON role.department_id = department.id';
        connection.query(query, function (err, res) {
            if (err) throw err;
            let allRoles = [];
            res.forEach(role => allRoles.push(role));
            console.table(allRoles);
            promptMessages();
        });
    } catch (err) {
        console.log(err);
        promptMessages();
    };
}

const updateEmployee = async () => {
    try {
        console.log('Update Employee');
        
        let employees = await connection.query("SELECT * FROM employee");

        let selectedEmployee = await inquirer.prompt([
            {
                name: 'employee',
                type: 'list',
                choices: employees.map((employeeName) => {
                    return {
                        name: employeeName.first_name + " " + employeeName.last_name,
                        value: employeeName.id
                    }
                }),
                message: 'choose an employee to update.'
            }
        ]);

        let roles = await connection.query("SELECT * FROM role");

        let selectedRole = await inquirer.prompt([
            {
                name: 'role',
                type: 'list',
                choices: roles.map((roleName) => {
                    return {
                        name: roleName.title,
                        value: roleName.id
                    }
                }),
                message: 'Update the role of selected employee'
            }
        ]);

        let results = await connection.query("UPDATE employee SET ? WHERE ?", [{ role_id: selectedRole.role }, { id: selectedEmployee.employee }]);

        console.log(`The role was successfully updated.`);
        promptMessages();

    } catch (err) {
        console.log(err);
        promptMessages();
    };
}

