import { sendResponse, handleError } from '../../util/response';
import CourseModel from '../model';

const router = require('express').Router();

router.get('/', async (req, res) => {
    try {
        const course = await CourseModel.find({});
        return sendResponse(res, true, course);
    }
    catch (error) {
        return handleError(res, error, "Get error");
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id || null;
        const course = await CourseModel.findOne({"_id": id});
        return sendResponse(res, true, course);
    }
    catch (error) {
        return handleError(res, error, "Get error");
    }
});

router.post('/', async (req, res) => {
    try {
        const title = req.body.title || null,
            avatar = req.body.avatar || null,
            describe = req.body.describe || null,
            detail = req.body.detail || null,
            price = req.body.pice || null,
            discount = req.body.discount || null,
            category_id = req.body.category_id || null,
            lecturer_id = req.body.lecturer_id || null,
            content = req.body.content || null;

        const newCourse = new CourseModel({ title, avatar, describe, detail, price, discount, lecturer_id, category_id, content });
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
        const course = await CourseModel.findOne({"_id": id});

        // if (req.user._id != course.lecturer_id)
        //     return sendResponse(res, false, "Permission denied.");

        course.title = req.body.title || course.title;
        course.avatar = req.body.avatar || course.avatar;
        course.describe = req.body.describe || course.describe,
        course.detail = req.body.detail || course.detail,
        course.price = req.body.pice || course.price,
        course.discount = req.body.discount || course.discount,
        course.category_id = req.body.category_id || course.category_id;
        course.lecturer_id = req.body.lecturer_id || course.lecturer_id;
        course.content = req.body.content || course.content;
        course.rating = req.body.ratine || course.rating;

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
        const course = await CourseModel.deleteOne({"_id": id});
        return sendResponse(res, true, course);
    }
    catch (error) {
        return handleError(res, error, "Get error");
    }
})

module.exports = router;