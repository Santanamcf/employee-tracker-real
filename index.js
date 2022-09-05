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
            let employees = [];
            res.forEach(employee => employees.push(employee));
            console.table(employees);
            promptMessages();
        });
    } catch (err) {
        console.log(err);
        promptMessages();
    };
}

const viewDepartments = async () => {
    console.log('Departments');
    try {
        let query = 'SELECT * FROM department';
        connection.query(query, function (err, res) {
            if (err) throw err;
            let departments = [];
            res.forEach(department => departments.push(department));
            console.table(departments);
            promptMessages();
        });
    } catch (err) {
        console.log(err);
        promptMessages();
    };
}