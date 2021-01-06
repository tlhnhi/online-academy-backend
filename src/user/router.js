import UserController from './controller';
import UserModel from './model';

const router = require('express').Router();

router.get('/profile', async (req, res) => {
    const userId = req.user._id;
    let user = await UserModel.findById(userId).select("-password -__v");
    let userObj = user.toJSON();
    res.json({
        "success": true,
        "data": userObj
    });
});

router.post('/profile', UserController.updateProfile);
router.post('/password', UserController.updatePassword);

router.get('/users', async (req, res) => {
    const userEmail = req.user.email;
    if (userEmail !== "quack@domain.com") {
        return res.json({
            "success": false,
            "message": "Please log in with admin account ( ')>"
        });
    }
    let users = await UserModel.find({}).select("-password -__v");
    return res.json({
        "success": true,
        "data": users
    });
});

router.put('/users/:id', async (req, res) => {
    const id = req.params.id || null;
    const user = await UserModel.findById(id);

    const email = req.user.email;
    if (email !== "quack@domain.com") {
        return res.json({
            "success": false,
            "message": "Please log in with admin account ( ')>"
        });
    }
    user.name = req.body.name || user.name;
    user.avatar = req.body.avatar || user.avatar;
    user.balance = req.body.balance || user.balance;
    user.isLecturer = req.body.isLecturer || user.isLecturer;
    
    await user.save();
    return res.status(200).json({
        "success": true,
        "data": "Update profile successfully."
    });
});

router.delete('/users/:id', async (req, res) => {
    const id = req.params.id || null;

    const email = req.user.email;
    if (email !== "quack@domain.com") {
        return res.json({
            "success": false,
            "message": "Please log in with admin account ( ')>"
        });
    }
    const user = await UserModel.deleteOne({"_id": id});
    return res.status(200).json({
        "success": true,
        "data": user
    });
});

export default router;