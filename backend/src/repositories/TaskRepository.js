const Task = require('../models/Task');

class TaskRepository {
    async createTask(taskData, tenant) {
        return await Task.create({ ...taskData, tenant });
    }

    async findTasksByUserId(userId, tenant) {
        return await Task.find({ user: userId, tenant }).sort('-createdAt');
    }

    async findAllTasks(tenant) {
        return await Task.find({ tenant }).populate('user', 'name email').sort('-createdAt');
    }

    async findTaskById(taskId, tenant) {
        return await Task.findOne({ _id: taskId, tenant });
    }

    async updateTask(taskId, updateData, tenant) {
        return await Task.findOneAndUpdate({ _id: taskId, tenant }, updateData, {
            new: true, // Return updated object
            runValidators: true,
        });
    }

    async deleteTask(taskId, tenant) {
        return await Task.findOneAndDelete({ _id: taskId, tenant });
    }
}

module.exports = new TaskRepository();
