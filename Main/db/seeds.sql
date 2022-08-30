INSERT INTO department (department_name)
VALUES ("Sales"),
       ("Engineering"),
       ("Finance"),
       ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Associate", 1000, 1),
       ("Senior Sales Associate", 2000, 1),
       ("Sales Manager", 3000, 1),
       ("Software Engineer", 2500, 2),
       ("Software Engineer II", 3000, 2),
       ("Lead Software Engineer", 4000, 2),
       ("Software Manager", 5000, 2),
       ("Accountant", 2500, 3),
       ("Clerk", 1000, 3),
       ("Attorney", 2500, 4),
       ("Lead Attorney", 3000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Mike", "Chan", 1, NULL),
       ("Ashley", "Rodriguez", 2, 2),
       ("Kevin", "Tupik", 2, Null),
       ("Kumal", "Singh", 2, Null),
       ("Malia", "Brown", 3, 1),
       ("Sarah", "Lourd", 4, 4),
       ("tom" , "Allen", 4, Null);