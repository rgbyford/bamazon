var mysql = require('mysql');
var inquirer = require('inquirer');

const cTable = require('console.table');
// const table = cTable.getTable([{
//     name: 'foo',
//     age: 10
// }, {
//     name: 'bar',
//     age: 20
// }]);

// console.log(table);

// prints
// name  age
// ----  ---
// foo   10
// bar   20

var con = mysql.createConnection({
    database: "bamazon",
    host: "localhost",
    user: "root",
    password: "0921"
});

con.connect(function (err) {
    if (err) throw err;
    //    console.log("connected as id ", con.threadId)
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
                let i = 1;
                con.query (`SELECT departments.*, SUM(products.product_sales) AS sales, ` +
                `SUM(products.product_sales) - over_head_costs AS profit FROM departments INNER JOIN `+
//                con.query (`SELECT departments.*, over_head_costs, SUM(products.product_sales) AS sales FROM departments INNER JOIN `+
                `products ON departments.department_name = products.department_name GROUP BY ` +
                `departments.department_id`,  (err, results) => {
                    console.log (results);
                    const table = cTable.getTable (results);
                    console.log (table);
                    database();
                });
                // con.query(`SELECT * FROM departments;`, (err, depts) => {
                //     if (err) throw err;
                //     const tableData = [];
                //     for (let i = 0; i < depts.length; i++) {
                //         const name = depts[i].department_name;
                //         const overhead = depts[i].over_head_costs;
                //         const rowData = {};
                //         const deptId = i;
                //         query = con.query(`SELECT product_sales FROM products WHERE department_name = '${depts[i].department_name}';`, (err, sales) => {
                //             if (err) throw err;
                //             let deptSales = 0;
                //             for (let j = 0; j < sales.length; j++) {
                //                 deptSales += sales[j].product_sales;
                //             }
                //             rowData.dept_id = deptId;
                //             rowData.dept_name = name;
                //             rowData.ovhd = overhead;
                //             rowData.sales = deptSales;
                //             tableData.push(rowData);
                //             if (i === depts.length - 1) {
                //                 const table = cTable.getTable(tableData);
                //                 console.log(table);
                //                 database();
                //             }
                //         });
                //     }
                // });
                break;
            case 1:
                // new department
                console.log ("No instructions for that!");
                database();
                break;
            case 2:
                process.exit();
                break;
        }
    });
}