import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

// Define the model
const Schema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    favorite: {
        type: [mongoose.Schema.ObjectId],
        default: []
    },
    enrolled: {
        type: [mongoose.Schema.ObjectId],
        default: []
    }
})

Schema.pre('save', function(next) {
    // get access to user model, then we can use user.email, user.password
    const user = this;

    bcrypt.genSalt(10, function(err, salt) {
        if (err) { return next(err) }

        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) { return next(err); }

            user.password = hash;
            next()
        })
    })
})

// Make use of methods for comparedPassword
Schema.methods.comparedPassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, good) {
        if (err) { return cb(err) }
        cb(null, good);
    })
}

// Export the model
export default mongoose.model('User', Schema);