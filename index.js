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
            name: 'userChoice',
            type: 'list',
            message: 'Pick an option',
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
        switch (answer.userChoice) {
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

const addDepartment = async () => {
    try {
        console.log("Add a department");

        let answer = await inquirer.prompt([
            {
                name: 'departmentName',
                type: 'input',
                message: 'What is your department called?'
            }
        ]);

        let results = await connection.query("INSERT INTO department SET ?", {
            name: answer.departmentName
        });

        console.log(`${answer.departmentName} added to departments.`)
        promptMessages();

    } catch (err) {
        console.log(err);
        promptMessages();
    };
}

const addEmployee = async () => {
    try {
        console.log('Add an employee');

        let roles = await connection.query("SELECT * FROM role");

        let managers = await connection.query("SELECT * FROM employee");

        let answer = await inquirer.prompt([
            {
                name: 'firstName',
                type: 'input',
                message: "What is the employees first name?"
            },
            {
                name: 'lastName',
                type: 'input',
                message: "What is the employees last name?"
            },
            {
                name: 'employeeRoleId',
                type: 'list',
                choices: roles.map((role) => {
                    return {
                        name: role.title,
                        value: role.id
                    }
                }),
                message: "Please enter employees role ID"
            },
            {
                name: 'employeeManagerId',
                type: 'list',
                choices: managers.map((manager) => {
                    return {
                        name: manager.first_name + " " + manager.last_name,
                        value: manager.id
                    }
                }),
                message: "Please enter employees manager ID?"
            }
        ])

        let results = await connection.query("INSERT INTO employee SET ?", {
            first_name: answer.firstName,
            last_name: answer.lastName,
            role_id: (answer.employeeRoleId),
            manager_id: (answer.employeeManagerId)
        });

        console.log(`${answer.firstName} ${answer.lastName} added to employees.`);
        promptMessages();

    } catch (err) {
        console.log(err);
        promptMessages();
    };
}

const addRole = async () => {
    try {
        console.log('Add role');

        let departments = await connection.query("SELECT * FROM department")

        let answer = await inquirer.prompt([
            {
                name: 'roleTitle',
                type: 'input',
                message: 'What is the new role called?'
            },
            {
                name: 'salary',
                type: 'input',
                message: 'What is this roles salary?'
            },
            {
                name: 'departmentId',
                type: 'list',
                choices: departments.map((departmentId) => {
                    return {
                        name: departmentId.name,
                        value: departmentId.id
                    }
                }),
                message: 'What department ID is this role associated with?',
            }
        ]);
        
        let selectedDepartment;
        for (i = 0; i < departments.length; i++) {
            if(departments[i].department_id === answer.choice) {
                selectedDepartment = departments[i];
            };
        }
        let results = await connection.query("INSERT INTO role SET ?", {
            roleTitle: answer.roleTitle,
            salary: answer.salary,
            department_id: answer.departmentId
        })

        console.log(`${answer.roleTitle} role added successfully.`)
        promptMessages();

    } catch (err) {
        console.log(err);
        promptMessages();
    };
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

        console.log(`Employee role updated`);
        promptMessages();

    } catch (err) {
        console.log(err);
        promptMessages();
    };
}

