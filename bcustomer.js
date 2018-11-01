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

function database() {
    //con.connect(function (err) {
    //    if (err) throw err;
    //con.query("USE bamazon", function (err, result) {
    //    if (err) throw err;
    //});
    //    con.query("SELECT * FROM products", async function (err, result) {
    con.query("SELECT * FROM products", function (err, result) {
        if (err) throw err;
        result.forEach(element => {
            console.log(`Product: ${element.item_id} ${element.product_name} $${element.price}`);
        })
        inquirer.prompt([{
                type: "prompt",
                name: "idToBuy",
                message: "Which product ID would you like?"
            },
            {
                type: "prompt",
                name: "howMany",
                message: "And how many would you like?"
            }
        ]).then(userChoice => {
            //go through result looking for matching product ID
            // can't use id as the array index because a product might have been removed.
            var bFoundIt = false;
            for (let i = 0; i < result.length; i++) {
                //            console.log (result[i].item_id + ' ' + userChoice.idToBuy);
                if (result[i].item_id === parseInt(userChoice.idToBuy)) {
                    //check the quantity available
                    bFoundIt = true;
                    const remaining = result[i].stock_quantity - userChoice.howMany;
                    if (remaining >= 0) {
                        // if enough, update quantity in db, show customer total cost
                        //                        let left = result[i].stock_quantity - userChoice.howMany;
                        const totalPrice = parseFloat(Math.round(result[i].price * userChoice.howMany * 100) / 100).toFixed(2);
                        //                        con.query(`UPDATE products SET stock_quantity = ${left} WHERE item_id = ${result[i].item_id}`);
                        const item = result[i].item_id;
                        query = con.query(`UPDATE products SET stock_quantity = stock_quantity - ${userChoice.howMany} WHERE item_id = ${item};`,
                            function (err, result) {
                                if (err) throw err;
                                console.log(`Total price: $${totalPrice}`);
                                query = con.query(`UPDATE products SET product_sales = product_sales + ${totalPrice} WHERE item_id = ${item};`,
                                    function (err, result) {
//                                        console.log(query);
                                        process.exit();
                                    });
                                //                                console.log (query);
                            });
                    } else {
                        // else refuse order, quit
                        console.log("Sorry.  We don't have enough for that order.");
                        console.log(`Only ${result[i].stock_quantity} on hand.`);
                        process.exit();
                    }
                    break;
                }
            }
            if (!bFoundIt) {
                console.log("Can't find product");
                process.exit();
            }
        });
    });
}