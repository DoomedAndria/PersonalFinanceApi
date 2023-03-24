const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const verify = require('./middlewares/auth/tokenVerification')
//routes
const authRoute = require('./routes/auth')
const categoryRoute = require('./routes/category')
const financeRoute = require('./routes/finance')

const app = express()
dotenv.config()

//database connection
mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, dbName: 'PersonalFinanceApi'}).then(() => {
    console.log('database connected')
})

app.use(express.json())

app.use('/api/user', authRoute)
app.use('/api/categories', verify, categoryRoute)
app.use('/api/finances',verify,financeRoute)

app.listen(3000, () => {
    console.log('server is running')
})
