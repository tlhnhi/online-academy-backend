import { sendResponse, handleError } from '../util/response';
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
        const user = await UserModel.findById(id).select("-password -__v");
        return sendResponse(res, true, user);
    }
    catch (error) {
        return handleError(res, error, "Get error");
    }
});

router.get('/category', async (req, res) => {
    try {
        const category = await CategoryModel.find({}).select("-__v");
        return sendResponse(res, true, category);
    }
    catch (error) {
        return handleError(res, error, "Get error");
    }
});

router.get('/category/:id', async (req, res) => {
    try {
        const id = req.params.id || null;
        const category = await CategoryModel.findById(id);

        const cat = category.toObject();
        cat.courses = await CourseModel.find({category_id: id}).select("-content -__v");
        return sendResponse(res, true, cat);
    }
    catch (error) {
        return handleError(res, error, "Get error");
    }
});

router.get('/course', async (req, res) => {
    try {
        const courses = await CourseModel.find({}).select("-content -__v");
        const objs = [];
        let obj = null, star;
        for (let i = 0; i < courses.length; i++) {
            obj = courses[i].toObject();
            star = 0;
            for (let j = 0; j < obj.rating.length; j++)
                star += obj.rating[j].star;

            if (obj.rating.length === 0) obj.star = star;
            else obj.star = star / obj.rating.length;
            objs.push(obj);
        }
        return sendResponse(res, true, objs);
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
        let star = 0;
        for (let i = 0; i < course.rating.length; i++)
            star += course.rating[i].star;

        if (course.rating.length === 0) courseObj.star = star;
        else courseObj.star = star / course.rating.length;

        return sendResponse(res, true, courseObj);
    }
    catch (error) {
        return handleError(res, error, "Get error");
    }
});

module.exports = router;