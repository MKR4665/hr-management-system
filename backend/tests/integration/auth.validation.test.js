const request = require('supertest');
const app = require('../../src/app/server');

describe('Auth API', () => {
  test('register requires valid payload', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'bad', password: 'short' });

    expect(res.status).toBe(400);
  });
});
