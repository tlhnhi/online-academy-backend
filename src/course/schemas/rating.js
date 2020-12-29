import mongoose from 'mongoose';

export const ProductInList = mongoose.Schema({
    user_id: {
        type: String,
        ref: 'User',
        required: true
    },
    comment: {
        type: String,
        default: null
    },
    star: {
        type: Number,
        required: true
    }
}, { id: false, collation: { locale: 'vi' } })