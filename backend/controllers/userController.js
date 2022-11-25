const User = require('../models/userModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middleware/catchAsyncError');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const signUpUser = catchAsyncError(async(req,res,next)=>{
    const {name,email,password} = req.body;
    const user = await User.create({
        name,email,password
    });
    res.status(201).json({
        success:true,
        user
    });
})

const loginUser = catchAsyncError(async(req,res,next)=>{
    const {email,password} = req.body;

    if(!email || !password){
        return next(new ErrorHandler("Please enter email or password",500))
    }

    const user = await User.findOne({email}).select("+password");

    if(!user){
        return next(new ErrorHandler("Invalid emails or password",401))
    }
  
    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password",401))
    }

    sendToken(user,200,res);
})

const logoutUser = catchAsyncError(async(req,res,next)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })

    res.status(200).json({
        success:true,
        message:"User is successfully logged out!!"
    })
})

const forgotPassword = catchAsyncError(async(req,res,next)=>{
    const user = await User.findOne({email:req.body.email});

    if(!user){
        return next(new ErrorHandler("User not found",404));
    }

    // user found then get forgot password token

    const resetToken = user.forgotPassword()

    await user.save({validateBeforeSave:false});

    const resetLink = `${req.protocol}://${req.get("host")}/api/v1/user/resetPassword/${resetToken}`;

    const message = `Your password reset link :- \n\n ${resetLink}`;

    // send email
    
    try{
        await sendEmail({
            email:user.email,
            subject:'password recovery',
            message
        })

        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} successfully!`
        })
    }catch(error){
        console.log("error",error.message)
        user.resetPasswordToken = undefined;

        await user.save();

        return next(new ErrorHandler(error.message,404));
    }
})

// reset password 

const resetPassword = catchAsyncError(async(req,res,next)=>{

    // generate hash
    
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    
    const user = await User.findOne({resetPasswordToken});

    if(!user){
        return next(new ErrorHandler("Invalid Token",400));
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Password doesnot match !!",400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;

    await user.save();

    sendToken(user,200,res);
})

// get user details

const getUserDetails = catchAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.user);

    res.status(200).json({
        success:true,
        user
    })
})

//update password

const updatePassword = catchAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Old password is incorrect",400));
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Password not match",400));
    }

    user.password = req.body.password;

    await user.save();

    res.status(201).json({
        success:true,
        message:"Password Updated Successfully!!"
    })


})

// update profile

const updateProfile = catchAsyncError(async(req,res,next)=>{
    const {name ,email} = req.body;
    
    //start finding
    const user = await User.findByIdAndUpdate({_id:req.params.id},{name,email},{new:true,runValidators:true,useFindAndModify:false});

    if(!user){
        return next(new ErrorHandler("Invalid user",401));
    }

    await user.save();
    res.status(201).json({
        success:true,
        message:"User Detail updated successfully",
        user
    })


})

// get all users

const getAllUsers = catchAsyncError(async(req,res,next)=>{
    const user = await User.find();

    res.status(200).json({
        success:true,
        user
    })
})

// delete user

const deleteUser = catchAsyncError(async(req,res,next)=>{

    const user = await User.findByIdAndRemove(req.params.id);

    if(!user){
        return next(new ErrorHandler("User not found !",401))
    }

    res.status(201).json({
        success:true,
        message:"User Deleted Successfully"
    })
})


module.exports = {
    signUpUser,
    loginUser,
    logoutUser,
    forgotPassword,
    resetPassword,
    getUserDetails,
    updatePassword,
    updateProfile,
    getAllUsers,
    deleteUser, 
}