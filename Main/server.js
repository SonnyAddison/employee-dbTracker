const express = require("express");
const inquirer = require("inquirer");
const clear = require("clear");
const sql = require("mysql2");
const util = require("util");
const { viewEntry } = require("./controls/view")
const { addEntry } = require("./controls/add")
const { updateEntry } = require("./controls/update")


const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connection = sql.createConnection({
  host: "localhost",
  user: "root",
  password: "Diego01$onny",
  database: "hr_db"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");

  clear();
  initiate();
});

connection.query = util.promisify(connection.query);


initiate = () => {
  inquirer.prompt([
    {
      name: "select",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View an Entry",
        "Add an Entry",
        "Update an Entry",
        "Exit Program"
      ]
    }
  ]).then(answer => {
      if (answer.select === "View an Entry"){
        viewEntry();
      }
      else if (answer.select === "Add an Entry"){
        addEntry();
      }  
      else if (answer.select === "Update an Entry"){
        updateEntry();
      }
      else if (answer.select === "Exit Program"){
        exit();
      }
  });

}

exit = () => {
  process.exit();
}


