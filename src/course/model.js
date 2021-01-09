import mongoose from 'mongoose';
import { ContentSchema } from './schemas/content';
import { RatingSchema } from './schemas/rating';

// Define the model
const Schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: null
    },
    describe: {
        type: String,
        default: null
    },
    detail: {
        type: String,
        default: null
    },
    price: {
        type: Number,
        default: 0,
        min: 0
    },
    discount: {
        type: Number,
        default: 0,
        min: [0, "Giảm âm là tăng giá hả??"],
        max: [1, "Tối đa 1 (tức 100%) thôi là free rồi"]
    },
    lecturer_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    category_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: true
    },
    done: {
        type: Boolean,
        default: false
    },
    content: {
        type: [ContentSchema],
        default: []
    },
    rating: {
        type: [RatingSchema],
        default: []
    }
}, {
    timestamps: true,
    collation: { locale: 'vi' }
})

Schema.index({
    title: 'text',
    describe: 'text',
    detail: 'text',
});

// Export the model
export default mongoose.model('Course', Schema);