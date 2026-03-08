const TaskRepository = require('../repositories/TaskRepository');
const { getRedisClient } = require('../config/redis');

class TaskService {
    async getTasks(user, tenant) {
        const cacheKey = `tasks_${tenant}_${user.id}_${user.role}`;
        const redisClient = getRedisClient();

        // Check Cache
        if (redisClient) {
            const cachedTasks = await redisClient.get(cacheKey);
            if (cachedTasks) {
                return JSON.parse(cachedTasks);
            }
        }

        let tasks;
        // If ADMIN, return all tasks; if USER, return only user's tasks
        if (user.role === 'ADMIN') {
            tasks = await TaskRepository.findAllTasks(tenant);
        } else {
            tasks = await TaskRepository.findTasksByUserId(user.id, tenant);
        }

        // Save to Cache
        if (redisClient) {
            // Set cache TTL 10 mins
            await redisClient.setEx(cacheKey, 600, JSON.stringify(tasks));
        }
        return tasks;
    }

    // Cache invalidation helper
    async flushTasksCache(tenant, userId, role) {
        const redisClient = getRedisClient();
        if (redisClient) {
            // In a real prod environment we'd use hdel or scan keys. For simplicity, delete exact keys.
            await redisClient.del(`tasks_${tenant}_${userId}_${role}`);
            if (role !== 'ADMIN') await redisClient.del(`tasks_${tenant}_${userId}_ADMIN`);
            // Optional: Clear global admin cache if a user mutated
        }
    }

    async createTask(taskData, userId, tenant) {
        await this.flushTasksCache(tenant, userId, 'USER'); // Clear cache
        return await TaskRepository.createTask({ ...taskData, user: userId }, tenant);
    }

    async updateTask(taskId, updateData, user, tenant) {
        const task = await TaskRepository.findTaskById(taskId, tenant);

        if (!task) {
            throw new Error('Task not found');
        }

        // Role-Based Validation ensures User only modifies their own tasks (Admins can modify any)
        if (task.user.toString() !== user.id && user.role !== 'ADMIN') {
            throw new Error('User not authorized to update this task');
        }

        await this.flushTasksCache(tenant, user.id, user.role); // Invalidate Cache
        return await TaskRepository.updateTask(taskId, updateData, tenant);
    }

    async deleteTask(taskId, user, tenant) {
        const task = await TaskRepository.findTaskById(taskId, tenant);

        if (!task) {
            throw new Error('Task not found');
        }

        // Role-Based Validation
        if (task.user.toString() !== user.id && user.role !== 'ADMIN') {
            throw new Error('User not authorized to delete this task');
        }

        await TaskRepository.deleteTask(taskId, tenant);
        await this.flushTasksCache(tenant, user.id, user.role); // Invalidate Cache
        return { id: taskId };
    }
}

module.exports = new TaskService();
