import mongoose from 'mongoose';

export const ContentSchema = mongoose.Schema({
    title: {
        type: String,
        default: "Untitled"
    },
    preview: {
        type: Boolean,
        default: false
    },
    video: {
        type: String,
        default: "https://www.youtube.com/watch?v=9S4lm9JaDDM"
    },
    duration: {
        type: String,
        default: "0"
    }
}, { _id: false, collation: { locale: 'vi' } })