import UserController from './controller';

const router = require('express').Router();

router.get('/profile', (req, res) => {
    let userObj = req.user.toJSON();
    delete userObj.password;
    delete userObj.__v;
    res.json({
        "success": true,
        "data": userObj
    });
})

router.post('/profile', UserController.updateProfile);
router.post('/password', UserController.updatePassword);

export default router;