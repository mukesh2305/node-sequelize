const User = require('./user.model');
const Product = require('./product.model');

// var schema = new parquet.ParquetSchema({
//     book_id: { type: 'UTF8' },
//     book_id_bn: { type: 'UTF8' },
//     company: { type: 'UTF8' },
//     store_number: { type: 'UTF8' },
//     unit_number: { type: 'UTF8' },
//     list_price: { type: 'UTF8' },
//     status: { type: 'UTF8' },
//     last_update: { type: 'UTF8' },
//     file_date: { type: 'UTF8' }
// });
// name
// quantity
// price
// date
// in_stock

module.exports = (sequelize, Sequelize) => {
    const Parquet = sequelize.define("parquet", {
        book_id: {
            type: Sequelize.STRING,
            unique: true
        },
        book_id_bn: {
            type: Sequelize.STRING,
        },
        company: {
            type: Sequelize.STRING,
        },
        store_number: {
            type: Sequelize.STRING,
        },
        unit_number: {
            type: Sequelize.STRING,
        },
        list_price: {
            type: Sequelize.STRING,
        },
        status: {
            type: Sequelize.STRING,
        },
        last_update: {
            type: Sequelize.STRING,
        },
        file_date: {
            type: Sequelize.STRING,
        },
        createdAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        updatedAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        }

    });

    return Parquet;
};