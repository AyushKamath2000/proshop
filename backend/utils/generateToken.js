import jwt from "jsonwebtoken";

const generateToken =(res , id) => {
    const token = jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
    // Set jwt as HTTP-Only cookie
    res.cookie('jwt', token, {
        maxAge:  30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure:process.env.NODE_ENV !== 'development',
        sameSite: 'strict'
    });
}

export default generateToken;
