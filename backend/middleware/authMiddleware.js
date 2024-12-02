import asyncHandler from "./asyncHandler.js";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";


const protect = asyncHandler(async (req, res, next) => {
    let token = req.cookies.jwt;

    //read the token from cookie
    if(token) {
        try {
            //verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    } else {
        res.status(401);
        throw new Error('Not authorized no token');
    }
});

const admin = (req, res, next) => {
    if(req.user && req.user.isAdmin){
        next();
    } else {
        res.status(401);
        throw new Error("NOT authorised as Admin")
    }
}

export { protect, admin };
