import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

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

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}
// Create the User model
const User = mongoose.model('User', userSchema);

export default User;
