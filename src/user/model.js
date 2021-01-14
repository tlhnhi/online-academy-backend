import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Define the model
const Schema = new mongoose.Schema(
  {
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
    avatar: {
      type: String,
      default:
        "https://d11a6trkgmumsb.cloudfront.net/original/3X/d/8/d8b5d0a738295345ebd8934b859fa1fca1c8c6ad.jpeg?fbclid=IwAR3drm7_Vca3wpXl__C_tyCjYyrKOhr7xO704Q0E1l5Y1nJz6TC-VGnTec8"
    },
    balance: {
      type: Number,
      default: 1000000
    },
    isLecturer: {
      type: Boolean,
      default: false
    },
    description: {
      type: String,
      default: ""
    },
    favorite: {
      type: [mongoose.Schema.ObjectId],
      default: []
    },
    enrolled: {
      type: [mongoose.Schema.ObjectId],
      default: []
    }
  },
  { collation: { locale: "vi" } }
);

Schema.pre("save", function (next) {
  // get access to user model, then we can use user.email, user.password
  const user = this;
  if (user.password === undefined) next();

  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) {
      return next(err);
    }

    user.password = hash;
    next();
  });
});

// Make use of methods for comparedPassword
Schema.methods.comparedPassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, good) {
    if (err) {
      return cb(err);
    }
    cb(null, good);
  });
};

// Export the model
export default mongoose.model("User", Schema);
