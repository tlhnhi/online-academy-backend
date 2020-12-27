import UserModel from './model';

export default {
    updateProfile: (req, res, next) => {
        req.user.comparedPassword(req.body.password, async (err, good) => {
            if (err || !good) return res.status(401).json({
                success: false,
                message: err || 'Incorrect Password'
            });
            const userId = req.user._id;
            let user = await UserModel.findById(userId);
            user.password = req.body.newPassword || req.body.password;
            if (req.body.name) user.name = req.body.name;
            // if (req.body.newPassword) user.password = req.body.newPassword;
            
            await user.save();
            return res.status(200).json(user);
        })
    }  
}
