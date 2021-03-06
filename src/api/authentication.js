import token from "../util/token";
import { sendVerify } from "../util/email";
import UserModel from "../user/model";
require("babel-polyfill"); // allow async

export default {
  signup: (req, res, next) => {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(422).json({
        success: false,
        message: "You must provide email and password."
      });
    }
    UserModel.findOne(
      {
        email: email
      },
      function (err, existingUser) {
        if (err)
          return res.status(422).json({
            success: false,
            message: err
          });
        if (existingUser) {
          return res.status(422).json({
            success: false,
            message: "Email is in use"
          });
        }
        const user = new UserModel({
          name: name,
          email: email,
          password: password
        });

        user.save(function (err, savedUser) {
          if (err) {
            return next(err);
          }

          var userToken = token.generateToken(savedUser);
          sendVerify(userToken, savedUser.email);

          res.json({
            success: true,
            token: userToken
          });
        });
      }
    );
  },

  signin: (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
      return res.status(422).json({
        success: false,
        error: "You must provide email and password."
      });
    }
    UserModel.findOne(
      {
        email: email
      },
      function (err, existingUser) {
        if (err || !existingUser) {
          return res.status(401).json({
            status: false,
            message: err || "Incorrect Email or Password"
          });
        }
        if (existingUser) {
          if (existingUser.isBlocked)
            return res.json({
              status: false,
              message: "Account is blocked. Please contact admin."
            });
          existingUser.comparedPassword(password, function (err, good) {
            if (err || !good) {
              return res.status(401).json({
                status: false,
                message: err || "Incorrect Email or Password"
              });
            }

            res.json({
              success: true,
              data: {
                token: token.generateToken(existingUser)
              }
            });
          });
        }
      }
    );
  }
};
