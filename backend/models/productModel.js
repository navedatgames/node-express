const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter Name"]
    },
    description:{
        type:String,
        required:[true,"Please Enter Description"]
    },
    price:{
        type:Number,
        required:[true,"Please Enter Price"],
        maxLength:[6,"Price may not exceed 6 digits"]
    },
    rating:{
        type:Number,
        default:0
    },
    category:{
        type:String,
        required:[true,"Please Enter Product Category"]
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    stock:{
        type:Number,
        default:3
    },
    images:{
        type:String
    }
})

const model = mongoose.model("Product",productSchema);

module.exports = model;