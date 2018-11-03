var mysql = require('mysql');
var inquirer = require('inquirer');

const cTable = require('console.table');

var con = mysql.createConnection({
    database: "bamazon",
    host: "localhost",
    user: "root",
    password: "0921"
});

con.connect(function (err) {
    if (err) throw err;
});

database();

function database() {
    const supChoices = [{
            name: 'View Product Sales by Department',
            value: 0
        },
        {
            name: 'Create New Department',
            value: 1
        },
        {
            name: 'Quit',
            value: 2
        }
    ];
    inquirer.prompt([{
        message: 'What would you like to do?',
        name: 'userChoice',
        type: 'rawlist',
        choices: supChoices
    }]).then(choice => {
        switch (choice.userChoice) {
            case 0:
                // draw the table
                con.query(`SELECT departments.*, SUM(products.product_sales) AS sales, ` +
                    `SUM(products.product_sales) - over_head_costs AS profit FROM departments INNER JOIN ` +
                    `products ON departments.department_name = products.department_name GROUP BY ` +
                    `departments.department_id`, (err, results) => {
                        const table = cTable.getTable(results);
                        console.log(table);
                        database();
                    });
                break;
            case 1:
                // new department
                newDept();
                break;
            case 2:
                process.exit();
                break;
        }
    });
}

function newDept() {
    con.query(`SELECT * from departments`, (err, results) => {
        const deptList = results;
        inquirer.prompt([{
                message: "Department name:",
                name: 'deptName',
                type: 'input',
                validate: function (deptName) {
                    // Look up and make sure it doesn't exist
                    for (let i = 0; i < results.length; i++) {
                        if (deptList[i].department_name === deptName) {
                            return (`That department already exists!`);
                        }
                    }
                    return true;
                }
            },
            {
                message: 'Overhead costs:',
                name: 'deptOverhead',
                type: 'input',
                validate: function (deptOverhead) {
                    if (Number.isInteger(parseInt(deptOverhead))) {
                        return (true);
                    }
                    return ('Enter an integer value!');
                }
            }
        ]).then(choices => {
            const values = [choices.deptName, choices.deptOverhead];
            query = con.query(`INSERT INTO departments (department_name, over_head_costs) VALUES (?)`, [values]);
            console.log(`Created ${choices.deptName} department`);
            database();
        });
    });
    return;
}