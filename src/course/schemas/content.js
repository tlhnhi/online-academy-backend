import mongoose from 'mongoose';

export const ProductInList = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    video: {
        type: String,
        default: null
    },
    duration: {
        type: Number,
        default: 0
    }
}, { id: false, collation: { locale: 'vi' } })