const express = require('express');
const router = express.Router();
const {isAuthenticated} = require('../middleware/auth');
const {signUpUser, loginUser, logoutUser,forgotPassword, resetPassword, getUserDetails, updatePassword,updateProfile, getAllUsers, deleteUser, createReview}  = require('../controllers/userController');

router.route('/user/all').get(isAuthenticated,getAllUsers);
router.route('/user/create').post(signUpUser);
router.route('/user/login').post(loginUser);
router.route('/user/logout').get(logoutUser);
router.route('/user/forgotPassword').post(forgotPassword);
router.route('/user/resetPassword/:token').put(resetPassword);
router.route('/user/aboutMe').get(isAuthenticated,getUserDetails);
router.route('/user/updatePassword').put(isAuthenticated,updatePassword);
router.route('/user/updateProfile/:id').post(updateProfile);
router.route('/user/delete/:id').delete(isAuthenticated,deleteUser);


module.exports = router;