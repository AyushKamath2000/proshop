import mongoose from 'mongoose';


// Define the schema for the user
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
}, {
    timestamps: true, // automatically adds createdAt and updatedAt fields
});


// Create the User model
const User = mongoose.model('User', userSchema);

export default User;
