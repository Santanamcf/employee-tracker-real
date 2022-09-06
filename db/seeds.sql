USE employees_db;

INSERT INTO department (name)
VALUES ('Sales');
INSERT INTO department (name)
VALUES ('Engineering');
INSERT INTO department (name)
VALUES ('Finance');
INSERT INTO department (name)
VALUES ('Legal');

INSERT INTO role (title, salary, department_id)
VALUES ('Sales Lead', 100000, 1);
INSERT INTO role (title, salary, department_id)
VALUES ('Salesperson', 80000, 1);
INSERT INTO role (title, salary, department_id)
VALUES ('Lead Engineer', 150000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ('Software Engineer', 1250000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ('Account Manager', 160000, 3);
INSERT INTO role (title, salary, department_id)
VALUES ('Lawyer', 190000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Mike', 'James', 1, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Ashley', 'Rodriguez', 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Kathy','Ramirez', 3, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Kevin', 'Tupik', 4, 3);
