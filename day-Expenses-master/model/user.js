const Sequelize = require('sequelize');
const sequelize = require('../util/database'); // Make sure the path is correct

const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false // This column is not nullable
 
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false // This column is not nullable
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false // This column is not nullable
    },
    ispremiumuser:{
        type:Sequelize.BOOLEAN
    },
    totalExpenses:{
        type:Sequelize.INTEGER,
        defaultValue:0
    }
});

module.exports = User;
