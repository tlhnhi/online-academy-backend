import UserController from './controller';

const router = require('express').Router();

router.get('/profile', (req, res) => {
    res.json({
        "success": true,
        "data": req.user
    });
})

router.post('/profile', UserController.updateProfile);
router.post('/password', UserController.updatePassword);

export default router;