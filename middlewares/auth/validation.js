const Joi = require('joi')

module.exports.registerValidate = (req, res, next) => {
    const registerSchema = Joi.object({
        name: Joi.string().min(4).required(),
        email: Joi.string().min(4).required().email(),
        password: Joi.string().min(4).required(),
    })
    const {error} = registerSchema.validate(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    next()
}

module.exports.loginValidate = (req, res, next) => {
    const loginSchema = Joi.object({
        email: Joi.string().min(4).required().email(),
        password: Joi.string().min(4).required(),
    })
    const {error} = loginSchema.validate(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    next()
}


