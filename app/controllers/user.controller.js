const db = require("../model");
const { createUserValidation } = require("../validate/validate");
const User = db.users;
const Op = db.Sequelize.Op;
// Create and Save a new user
exports.create = (req, res) => {
    const { name, phoneNumber, reportingManager } = req.body
    const user = {
        name,
        phoneNumber,
        reportingManager
    };
    let response = createUserValidation(user);
    if (response.error) {
        return res.status(400).send({ errorMessage: response.error.details[0].message });

    } else {
        User.create(user)
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while creating the user."
                });
            });
    }
};
// Retrieve all users from the database
exports.findAll = async (req, res) => {

    await User.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
            });
        });
};
// Find a single Product with an id
exports.findOne = (req, res) => {
    const { id } = req.params;
    User.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find user with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving user with id=" + id
            });
        });

};
// Update a Tutorial by the id in the request
exports.update = (req, res) => {
    const { id } = req.params;
    User.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "user was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update user with id=${id}. Maybe user was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating user with id=" + id
            });
        });
};
// Delete a Product with the specified id in the request
exports.delete = (req, res) => {
    const { id } = req.params;
    User.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "user was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete user with id=${id}. Maybe user was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete user with id=" + id
            });
        });
};
// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
    User.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} users were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all users."
            });
        });
};
