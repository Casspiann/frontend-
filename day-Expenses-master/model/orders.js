const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Order = sequelize.define('order', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    paymentid: {
        type: Sequelize.STRING // Fixed the typo here
    },
    orderid: {
        type: Sequelize.STRING // Fixed the typo here
    },
    status: {
        type: Sequelize.STRING // Fixed the typo here
    }
});

module.exports = Order;






