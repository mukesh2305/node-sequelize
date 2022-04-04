const db = require("./index.js");
const Order = db.orders;
module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        id: {
            field: 'id',
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false,
            unique: true,
            autoIncrement: true,
        },
        name: {
            type: Sequelize.STRING
        },
        phoneNumber: {
            type: Sequelize.STRING
        },
        reportingManager: {
            type: Sequelize.STRING
        }
    });

    return User;
};