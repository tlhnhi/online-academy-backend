import { sendResponse, handleError } from '../../util/response';
import { convert } from '../../util/courseConvert';
import CourseModel from '../model';

const router = require('express').Router();

router.get('/', async (req, res) => {
    try {
        const courses = await CourseModel
                    .find({"lecturer_id": req.user._id})
                    .select("-__v");
        const courseObjs = await convert(courses);
        return sendResponse(res, true, courseObjs);
    }
    catch (error) {
        return handleError(res, error, "Get error");
    }
});

router.post('/:id', async (req, res) => {
    try {
        const id = req.params.id || null;
        const course = await CourseModel.findById(id);

        if (course === null)
            return sendResponse(res, false, "This course doesn't exist.");

        if (req.user._id.toString() !== course.lecturer_id.toString())
            return sendResponse(res, false, "Permission denied.");

        const content = req.body.content || null,
            title = req.body.title || null,
            preview = req.body.preview || null,
            video = req.body.video || null,
            duration = req.body.duration || null;

        if (content !== null)
            course.content = [...new Set([...course.content ,...content])];
        else course.content.push({title, preview, video, duration});

        console.log("course.content.", course.content);

        await course.save();
        return sendResponse(res, true, course);
    }
    catch (error) {
        return handleError(res, error, "Get error");
    }
});

router.post('/', async (req, res) => {
    try {
        if (!req.user.isLecturer)
            return sendResponse(res, true, "Only lecturer allow to create a course.");

        const title = req.body.title || null,
            avatar = req.body.avatar || null,
            describe = req.body.describe || null,
            detail = req.body.detail || null,
            price = req.body.pice || 0,
            discount = req.body.discount || 0,
            done = req.body.done || false,
            category_id = req.body.category_id || null,
            content = req.body.content || [],
            lecturer_id = req.user._id;

        const newCourse = new CourseModel({
            title, avatar, describe, detail, price, discount, done, lecturer_id, category_id, content
        });
        const course = await newCourse.save();
        return sendResponse(res, true, course);
    }
    catch (error) {
        return handleError(res, error, "Get error");
    }
});

router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id || null;
        const course = await CourseModel.findById(id);
        if (course === null)
            return sendResponse(res, false, "This course doesn't exist.");

        let discount = req.body.discount;
        if (discount < 0 || discount > 1)
            return sendResponse(res, false, "Discount value should be between 0 to 1.");
        course.discount = discount;

        if (req.user._id.toString() !== course.lecturer_id.toString())
            return sendResponse(res, false, "Permission denied.");

        course.title = req.body.title || course.title;
        course.avatar = req.body.avatar || course.avatar;
        course.describe = req.body.describe || course.describe,
        course.detail = req.body.detail || course.detail,
        course.price = req.body.price || course.price,
        course.done = req.body.done || course.done,
        course.category_id = req.body.category_id || course.category_id;
        course.content = req.body.content || course.content;

        await course.save();
        return sendResponse(res, true, course);
    }
    catch (error) {
        return handleError(res, error, "Get error");
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id || null;
        let course = await CourseModel.findById(id);
        if (course === null)
            return sendResponse(res, false, "This course doesn't exist.");

        if (req.user._id.toString() !== course.lecturer_id.toString())
            return sendResponse(res, false, "Permission denied.");

        course = await CourseModel.deleteOne({"_id": id});
        return sendResponse(res, true, course);
    }
    catch (error) {
        return handleError(res, error, "Get error");
    }
})

module.exports = router;