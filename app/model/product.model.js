module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define("product", {
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
        cost: {
            type: Sequelize.INTEGER
        },

    });

    return Product;
};