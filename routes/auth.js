const router = require('express').Router()
const User = require('../models/User')
const {registerValidate, loginValidate} = require('../middlewares/auth/validation')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Category = require("../models/Category");


router.post('/register', registerValidate, async (req, res) => {
    //checking if user already exists
    const userExists = await User.findOne({email: req.body.email})
    if (userExists) {
        return res.status(400).send('user with this email already exists')
    }

    //hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPass = await bcrypt.hash(req.body.password, salt)

    //creating and adding user in database
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPass
    })
    try {
        const savedUser = await user.save()

        //creating token
        const token = await jwt.sign({_id: savedUser._id}, process.env.TOKEN_SECRET)

        //creating default category for user
        const category = new Category({
            name: "Default",
            isDefault: true,
            user: savedUser._id
        })
        await category.save()

        //return user info and token  as response
        res.header('auth-token', token).send({
            user: savedUser,
            token: token
        })

    } catch (err) {
        res.status(400).send(err)
    }
})

router.post('/login', loginValidate, async (req, res) => {
    //checking email is registered
    const userExists = await User.findOne({email: req.body.email})
    if (!userExists) {
        return res.status(400).send('this email is not registered')
    }

    //checking if password is correct
    const correctPass = await bcrypt.compare(req.body.password, userExists.password)
    if (!correctPass) {
        return res.status(400).send('incorrect password')
    }

    //creating token
    const token = jwt.sign({_id: userExists._id}, process.env.TOKEN_SECRET)
    res.header('auth-token', token).send({
        user: userExists,
        token: token
    })
})

module.exports = router