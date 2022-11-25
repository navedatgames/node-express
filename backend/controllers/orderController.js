const Order = require("../models/orderModel");
const Product = require('../models/productModel');
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");

// create order

const createOrder = catchAsyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice
  } = req.body;

  const order  = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt:Date.now(),
    user:req.user._id
})

    res.status(201).json({
        success:true,
        message:"order created",
        order
    })
});

// get all orders
const getAllOrder = catchAsyncError(async(req,res,next)=>{

    const order = await Order.find();

    res.status(200).json({
        suceess:true,
        order
    })
})

// get single order

const getSingleOrder = catchAsyncError(async(req,res,next)=>{

    // populate will take that field and using that field it will search in db and extract name and email 
    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
    );

    if(!order){
        return next(new ErrorHandler("Order not found!!",404));
    }

    res.status(201).json({
        success:true,
        order
    })
})

// update order 

const updateOrder = catchAsyncError(async(req,res,next)=>{

    const order = await Order.findById(req.params.id);

    if(order.orderStatus == "Delivered"){
        return next(new ErrorHandler("Your Order has already delivered",404));
    }

    order.orderItems.forEach(async(o)=>{
        await updateStock(o.product,o.quantity)
    })

    order.orderStatus = req.body.status;
    await order.save({validateBeforeSave:false});
    res.status(200).json({
        success:true 
    })
})

async function updateStock(id,quantity){
    const product = await Product.findById(id);

    product.stock = product.stock-quantity;
    await product.save({validateBeforeSave:false})
}
module.exports = {
    createOrder,
    getAllOrder,
    getSingleOrder,
    updateOrder
}
