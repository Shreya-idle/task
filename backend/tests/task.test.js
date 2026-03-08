const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');

// Mock dependencies
jest.mock('redis', () => ({
    createClient: jest.fn().mockReturnValue({
        on: jest.fn(),
        connect: jest.fn().mockResolvedValue(),
        get: jest.fn().mockResolvedValue(null),
        setEx: jest.fn().mockResolvedValue('OK'),
        del: jest.fn().mockResolvedValue(1)
    })
}));

let userToken;
let adminToken;
let taskId;

describe('Task API Endpoints', () => {

    beforeAll(async () => {
        require('dotenv').config();
        const baseUri = process.env.MONGO_URI || 'mongodb://localhost:27017';
        const testUri = baseUri.includes('mongodb+srv')
            ? baseUri.replace('/?', '/intern_api_test_task?')
            : baseUri + '/intern_api_test_task';
        await mongoose.connect(testUri);
        await mongoose.connection.db.dropDatabase();

        // Register User
        const resUser = await request(app)
            .post('/api/v1/auth/register')
            .set('x-tenant-id', 'test-tenant')
            .send({ name: 'User', email: 'u@test.com', password: 'password123', role: 'USER' });
        userToken = resUser.body.data.token;

        // Register Admin
        const resAdmin = await request(app)
            .post('/api/v1/auth/register')
            .set('x-tenant-id', 'test-tenant')
            .send({ name: 'Admin', email: 'a@test.com', password: 'password123', role: 'ADMIN' });
        adminToken = resAdmin.body.data.token;
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should create a task', async () => {
        const res = await request(app)
            .post('/api/v1/tasks')
            .set('x-tenant-id', 'test-tenant')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ title: 'Test Task', description: 'Desc' });

        expect(res.statusCode).toEqual(201);
        expect(res.body.success).toBe(true);
        taskId = res.body.data._id;
    });

    it('should fetch tasks for user', async () => {
        const res = await request(app)
            .get('/api/v1/tasks')
            .set('x-tenant-id', 'test-tenant')
            .set('Authorization', `Bearer ${userToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toHaveLength(1);
        expect(res.body.data[0].title).toBe('Test Task');
    });

    it('should update task if owner', async () => {
        const res = await request(app)
            .put(`/api/v1/tasks/${taskId}`)
            .set('x-tenant-id', 'test-tenant')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ status: 'completed' });

        expect(res.statusCode).toEqual(200);
        expect(res.body.data.status).toEqual('completed');
    });

    it('should delete task', async () => {
        const res = await request(app)
            .delete(`/api/v1/tasks/${taskId}`)
            .set('x-tenant-id', 'test-tenant')
            .set('Authorization', `Bearer ${adminToken}`); // Test Admin deletion privileges

        expect(res.statusCode).toEqual(200);
    });
});
