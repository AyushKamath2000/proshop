import mongoose from 'mongoose';
const reviewsSchema = mongoose.Schema({
    user:{        
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name:{type: String, required: true},
    rating:{type: Number, required: true},
    comment:{type: String, required: true}
},{timestamps: true});


const productSchema = mongoose.Schema({
    name:{type: String, required: true},
    image:{type: String, required: true},
    description:{type: String, required: true},
    brand:{type: String, required: true},
    category:{type: String, required: false},
    price:{type: Number, required: true},
    countInStock:{type: Number, required: true, default:0},
    rating:{type: Number, required: true, default:0},
    numReviews:{type: Number, required: true},
    reviews: [reviewsSchema],
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
},{
    timestamps: true});

const product = mongoose.model('Product', productSchema);

export default product;
