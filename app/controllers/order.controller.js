const db = require("../model");
const { createOrderValidation, reportByUserAndProductValidation } = require('../validate/validate')

const Order = db.orders;
const Product = db.products;
const User = db.users;
const Parquet = db.parquets;
const sequelize = require('sequelize');
const parquet = require('parquetjs-lite')
// const valueFile = require("./test1.parquet")

const Op = db.Sequelize.Op;
exports.insertData = async (req, res) => {

    // const AWS = require('aws-sdk');
    // const client = new AWS.S3({
    //   accessKeyId: 'xxxxxxxxxxx',
    //   secretAccessKey: 'xxxxxxxxxxx'
    // });

    // const params = {
    //   Bucket: 'xxxxxxxxxxx',
    //   Key: 'xxxxxxxxxxx'
    // };

    // let reader = await parquet.ParquetReader.openS3(client,params);

    try {
        let reader = await parquet.ParquetReader.openFile('test1.parquet');
        let cursor = reader.getCursor();
        let record = null;
        let flag = 0
        let query;
        while (record = await cursor.next()) {

            flag++;
            if (flag === 1) {
                query = "INSERT INTO parquets (book_id,book_id_bn, company, store_number,unit_number,list_price,status,last_update,file_date) VALUES"
            }
            query = `${query} ('${record.book_id}','${record.book_id_bn}', '${record.company}','${record.store_number}', '${record.unit_number}','${record.list_price}','${record.status}','${record.last_update}','${record.file_date}'),`
            if (flag === 100) {
                query = query.substring(0, query.length - 1);
                query += 'ON DUPLICATE KEY UPDATE book_id_bn = book_id_bn,unit_number = unit_number,list_price = list_price,status = status,last_update = last_update,file_date = file_date'
                let queryResult = await db.sequelize.query(
                    query,
                    {
                        model: Parquet,
                        mapToModel: true,
                        type: db.Sequelize.QueryTypes.INSERT,
                    });

                if (queryResult[queryResult.length - 1] > 0) {
                    console.log("Data inserted successfully");
                } else {
                    console.log("Data updated successfully");
                }
                flag = 0;
            }

        }

        res.send({
            message: "Data inserted successfully"
        });
        await reader.close();
    } catch (err) {
        console.log(err);
    }
}

// exports.insertData = async (req, res) => {
//     let recordValue = []
//     try {

//         let reader = await parquet.ParquetReader.openFile('test1.parquet');
//         let cursor = reader.getCursor();
//         let record = null;
//         let flag = 1
//         while (record = await cursor.next()) {

//             flag++;
//             recordValue.push(record)
//             if (flag > 4) {
//                 break;
//             }

//         }

//         // _____________________________________________________________
//         // let bookId = [];
//         // await Parquet.findAll({
//         //     attributes: ['book_id'],
//         // })
//         //     .then(data => {
//         //         bookId.push(data)
//         //     })
//         // let newBook_id = bookId[0].map(ele => ele.dataValues.book_id)
//         // // -------------------------------------------------------------
//         // recordValue = recordValue.filter((obj) => newBook_id.indexOf(obj.book_id) == -1);
//         // _____________________________________________________________
//         // book_id: book_id,
//         //         company: company,
//         //         store_number: store_number,
//         //         book_id_bn: book_id_bn,
//         //         unit_number: unit_number,
//         //         list_price: list_price,
//         //         status: status,
//         //         last_update: last_update,
//         //         file_date: file_date,

//         // let query = `INSERT INTO parquets (a,b,c) VALUES (1,2,3)  ON DUPLICATE KEY UPDATE c=c+1`
//         // totalEarnings = await db.sequelize.query(
//         //     query,
//         //     {
//         //         model: Parquet,
//         //         mapToModel: true,
//         //         type: db.sequelize.QueryTypes.INSERT,

//         //     });
//         // Parquet.bulkCreate(
//         //     recordValue,
//         //     {
//         //         updateOnDuplicate: ["book_id_bn", "list_price", "unit_number", "status", "last_update", "file_date"]
//         //     })
//         //     .then(data => {

//         //         res.send(
//         //             {
//         //                 message: "success",
//         //                 data
//         //             });
//         //     })
//         //     .catch(err => {
//         //         res.status(500).send({
//         //             message:
//         //                 err.message || "Some error occurred while creating the order."
//         //         });
//         //     });

//         // await Parquet.bulkCreate(recordValue).then(data => {
//         //     res.send(
//         //         {
//         //             message: "success",
//         //             data
//         //         });
//         // })
//         //     .catch(err => {
//         //         res.status(500).send({
//         //             message:
//         //                 err.message || "Some error occurred while creating the order."
//         //         });
//         //     });

//         await reader.close();
//         // ___________________________________________________________________
//     } catch (err) {
//         console.log(err);
//     }
// }


exports.updateData = (req, res) => {
    const book_id = req.params.book_id;
    Parquet.update(req.body, {
        where: { book_id: book_id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "order was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update order with id=${id}. Maybe order was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating order with id=" + id
            });
        });
};


exports.create = (req, res) => {
    const { quantity, cost, productId, userId } = req.body
    const order = {
        quantity, cost, productId, userId,
    };

    response = createOrderValidation(order)
    console.log(response)
    if (response.error) {
        return res.status(400).send({ errorMessage: response.error.details[0].message });

    } else {
        Order.create(order)
            .then(data => {
                res.send(
                    {
                        message: "success",
                        data
                    });
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while creating the order."
                });
            });
    }

}

// Retrieve all orders from the database
exports.findAll = async (req, res) => {

    // const title = req.query.title;
    // var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
    await Order.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Orders."
            });
        });
};
// Find a single Order with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Order.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find order with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving order with id=" + id
            });
        });

};
// Update a Order by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    Order.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            console.log(">>>>>>>>>>>>>>>>>>>>>", num)
            if (num == 1) {
                res.send({
                    message: "order was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update order with id=${id}. Maybe order was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating order with id=" + id
            });
        });
};
// Delete a Order with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    Order.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "order was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete order with id=${id}. Maybe order was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete order with id=" + id
            }); ``
        });
};
// Delete all Orders from the database.
exports.deleteAll = (req, res) => {
    Order.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} orders were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all orders."
            });
        });
};



exports.reportByProduct = (req, res) => {
    var { startDate, endDate } = req.body
    console.log("startDate", startDate)
    const dates = {
        startDate, endDate
    }
    let response = reportByUserAndProductValidation(dates)


    if (response.error) {
        return res.status(400).send({ errorMessage: response.error.details[0].message });
    } else {
        var startDate = new Date(startDate);
        var endDate = new Date(endDate);
        const condition = {
            attributes: [
                [sequelize.fn("sum", sequelize.col("quantity")), "total_quantity"],
                [sequelize.fn("sum", sequelize.col("order.cost")), "total_cost"],
                "productId",
            ],
            where: {
                createdAt: {
                    [Op.between]: [startDate, endDate]
                },
            },
            include: { model: Product, as: 'Product' },

            group: ["productId"],
        };
        Order.findAll(condition)
            .then(data => {
                res.send(data);

            }).catch(err => {
                console.log("error", err)
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while fetching all data."
                });
            });
    }
};

exports.reportByUser = (req, res) => {
    var { startDate, endDate } = req.body
    const dates = {
        startDate,
        endDate
    }

    let response = reportByUserAndProductValidation(dates)
    if (response.error) {
        return res.status(400).send({ errorMessage: response.error.details[0].message });
    } else {
        var startDate = new Date(startDate);
        var endDate = new Date(endDate);
        const condition = {
            attributes: [
                [sequelize.fn("sum", sequelize.col("quantity")), "total_quantity"],
                [sequelize.fn("count", sequelize.col("order.id")), "total_product_count"],
                "userId",
            ],
            where: {
                createdAt: {
                    [Op.between]: [startDate, endDate]
                },
            },
            include: { model: User, as: 'User' },

            group: ["userId"],
        };
        Order.findAll(condition)
            .then(data => {
                res.send(data);

            }).catch(err => {
                console.log("error", err)
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while fetching all data."
                });
            });
    }
};



// SELECT B.*,SUM(A.quantity) as total_quantity,SUM(A.cost) as total_cost FROM `orders` as A LEFT JOIN products as B ON A.productId=B.id GROUP by productId;

// SELECT B.*,SUM(A.quantity) as total_quantity,SUM(A.cost) as total_costquantity,COUNT(A.productId) as total_count FROM `orders` as A LEFT JOIN users as B ON A.userId=B.id GROUP by userId;

