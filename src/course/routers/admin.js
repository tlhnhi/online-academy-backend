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
        const course = await CourseModel.findById(id);
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
            price = req.body.pice || 0,
            discount = req.body.discount || 0,
            category_id = req.body.category_id || null,
            lecturer_id = req.body.lecturer_id || null,
            content = req.body.content || [];

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
        const course = await CourseModel.findById(id);
        if (course === null)
            return sendResponse(res, false, "This course doesn't exist.");

        let discount = req.body.discount;
        if (discount < 0 || discount > 1)
            return sendResponse(res, false, "Discount value should be between 0 to 1.");
        course.discount = discount;

        course.title = req.body.title || course.title;
        course.avatar = req.body.avatar || course.avatar;
        course.describe = req.body.describe || course.describe,
        course.detail = req.body.detail || course.detail,
        course.price = req.body.price || course.price,
        course.category_id = req.body.category_id || course.category_id;
        course.lecturer_id = req.body.lecturer_id || course.lecturer_id;
        course.content = req.body.content || course.content;
        course.rating = req.body.rating || course.rating;

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