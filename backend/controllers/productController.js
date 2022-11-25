const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');

const createProduct = async(req,res)=>{
    const product =  await Product.create(req.body);

    res.status(201).json({
        success:true,
        data:product
    })
}

const getAllProduct = async(req,res)=>{
    const products = await Product.find();
    res.status(200).send({
        success:true,
        products
    })
}

const getProductByName = async(req,res)=>{
    const product = await Product.find(req.params).exec();
    console.log("hello")
    res.status(201).send({
        success:true,
        product
    })
}

const getProductById = async(req,res,next)=>{
    const product = await Product.findById(req.params.id);
    
    if(!product){
        return next(new ErrorHandler("Product Not Found!",404))
    }

    res.status(200).json({
        success:true,
        product
    })
}
const updateProduct = async(req,res,next)=>{
    let product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("Product Not Found",500))
    }

    const products = await Product.findByIdAndUpdate(req.params.id,req.body,{new:true,useFindAndModify:false,validators:true})

    res.status(201).json({
        success:true,
        products
    })

}

const deleteProduct = async(req,res)=>{
    const product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("Product Not Found",500))
    }

    await Product.findByIdAndRemove(req.params.id);

    res.status(201).json({
        success:true,
        message:"Product has been successfully deleted!!"
    })
}

module.exports = {
    createProduct,
    getAllProduct,
    getProductByName,
    updateProduct,
    deleteProduct,
    getProductById
}