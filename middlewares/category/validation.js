const joi = require('joi')

module.exports.validateCategory = (req, res, next) => {
    const schema = joi.object({
        name: joi.string().required()
    })
    const {error} = schema.validate(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    next()
}