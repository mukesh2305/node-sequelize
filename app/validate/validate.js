const Joi = require("joi");
module.exports = {
    createOrderValidation: (orderData) => {

        const JoiSchema = Joi.object({
            quantity: Joi.number().integer().strict().required(),
            cost: Joi.number().integer().strict().required(),
            productId: Joi.number().integer().strict().required(),
            userId: Joi.number().integer().strict().required(),
        }).options({ abortEarly: false });

        return JoiSchema.validate(orderData)
    },

    createUserValidation: (productData) => {

        const JoiSchema = Joi.object({
            name: Joi.string().required(),
            phoneNumber: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
            reportingManager: Joi.string().required(),
        }).options({ abortEarly: false });

        return JoiSchema.validate(productData)
    },

    createProductValidation: (userData) => {

        const JoiSchema = Joi.object({
            name: Joi.string().required(),
            cost: Joi.number().integer().strict().required(),
        }).options({ abortEarly: false });

        return JoiSchema.validate(userData)
    },

    reportByUserAndProductValidation: (reportData) => {

        const JoiSchema = Joi.object({
            startDate: Joi.date().required(),
            endDate: Joi.date().required(),
        }).options({ abortEarly: false });

        return JoiSchema.validate(reportData)
    },
}