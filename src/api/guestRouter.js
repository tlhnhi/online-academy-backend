import { sendResponse, handleError } from '../util/response';
import CategoryModel from '../category/model';
import UserModel from '../user/model';
import CourseModel from '../course/model';

const router = require('express').Router();

router.get('/user', async (req, res) => {
    try {
        const user = await UserModel.find({}).select("-password -__v");
        return sendResponse(res, true, user);
    }
    catch (error) {
        return handleError(res, error, "Get error");
    }
});

router.get('/user/:id', async (req, res) => {
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
        const category = await CategoryModel.find({}).select("-password -__v");
        return sendResponse(res, true, category);
    }
    catch (error) {
        return handleError(res, error, "Get error");
    }
});

router.get('/category/:id', async (req, res) => {
    try {
        const id = req.params.id || null;
        const category = await CategoryModel.findById(id).select("-password -__v");
        return sendResponse(res, true, category);
    }
    catch (error) {
        return handleError(res, error, "Get error");
    }
});

router.get('/course', async (req, res) => {
    try {
        const course = await CourseModel.find({}).select("-password -__v");
        return sendResponse(res, true, course);
    }
    catch (error) {
        return handleError(res, error, "Get error");
    }
});

router.get('/course/:id', async (req, res) => {
    try {
        const id = req.params.id || null;
        const course = await CourseModel.findById(id).select("-password -__v");
        return sendResponse(res, true, course);
    }
    catch (error) {
        return handleError(res, error, "Get error");
    }
});

module.exports = router;