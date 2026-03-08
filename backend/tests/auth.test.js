const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const { connectRedis, getRedisClient } = require('../src/config/redis');

// Mock Redis
jest.mock('redis', () => ({
    createClient: jest.fn().mockReturnValue({
        on: jest.fn(),
        connect: jest.fn().mockResolvedValue(),
        get: jest.fn().mockResolvedValue(null),
        setEx: jest.fn().mockResolvedValue('OK'),
        del: jest.fn().mockResolvedValue(1)
    })
}));

describe('Auth API Endpoints', () => {

    beforeAll(async () => {
        require('dotenv').config();
        await connectRedis();
        // Connect to a test db using real Atlas URI
        const baseUri = process.env.MONGO_URI || 'mongodb://localhost:27017';
        const testUri = baseUri.includes('mongodb+srv')
            ? baseUri.replace('/?', '/intern_api_test?')
            : baseUri + '/intern_api_test';
        await mongoose.connect(testUri);
        // Clean up
        await mongoose.connection.db.dropDatabase();
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should deny registration without x-tenant-id', async () => {
        const res = await request(app)
            .post('/api/v1/auth/register')
            .send({ name: 'Test', email: 'test@test.com', password: 'password', role: 'USER' });

        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toContain('Missing x-tenant-id');
    });

    it('should successfully register a user', async () => {
        const res = await request(app)
            .post('/api/v1/auth/register')
            .set('x-tenant-id', 'test-tenant')
            .send({ name: 'Test User', email: 'user@test.com', password: 'password', role: 'USER' });

        expect(res.statusCode).toEqual(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('token');
    });

    it('should log in existing user', async () => {
        const res = await request(app)
            .post('/api/v1/auth/login')
            .set('x-tenant-id', 'test-tenant')
            .send({ email: 'user@test.com', password: 'password' });

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('token');
    });
});
