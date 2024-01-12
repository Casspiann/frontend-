/*const mysql = require('mysql2');

const pool = mysql.createPool({
    host:'localhost',
    user:'root',
    database:'daytodayexpenses',
    password:"Tarun@123"

})
module.exports = pool.promise();*/


const Sequelize = require('sequelize');

// Create a Sequelize instance and specify your database connection details
const sequelize = new Sequelize('daytodayexpenses', 'root', 'Tarun@123', {
  dialect: 'mysql',
  host: 'localhost',
});

// Test the database connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;