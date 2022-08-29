const express = require('express');

const {MOMO,VNPAY } = require('../controllers/paymentController')


const Router = express.Router()

Router.route('/MOMO').post(MOMO)
Router.route('/VNPAY').post(VNPAY)

module.exports = Router;


