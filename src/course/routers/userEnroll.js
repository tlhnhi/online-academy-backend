import { sendResponse, handleError } from '../../util/response';
import CourseModel from '../model';
import UserModel from '../../user/model';

const router = require('express').Router();

router.get('/', async (req, res) => {
    try {
        const userId = req.user._id;
        let user = await UserModel.findById(userId).select("enrolled");
        let courses = [];
        await Promise.all(user.enrolled.map(async id => {
            let course = await CourseModel.findOne({"_id": id});
            courses.push(course);
            console.log(courses);
        }));
        return sendResponse(res, true, courses);
    }
    catch (error) {
        return handleError(res, error, "Get error");
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id || null;
        let enrolled = false;

        const userId = req.user._id;
        let user = await UserModel.findById(userId).select("enrolled");
        
        if (user.enrolled.includes(id)) enrolled = true;
        return sendResponse(res, true, enrolled);
    }
    catch (error) {
        return handleError(res, error, "Get error");
    }
});

router.post('/', async (req, res) => {
    try {
        const id = req.body.course || null;
        const course = await CourseModel.findOne({"_id": id});
        if (course.lecturer_id.toString() === req.user._id.toString())
            return sendResponse(res, false, "You are this course's lecturer...");

        let user = await UserModel.findById(req.user._id).select("enrolled balance");
        let enrolled = user.enrolled;
        if (enrolled.includes(id))
            return sendResponse(res, false, "This course have been enrolled already.");

        let price = course.price * (1 - course.discount);
        if (user.balance - price < 0)
            return sendResponse(res, false, "Not enough balance to enroll this course.");

        enrolled.push(id);
        user.enrolled = enrolled;
        user.balance = user.balance - price;

        await user.save();
        return sendResponse(res, true, "Enroll course successfully.");
    }
    catch (error) {
        return handleError(res, error, "Get error");
    }
});

router.put('/', async (req, res) => {
    try {
        const courses = req.body.courses || null;
        const userId = req.user._id;
        let user = await UserModel.findById(userId).select("enrolled");

        user.enrolled = courses;
        await user.save();
        return sendResponse(res, true, "Update enrolled courses successfully.");
    }
    catch (error) {
        return handleError(res, error, "Get error");
    }
});

module.exports = router;