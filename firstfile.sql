USE animals_db;


CREATE TABLE people (
	name VARCHAR(30) NOT NULL,
    has_pet BOOLEAN NOT NULL,
    pet_name VARCHAR(30),
    pet_age INTEGER (10)
);


CREATE DATABASE favorite_db;

USE favorite_db;

CREATE TABLE favorite_foods (
	food VARCHAR(30),
    score INTEGER (3)
);

CREATE TABLE favorite_songs (
	song VARCHAR(30) NOT NULL,
    artist VARCHAR(30),
    score INTEGER(3)
);

CREATE TABLE favorite_movies (
	id INTEGER AUTO_INCREMENT PRIMARY KEY NOT NULL,
    movie VARCHAR (50) NOT NULL,
    five_times BOOLEAN DEFAULT false,
    score INTEGER(3)
);

CREATE database bamazon;


INSERT INTO people (name, has_pet, pat_name, pet_age)
VALUES ("Ian", true, "Marcel", 10);

SELECT * from people WHERE (name = "xxx");
SELECT namee, has_pet from people WHERE (name = "xxx");

USE favorite_db;
INSERT into favorite_foods (food, score) VALUES ("chocolate", 10);
INSERT into favorite_songs (song, artist, score) VALUES ("Yellow submarine", "Beatle", 8);
INSERT into favorite_movies (movie, score) VALUES ("Sound of music", 6);
SELECT * from favorite_movies;

delete FROM favorite_movies WHERE id=2;

USE bamazon;

CREATE TABLE products (
	item_id INTEGER AUTO_INCREMENT PRIMARY KEY NOT NULL,
    product_name VARCHAR(40),
    department_name VARCHAR(30),
    price FLOAT,
    stock_quantity INTEGER (4)
    );
    
INSERT into products (product_name, department_name, price, stock_quantity)
	VALUES ("SQL for Mere Mortals", "books", 20.95, 20);
INSERT into products (product_name, department_name, price, stock_quantity)
	VALUES ("Nescafe Instant Coffee", "food", 4.99, 50);
INSERT into products (product_name, department_name, price, stock_quantity)
	VALUES ("Panasonic DMC-FZ28", "electronics", 499, 10);
INSERT into products (product_name, department_name, price, stock_quantity)
	VALUES ("Brinkmannn FL1", "electronics", 90.95, 30);
INSERT into products (product_name, department_name, price, stock_quantity)
	VALUES ("Fascinating F1 Facts", "books", 14.95, 25);
INSERT into products (product_name, department_name, price, stock_quantity)
	VALUES ("Raisins", "food", 3.45, 85);
INSERT into products (product_name, department_name, price, stock_quantity)
	VALUES ("hammer", "tools", 12.95, 15);
INSERT into products (product_name, department_name, price, stock_quantity)
	VALUES ("tenon saw", "tools", 18.95, 28);
INSERT into products (product_name, department_name, price, stock_quantity)
	VALUES ("Philips screwdriver", "tools", 7.99, 60);
INSERT into products (product_name, department_name, price, stock_quantity)
	VALUES ("The Miracle of New Orleans", "books", 15.95, 20);
    
