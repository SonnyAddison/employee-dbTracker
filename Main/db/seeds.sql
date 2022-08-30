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

INSERT INTO employee (first_name, last_name, role_id, manager_name)
VALUES ("Mike", "Chan", 1, "Sonny Addison"),
       ("Ashley", "Rodriguez", 2, "Sonny Addison"),
       ("Sonny", "Addison", 3, "N/A"),
       ("Kevin", "Tupik", 4, "Kumal Singh"),
       ("Kumal", "Singh", 7, "N/A"),
       ("Malia", "Brown", 8, "N/A"),
       ("Sarah", "Lourd", 10, "Tom Allen"),
       ("Tom" , "Allen", 11, "N/A");