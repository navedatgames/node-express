const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter Name"],
        minLength:[3,"Name Should have minimum 3 characters"],
        maxLength:[30,"Name Should not exceed 30 characters"]
    },
    email:{
        type:String,
        required:[true,"Please Enter Email"],
        unique:true,
        validate:[validator.isEmail,"Please Enter a Valid Email"]
    },
    password:{
        type:String,
        required:[true,"Please Enter Your Password"],
        minLength:[8,"Password Should be minimum 8 characters"],
        select:false
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date
})

userSchema.pre("save",async function(next){

    if(!this.isModified("password")){
        next();
    }
    this.password = await bcryptjs.hash(this.password,8);
})

//JWT Token
userSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE,
    })
}

//compare password
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcryptjs.compare(enteredPassword,this.password)
}

// reset password token
userSchema.methods.forgotPassword = function(){
    const resetToken = crypto.randomBytes(20).toString("hex");

    // hashing and set to resetPasswordToken

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    return resetToken;
}

const userModel = mongoose.model("User",userSchema);

module.exports = userModel;