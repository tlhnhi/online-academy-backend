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

router.put('/profile', UserController.updateProfile);
router.put('/password', UserController.updatePassword);

router.post('/', async (req, res) => {
    const userEmail = req.user.email;
    if (userEmail !== "quack@domain.com") {
        return res.json({
            "success": false,
            "message": "Please log in with admin account ( ')>"
        });
    }
    const email = req.body.email || null,
        password = req.body.password || null,
        name = req.body.name || "unamed",
        isLecturer = true;

    const newUser = new UserModel({ email, password, name, isLecturer });
    const user = await newUser.save();
    return res.json({
        "success": true,
        "data": user
    });
});


router.put('/:id', async (req, res) => {
    const id = req.params.id || null;
    const user = await UserModel.findById(id).select("-password -__v");

    const email = req.user.email;
    if (email !== "quack@domain.com") {
        return res.json({
            "success": false,
            "message": "Please log in with admin account ( ')>"
        });
    }
    user.email = req.body.email || user.email;
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

router.delete('/:id', async (req, res) => {
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