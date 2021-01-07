import mongoose from 'mongoose';

export const ContentSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    preview: {
        type: Boolean,
        default: false
    },
    video: {
        type: String,
        default: null
    },
    duration: {
        type: Number,
        default: 0
    }
}, { _id: false, collation: { locale: 'vi' } })