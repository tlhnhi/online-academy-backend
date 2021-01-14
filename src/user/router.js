import UserController from "./controller";
import UserModel from "./model";
import { convert } from "../util/courseConvert";
import CourseModel from "../course/model";

const router = require("express").Router();

router.get("/profile", async (req, res) => {
  const id = req.user._id;
  const user = await UserModel.findById(id).select("-password -__v");

  const courses = await CourseModel.find({ lecturer_id: id }).select(
    "-lecturer_id -__v"
  );

  const userObj = user.toObject();
  userObj.courses = await convert(courses);

  let star = 0,
    numstar = 0,
    enrollments = 0,
    ratings = 0;
  for (let i = 0; i < courses.length; i++) {
    ratings += userObj.courses[i].rating.length;
    enrollments += userObj.courses[i].enrollments;
    if (userObj.courses[i].star > 0) {
      star += userObj.courses[i].star;
      numstar += 1;
    }
  }
  if (numstar > 0) userObj.star = star / numstar;
  else userObj.star = 0;
  userObj.ratings = ratings;
  userObj.enrollments = enrollments;

  res.json({
    success: true,
    data: userObj
  });
});

router.put("/profile", UserController.updateProfile);
router.put("/password", UserController.updatePassword);

router.post("/", async (req, res) => {
  const userEmail = req.user.email;
  if (userEmail !== "quack@domain.com") {
    return res.json({
      success: false,
      message: "Please log in with admin account ( ')>"
    });
  }
  const email = req.body.email || null,
    password = req.body.password || null,
    name = req.body.name || "unamed",
    description = req.body.description || "",
    avatar =
      req.body.avatar ||
      "https://d11a6trkgmumsb.cloudfront.net/original/3X/d/8/d8b5d0a738295345ebd8934b859fa1fca1c8c6ad.jpeg?fbclid=IwAR3drm7_Vca3wpXl__C_tyCjYyrKOhr7xO704Q0E1l5Y1nJz6TC-VGnTec8",
    isLecturer = true;

  const newUser = new UserModel({
    avatar,
    email,
    password,
    name,
    isLecturer,
    description
  });
  const user = await newUser.save();
  return res.json({
    success: true,
    data: user
  });
});

router.put("/:id", async (req, res) => {
  const id = req.params.id || null;
  const user = await UserModel.findById(id).select("-password -__v");

  const email = req.user.email;
  if (email !== "quack@domain.com") {
    return res.json({
      success: false,
      message: "Please log in with admin account ( ')>"
    });
  }
  user.email = req.body.email || user.email;
  user.name = req.body.name || user.name;
  user.avatar = req.body.avatar || user.avatar;
  user.description = req.body.description || user.description;
  user.balance = req.body.balance || user.balance;
  user.isLecturer = req.body.isLecturer || user.isLecturer;

  await user.save();
  return res.status(200).json({
    success: true,
    data: "Update profile successfully."
  });
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id || null;

  const email = req.user.email;
  if (email !== "quack@domain.com") {
    return res.json({
      success: false,
      message: "Please log in with admin account ( ')>"
    });
  }
  const user = await UserModel.deleteOne({ _id: id });
  return res.status(200).json({
    success: true,
    data: user
  });
});

export default router;
