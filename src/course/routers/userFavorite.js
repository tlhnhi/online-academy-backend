import { sendResponse, handleError } from '../../util/response';
import { convert } from '../../util/courseConvert';
import CourseModel from '../model';
import UserModel from '../../user/model';

const router = require('express').Router();

router.get('/', async (req, res) => {
    try {
        const userId = req.user._id;
        let user = await UserModel.findById(userId).select("favorite");
        let courses = [];
        await Promise.all(user.favorite.map(async id => {
            let course = await CourseModel.findOne({"_id": id}).select("-__v");
            courses.push(course);
        }));
        const courseObjs = await convert(courses);
        return sendResponse(res, true, courseObjs);
    }
    catch (error) {
        return handleError(res, error, "Get error");
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id || null;
        let favorite = false;

        const userId = req.user._id;
        let user = await UserModel.findById(userId).select("favorite");
        
        if (user.favorite.includes(id)) favorite = true;
        return sendResponse(res, true, favorite);
    }
    catch (error) {
        return handleError(res, error, "Get error");
    }
});

router.post('/', async (req, res) => {
    try {
        const id = req.body.course || null;
        const course = await CourseModel.findById(id);
        if (course === null)
            return sendResponse(res, false, "This course doesn't exist.");
        let user = await UserModel.findById(req.user._id).select("favorite");
        let favorite = user.favorite;
        if (favorite.includes(id))
            return sendResponse(res, false, "This course is in favorite already.");

        favorite.push(id);
        user.favorite = favorite;

        await user.save();
        return sendResponse(res, true, "Add course to favorite successfully.");
    }
    catch (error) {
        return handleError(res, error, "Get error");
    }
});

router.put('/', async (req, res) => {
    try {
        const courses = req.body.courses || null;
        const userId = req.user._id;
        let user = await UserModel.findById(userId).select("favorite");

        user.favorite = courses;
        await user.save();
        return sendResponse(res, true, "Update favorite courses successfully.");
    }
    catch (error) {
        return handleError(res, error, "Get error");
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id || null;

        const userId = req.user._id;
        let user = await UserModel.findById(userId).select("favorite");
        
        let index = user.favorite.indexOf(id);
        if (index === -1)
            return sendResponse(res, false, "This course is not in favorite list.");

        user.favorite.splice(index, 1);
        await user.save();
        return sendResponse(res, true, "Remove course from favorite list successfully.");
    }
    catch (error) {
        return handleError(res, error, "Get error");
    }
});

module.exports = router;