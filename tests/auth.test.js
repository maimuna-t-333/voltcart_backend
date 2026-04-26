const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');

let mongo;
beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});
afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

describe('POST /api/v1/auth/register', () => {
  it('should register a new user and return 201', async () => {
    const res = await request(app).post('/api/v1/auth/register')
      .send({ name:'Test', email:'test@test.com', password:'password123' });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });
  it('should return 400 for duplicate email', async () => {
    await request(app).post('/api/v1/auth/register')
      .send({ name:'Test', email:'test@test.com', password:'password123' });
    const res = await request(app).post('/api/v1/auth/register')
      .send({ name:'Test', email:'test@test.com', password:'password123' });
    expect(res.status).toBe(400);
  });
});

describe('POST /api/v1/auth/login', () => {
  it('should login and return accessToken', async () => {
    await request(app).post('/api/v1/auth/register')
      .send({ name:'Login Test', email:'login@test.com', password:'password123' });
    const res = await request(app).post('/api/v1/auth/login')
      .send({ email:'login@test.com', password:'password123' });
    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
  });
});
