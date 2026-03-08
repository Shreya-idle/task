const User = require('../models/User');

class UserRepository {
    async createUser(userData, tenant) {
        return await User.create({ ...userData, tenant });
    }

    async findByEmail(email, tenant) {
        // Explicitly select password for matching later
        return await User.findOne({ email, tenant }).select('+password');
    }

    async findById(id, tenant) {
        return await User.findOne({ _id: id, tenant });
    }
}

module.exports = new UserRepository();
