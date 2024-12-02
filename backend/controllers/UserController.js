import Product from "../models/productModel.js";
import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import generateToken from "../utils/generateToken.js";

// @desc Auth User
// @route POST /api/users/login
// @access Public
const authUsers = asyncHandler(async (req, res) => {

    const {email,password} = req.body;
    console.log(email + 'email');
    const user = await User.findOne({email});

    if(user && (await user.matchPassword(password))){
         generateToken(res, user._id);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,

        })
    } else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
});

// @desc Logout User
// @route POST /api/users/logout
// @access Private
const logoutUser = asyncHandler(async (req, res) => {
    console.log('logout User');
    res.cookie('jwt', 'none', { httpOnly: true, expires: new Date(0) });
    res.status(200).json({ message: 'User logged out success' });
});


// @desc Register User
// @route POST /api/user
// @access Public
const registerUser = asyncHandler(async (req, res) => {
    const {name, email, password} = req.body;
    const userExists = await User.findOne({email});
    if(userExists){
        res.status(400);
        throw new Error('User already exists');
    }
    const user = await User.create({
        name,
        email,
        password,
    });
    if(user) {
        generateToken(res, user._id);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,

        })
    } else {
        res.status(401);
        throw new Error("Invalid user data");
    }
});


// @desc get User profile
// @route GET /api/user/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if(user) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,

        })
    } else {
        res.status(401);
        throw new Error("user not  data");
    }
});

// @desc update User profile
// @route PUT /api/user/profile
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if(user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
         if(req.body.password){
             user.password = req.body.password
         }
         const updatedUser = await user.save();
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,

        })
    } else {
        res.status(401);
        throw new Error("user data not updated");
    }
});

// @desc get Users profile
// @route Get /api/users
// @access Private and Admin
const getUsers = asyncHandler(async (req, res) => {
    res.send('get Users');
});

// @desc get User profile by id
// @route GET /api/users/:id
// @access Private and Admin
const getUserByID = asyncHandler(async (req, res) => {
    res.send('get User by id');
});

// @desc update User profile by id
// @route PUT /api/users/:id
// @access Private and Admin
const updateUserByID = asyncHandler(async (req, res) => {
    res.send('update User by id');
});

// @desc delete Users profile
// @route DELETE /api/users/:id
// @access Private and Admin
const deleteUsers = asyncHandler(async (req, res) => {
    res.send('delete Users');
});

export {authUsers, logoutUser, registerUser, getUserProfile, updateUserProfile, getUsers, getUserByID, updateUserByID, deleteUsers};





