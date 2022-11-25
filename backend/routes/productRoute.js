const express = require('express');
const { getAllProduct, createProduct, getProductByName, updateProduct, deleteProduct ,getProductById} = require('../controllers/productController');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();

router.route('/products').get(isAuthenticated,getAllProduct);
router.route('/products/create').post(isAuthenticated,createProduct);
router.route('/products/:id').get(isAuthenticated,getProductById);
router.route('/products/:id').put(updateProduct).(isAuthenticated,deleteProductdelete);


module.exports = router;