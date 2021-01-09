import mongoose from 'mongoose';

export const RatingSchema = mongoose.Schema({
    user_id: {
        type: String,
        ref: 'User',
        required: true
    },
    comment: {
        type: String,
        default: ""
    },
    star: {
        type: Number,
        required: true,
        get: v => Math.round(v),
        set: v => Math.round(v),
        min: [1, "Ít nhất cũng cho 1 sao chứ??"],
        max: [5, "Max là 5 sao thôi quỷ"]
    }
}, { _id: false, collation: { locale: 'vi' } })