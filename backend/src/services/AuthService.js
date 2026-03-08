const UserRepository = require('../repositories/UserRepository');
const generateToken = require('../utils/generateToken');

class AuthService {
    async registerUser(userData, tenant) {
        const { name, email, password, role } = userData;

        // Check if user exists
        const userExists = await UserRepository.findByEmail(email, tenant);
        if (userExists) {
            throw new Error('User already exists');
        }

        // Create user
        const user = await UserRepository.createUser({
            name,
            email,
            password,
            role
        }, tenant);

        if (user) {
            return {
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id, user.role),
            };
        } else {
            throw new Error('Invalid user data');
        }
    }

    async loginUser(email, password, tenant) {
        // Find user by email (password is explicitly selected in repo)
        const user = await UserRepository.findByEmail(email, tenant);

        if (user && (await user.matchPassword(password))) {
            return {
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id, user.role),
            };
        } else {
            throw new Error('Invalid credentials');
        }
    }
}

module.exports = new AuthService();
