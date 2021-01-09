import { sendResponse, handleError } from '../../util/response';
import { convert } from '../../util/courseConvert';
import CourseModel from '../model';
import UserModel from '../../user/model';

const router = require('express').Router();

router.get('/', async (req, res) => {
    try {
        const userId = req.user._id;
        const courses = await CourseModel
            .find({rating: {$elemMatch: {user_id: userId}}})
            .select("-content -__v");
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
        const course = await CourseModel.findById(id);

        const userId = req.user._id;
        let rating = null;
        if (course !== null)
            for (let i = 0; i < course.rating.length; i++)
                if (course.rating[i].user_id.toString() === userId.toString()) {
                    rating = course.rating[i];
                    break;
                }
        return sendResponse(res, true, rating);
    }
    catch (error) {
        return handleError(res, error, "Get error");
    }
});

router.post('/', async (req, res) => {
    try {
        const id = req.body.course_id || null;
        const course = await CourseModel.findById(id);
        if (course === null)
            return sendResponse(res, false, "This course doesn't exist.");
        
        const user_id = req.user._id;
        if (course.lecturer_id.toString() === user_id.toString())
            return sendResponse(res, false, "You are this course's lecturer...");

        if (course !== null)
            for (let i = 0; i < course.rating.length; i++)
                if (course.rating[i].user_id.toString() === user_id.toString())
                    return sendResponse(res, false, "You have rated this course.");

        let user = await UserModel.findById(user_id).select("favorite");
        if (!user.enrolled.includes(id))
            return sendResponse(res, false, "You must enroll before giving a rate to this course.");
        

        const star = req.body.star || null,
            comment = req.body.comment || "";

        course.rating.push({ user_id, comment, star });
        await course.save();
        return sendResponse(res, true, "Add rating successfully.");
    }
    catch (error) {
        return handleError(res, error, "Get error");
    }
});

module.exports = router;