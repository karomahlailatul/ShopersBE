const express = require('express');
const router = express.Router();
const paymentController = require('../controller/Payment');
const { protect } = require('../middlewares/auth')
const {
    checkInputPayment,
    checkUpdatePayment,
    checkDeletePayment
} = require('../middlewares/common');


router.get('/', protect, paymentController.getPaginationPayment);
router.get('/:id', protect, paymentController.getPayment);
router.post('/', protect, checkInputPayment, paymentController.insertPayment);
router.put('/:id', protect, checkUpdatePayment, paymentController.updatePayment);
router.delete('/:id', protect, checkDeletePayment, paymentController.deletePayment);

module.exports = router