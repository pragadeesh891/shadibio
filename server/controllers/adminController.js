const User = require('../models/User');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password -__v');
        res.status(200).json({ success: true, data: { users } });
    } catch (error) {
        console.error('Failed to get users', error);
        res.status(500).json({ success: false, message: 'Server error fetching users' });
    }
};

const makeUserPremium = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        user.isPremium = true;
        await user.save();
        res.status(200).json({ success: true, message: 'User updated to premium', data: { user } });
    } catch (error) {
        console.error('Failed to update premium status', error);
        res.status(500).json({ success: false, message: 'Server error updating user' });
    }
};

module.exports = {
    getAllUsers,
    makeUserPremium
};
