const asyncHandler = require('express-async-handler');
const AuthService = require('../services/AuthService');
const ResponseFactory = require('../utils/responseFactory');

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const authData = await AuthService.registerUser({
            name,
            email,
            password,
            role
        }, req.tenant);

        return ResponseFactory.success(res, authData, 'User registered successfully', 201);
    } catch (error) {
        if (error.message === 'User already exists') {
            return ResponseFactory.error(res, error.message, 400);
        }
        throw error;
    }
});

// @desc    Authenticate a user
// @route   POST /api/v1/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;

        const authData = await AuthService.loginUser(email, password, req.tenant);

        return ResponseFactory.success(res, authData, 'Logged in successfully', 200);
    } catch (error) {
        if (error.message === 'Invalid credentials') {
            return ResponseFactory.error(res, error.message, 401);
        }
        throw error;
    }
});

// @desc    Get configured logged in user info (me)
// @route   GET /api/v1/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    // req.user is populated by the authMiddleware
    const user = req.user;
    return ResponseFactory.success(res, user, 'Fetched profile successfully', 200);
});

module.exports = {
    registerUser,
    loginUser,
    getMe,
};
