import CategoryModel from '../category/model';
import UserModel from '../user/model';

export const convert = async (courses) => {
    let objs = [], obj = null, star;
    for (let i = 0; i < courses.length; i++) {
        obj = courses[i].toObject();

        // Calculate star
        star = 0;
        for (let j = 0; j < obj.rating.length; j++)
            star += obj.rating[j].star;
        if (obj.rating.length === 0) obj.star = star;
        else obj.star = star / obj.rating.length;
        delete obj.rating;

        // Get lecturer, category info
        if (obj.lecturer_id !== undefined) {
            obj.lecturer = await UserModel.findById(obj.lecturer_id)
                            .select("-password -__v");
            delete obj.lecturer_id;
        }

        if (obj.category_id !== undefined) {
            obj.category = await CategoryModel.findById(obj.category_id)
                            .select("-__v");
            delete obj.category_id;
        }

        // Count enrollments
        const enrollments = await UserModel.find({enrolled: obj._id});
        obj.enrollments = enrollments.length;

        objs.push(obj);
    }
    return objs;
}