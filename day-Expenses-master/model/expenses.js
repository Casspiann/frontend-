const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Expense= sequelize.define('expenses', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    expenceAmmount: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING, // Assuming a decimal data type with 10 total digits and 2 decimal places
        allowNull: false
    },
    category: {
        type: Sequelize.STRING,
       // allowNull: false
    }
});

module.exports = Expense;