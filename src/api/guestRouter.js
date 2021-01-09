import { sendResponse, handleError } from '../util/response';
import { convert } from '../util/courseConvert';
import CategoryModel from '../category/model';
import UserModel from '../user/model';
import CourseModel from '../course/model';

const router = require('express').Router();

router.get('/users', async (req, res) => {
    try {
        const user = await UserModel.find({}).select("-password -__v");
        return sendResponse(res, true, user);
    }
    catch (error) {
        return handleError(res, error, "Get error");
    }
});

router.get('/users/:id', async (req, res) => {
    try {
        const id = req.params.id || null;
        const user = await UserModel.findById(id)
                                    .select("-password -__v");

        const courses = await CourseModel.find({"lecturer_id": id})
                                            .select("-lecturer_id -__v");

        const userObj = user.toObject();
        userObj.courses = await convert(courses);

        let star = 0, enrollments = 0;
        for (let i = 0; i < courses.length; i++) {
            console.log("courses[i].star", courses[i].star);
            star += userObj.courses[i].star;
            enrollments += userObj.courses[i].enrollments;
        }
        userObj.star = star;
        userObj.enrollments = enrollments;

        return sendResponse(res, true, userObj);
    }
    catch (error) {
        return handleError(res, error, "Get error");
    }
});

router.get('/category', async (req, res) => {
    try {
        const category = await CategoryModel.find({}).select("-__v");
        let courses, enrollments, obj, objs = [];

        for (let i = 0; i < category.length; i++) {
            obj = category[i].toObject();
            courses = await CourseModel.find({category_id: obj._id})
                                        .select("_id");
            obj.courses = courses.length;
            obj.enrollments = 0;
            for (let j = 0; j < courses.length; j++) {
                enrollments = await UserModel
                                .find({enrolled: courses[j]._id})
                                .select("_id");
                obj.enrollments += enrollments.length;
            }
            objs.push(obj);
        }
        return sendResponse(res, true, objs);
    }
    catch (error) {
        return handleError(res, error, "Get error");
    }
});

router.get('/category/:id', async (req, res) => {
    try {
        const id = req.params.id || null;
        const category = await CategoryModel.findById(id).select("-__v");

        const cat = category.toObject();
        if (cat === null)
            return sendResponse(res, false, "This category doesn't exist.");
        const courses = await CourseModel.find({category_id: id})
                                        .select("-content -category_id -__v");

        const courseObjs = await convert(courses);
        cat.courses = courseObjs;
        return sendResponse(res, true, cat);
    }
    catch (error) {
        return handleError(res, error, "Get error");
    }
});

router.get('/course', async (req, res) => {
    try {
        const courses = await CourseModel.find({}).select("-content -__v");
        const courseObjs = await convert(courses);
        return sendResponse(res, true, courseObjs);
    }
    catch (error) {
        return handleError(res, error, "Get error");
    }
});

router.get('/course/:id', async (req, res) => {
    try {
        const id = req.params.id || null;
        const course = await CourseModel.findById(id).select("-__v");

        const courseObj = course.toObject();

        // Calculate star
        let star = 0;
        for (let i = 0; i < course.rating.length; i++) {
            star += course.rating[i].star;
            courseObj.rating[i].user = await UserModel
                                        .findById(courseObj.rating[i].user_id)
                                        .select("-password -__v");
            delete courseObj.rating[i].user_id;
        }
        if (course.rating.length === 0) courseObj.star = star;
        else courseObj.star = star / course.rating.length;

        // Get lecturer, category info
        courseObj.lecturer = await UserModel.findById(courseObj.lecturer_id)
                            .select("-password -__v");
        delete courseObj.lecturer_id;
        courseObj.category = await CategoryModel.findById(courseObj.category_id)
                            .select("-__v");
        delete courseObj.category_id;

        // Count enrollments
        const enrollments = await UserModel.find({enrolled: courseObj._id});
        courseObj.enrollments = enrollments.length;

        // Count favours
        const favours = await UserModel.find({favorite: courseObj._id});
        courseObj.favours = favours.length;

        return sendResponse(res, true, courseObj);
    }
    catch (error) {
        return handleError(res, error, "Get error");
    }
});

module.exports = router;