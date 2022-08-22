const express = require('express')
const router = express.Router()


const categoryRouter = require('../routes/category')
const sellerRouter = require('../routes/seller')
const productRouter = require('../routes/product')
const transactionRouter = require('../routes/transaction')
const usersRouter = require('../routes/users')
const paymentRouter = require('../routes/payment')

router
    .use('/category', categoryRouter)
    .use('/seller', sellerRouter)
    .use('/product', productRouter)
    .use('/transaction', transactionRouter)
    .use('/users', usersRouter)
    .use('/payment', paymentRouter)

module.exports = router