//var mysql = require('mysql2/promise');
var mysql = require('mysql');
var inquirer = require('inquirer');


var con = mysql.createConnection({
    database: "bamazon",
    host: "localhost",
    user: "root",
    password: "0921"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("connected as id ", con.threadId)
})

database();


const mgrChoices = [{
        name: 'View Products for Sale',
        value: 0
    },
    {
        name: 'View Low Inventory',
        value: 1
    },
    {
        name: 'Add to Inventory',
        value: 2
    },
    {
        name: 'Add New Product',
        value: 3
    },
    {
        name: 'Quit',
        value: 4
    }
];

function database() {
    con.query("SELECT * FROM products", function (err, result) {
        if (err) throw err;
        inquirer.prompt([{
            message: 'What would you like to do?',
            name: 'userChoice',
            type: 'rawlist',
            choices: mgrChoices
        }]).then(choice => {
            switch (choice.userChoice) {
                case 0:
                    console.log('Products:');
                    result.forEach(element => {
                        console.log(`${element.item_id} ${element.product_name} $${element.price} ${element.stock_quantity}`);
                    });
                    database();
                    break;
                case 1:
                    // view low inventory
                    console.log("Low inventory:");
                    result.forEach(element => {
                        if (element.stock_quantity < 15) {
                            console.log(`Product: ${element.product_name} In stock: ${element.stock_quantity}`)
                        }
                    });
                    database();
                    break;
                case 2:
                    // add to inventory
                    inquirer.prompt([{
                            message: "Product ID to add:",
                            name: 'addProd',
                            type: 'input',
                            validate: function (productId) {
                                //                                console.log (productId, ' ', result.length, ' ', Number.isInteger(parseInt (productId)));
                                if (Number.isInteger(parseInt(productId)) && productId >= 0 && productId < result.length) {
                                    return true;
                                }
                                return (`Enter a number between 0 and ${result.length - 1}`);
                            }
                        },
                        {
                            message: "How many?",
                            type: 'input',
                            name: 'qtyToAdd',
                            validate: function (toAdd) {
                                if (Number.isInteger(parseInt(toAdd)) && toAdd >= 0 && toAdd < 1000) {
                                    return true;
                                }
                                return (`That's too many!  We won't have room for them!`);
                            }
                        }

                    ]).then(choices => {
                        con.query(`UPDATE products SET stock_quantity = stock_quantity + ${choices.qtyToAdd} WHERE item_id = ${choices.addProd}`);
                        console.log('Added');
                        database();
                    });
                    break;
                case 3:
                    addProduct();
                    break;
                case 4:
                    process.exit();
                    break;
            }
        });
    });
}

function addProduct() {
    con.query(`SELECT * from departments`, (err, results) => {
        const deptList = results;
        inquirer.prompt([{
                message: "Product to add:",
                name: 'productName',
                type: 'input'
            },
            {
                message: "Into which department?",
                type: 'input',
                name: 'dept',
                validate: function (deptName) {
                    // Look up and make sure it exists
                    for (let i = 0; i < results.length; i++) {
                        if (deptList[i].department_name === deptName) {
                            return true;
                        }
                    }
                    return (`That department doesn't exist!`);
                }
            },
            {
                message: "How many?",
                type: 'input',
                name: 'qtyToAdd',
                validate: function (toAdd) {
                    if (Number.isInteger(parseInt(toAdd)) && toAdd >= 0 && toAdd < 1000) {
                        return true;
                    }
                    return (`That's too many!  We won't have room for them!`);
                }
            },
            {
                message: "What wiil the price be?",
                type: 'input',
                name: 'price',
                validate: function (price) {
                    price = +price;
                    if (isNaN(price)) {
                        return ('Enter a valid price!');
                    }
                    return (true);
                }
            }
        ]).then(choices => {
            let values = [choices.productName, choices.dept, choices.qtyToAdd, choices.price];
            query = con.query(`INSERT INTO products (product_name, department_name, stock_quantity, price) VALUES (?)`, [values]);
            //                        query = con.query(`INSERT INTO products (product_name, department_name, stock_quantity, price) VALUES ('${choices.productName}', '${choices.dept}', ${choices.qtyToAdd}, ${choices.price})`);
            //                        console.log(query);
            database();
        });
    });
}