import mongoose from 'mongoose';
import users from '../Data/users.js';
import products from '../Data/products.js';
import User from './userModel.js';
import Product from './productModel.js';
import Order from './orderModel.js';
import * as dotEnv from "dotenv";

dotEnv.config();

// MongoDB connection function
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit with failure
    }
};

const importData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        const createdUsers = await User.insertMany(users);
        const adminUser = createdUsers[0]._id;
        const sampleProducts = products.map((product) => {
            return { ...product, user: adminUser };
        });

        await Product.insertMany(sampleProducts);
        console.log('Data Imported');
        process.exit();
    } catch (error) {
        console.error('Error:', error.message.toString());
        process.exit(1); // Exit with failure
    }
};

const destroyData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();
        console.log('Data Destroyed');
        process.exit();
    } catch (error) {
        console.error('Error:', error.message.toString());
        process.exit(1); // Exit with failure
    }
};

// Connect to DB first, then run the import or destroy
connectDB().then(() => {
    if (process.argv[2] === '-d') {
        destroyData();
    } else {
        importData();
    }
});
