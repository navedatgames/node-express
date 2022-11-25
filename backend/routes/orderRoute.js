const express = require('express');
const { createOrder, getAllOrder, getSingleOrder, updateOrder } = require('../controllers/orderController');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();

router.route('/order/create').post(isAuthenticated,createOrder);
router.route('/order/all').get(getAllOrder);
router.route('/order/single/:id').get(getSingleOrder);
router.route('/order/update/:id').put(updateOrder)



module.exports = router;