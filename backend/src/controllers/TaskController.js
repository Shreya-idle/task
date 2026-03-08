const asyncHandler = require('express-async-handler');
const TaskService = require('../services/TaskService');
const ResponseFactory = require('../utils/responseFactory');

// @desc    Get tasks
// @route   GET /api/v1/tasks
// @access  Private (Admin gets all, User gets theirs)
const getTasks = asyncHandler(async (req, res) => {
    const tasks = await TaskService.getTasks({ id: req.user.id, role: req.user.role }, req.tenant);
    return ResponseFactory.success(res, tasks, 'Tasks fetched successfully');
});

// @desc    Create a task
// @route   POST /api/v1/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
    if (!req.body.title || !req.body.description) {
        res.status(400);
        throw new Error('Please add a title and description');
    }

    const task = await TaskService.createTask(req.body, req.user.id, req.tenant);
    return ResponseFactory.success(res, task, 'Task created successfully', 201);
});

// @desc    Update a task
// @route   PUT /api/v1/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
    try {
        const updatedTask = await TaskService.updateTask(
            req.params.id,
            req.body,
            { id: req.user.id, role: req.user.role },
            req.tenant
        );
        return ResponseFactory.success(res, updatedTask, 'Task updated successfully');
    } catch (error) {
        if (error.message === 'Task not found') {
            return ResponseFactory.error(res, error.message, 404);
        }
        if (error.message === 'User not authorized to update this task') {
            return ResponseFactory.error(res, error.message, 401);
        }
        throw error;
    }
});

// @desc    Delete a task
// @route   DELETE /api/v1/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
    try {
        const deletedStatus = await TaskService.deleteTask(
            req.params.id,
            { id: req.user.id, role: req.user.role },
            req.tenant
        );
        return ResponseFactory.success(res, deletedStatus, 'Task deleted successfully');
    } catch (error) {
        if (error.message === 'Task not found') {
            return ResponseFactory.error(res, error.message, 404);
        }
        if (error.message === 'User not authorized to delete this task') {
            return ResponseFactory.error(res, error.message, 401);
        }
        throw error;
    }
});

module.exports = {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
};
