import UserModel from './model';

export default {
    updatePassword: (req, res, next) => {
        req.user.comparedPassword(req.body.password, async (err, good) => {
            if (err || !good) return res.status(401).json({
                success: false,
                message: err || 'Incorrect Password'
            });
            const userId = req.user._id;
            let user = await UserModel.findById(userId);
            user.password = req.body.newPassword || user.password;
            
            await user.save();
            return res.status(200).json({
                "success": true,
                "data": "Change password successfully."
            });
        })
    },
    updateProfile: async (req, res, next) => {
        const userId = req.user._id;
        let user = await UserModel.findById(userId);
        if (req.body.name) user.name = req.body.name;
        if (req.body.avatar) user.avatar = req.body.avatar;
        
        await user.save();
        return res.status(200).json({
            "success": true,
            "data": "Update profile successfully."
        });
    },
}
