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
})

router.post('/profile', UserController.updateProfile);
router.post('/password', UserController.updatePassword);
router.post('/reset-password', UserController.resetPassword);

export default router;