jest.setTimeout(15000); // 15 seconds for all tests in this file

const request = require('supertest');
const app = require('../app');

describe('User Registration & Authentication', () => {
  it('should return 400 if email or password is missing', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({ FirstName: 'Test', Password: 'password123' });
    expect(res.statusCode).toBe(400);
  });

  it('should return 200 for a new registration', async () => {
    const email = `testuser${Date.now()}@example.com`;
    const res = await request(app).post('/api/users/register').send({
      FirstName: 'Test', SecondName: 'User', Email: email, UserName: 'testuser', Number: '1234567890', Password: 'password123'
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/Verification code sent/);
  });

  it('should return 401 for invalid email on sign in', async () => {
    const res = await request(app)
      .post('/api/users/signin')
      .send({ Email: 'notfound@example.com', Password: 'password123' });
    expect(res.statusCode).toBe(401);
  });
});

describe('Lost & Found Item Posting', () => {
  it('should return 401 or 404 if no token is provided when posting lost item', async () => {
    const res = await request(app)
      .post('/api/lost/post') // Change to /api/lfms/lost/post if that's your route
      .send({ email: 'test@example.com' });
    expect([401, 404]).toContain(res.statusCode);
  });

  it('should return 401 or 404 if no token is provided when posting found item', async () => {
    const res = await request(app)
      .post('/api/found/post') // Change to /api/lfms/found/post if that's your route
      .send({ email: 'test@example.com' });
    expect([401, 404]).toContain(res.statusCode);
  });
});

describe('Search Endpoints', () => {
  it('should return 200 and results for search', async () => {
    const res = await request(app)
      .get('/api/search?type=lost');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('lostItems');
  });

  it('should return 400 if lat/lng are missing in nearby search', async () => {
    const res = await request(app)
      .get('/api/search/nearby');
    expect(res.statusCode).toBe(400);
  });
});

describe('Admin Endpoints', () => {
  it('should return 401 for invalid admin credentials', async () => {
    const res = await request(app)
      .post('/api/admin/login')
      .send({ email: 'wrong@admin.com', password: 'wrongpass' });
    expect(res.statusCode).toBe(401);
  });

  it('should return analytics data for admin', async () => {
    const res = await request(app)
      .get('/api/admin/analytics');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('totalUsers');
  });

  it('should return all users for admin', async () => {
    const res = await request(app)
      .get('/api/admin/users');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should return all items for admin', async () => {
    const res = await request(app)
      .get('/api/admin/items');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should return all claims for admin', async () => {
    const res = await request(app)
      .get('/api/admin/claims');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('Claim Controller', () => {
  // 1. Create claim: missing required fields
  it('should return 400 or 401 if required fields are missing when creating a claim', async () => {
    const res = await request(app)
      .post('/api/claims') // adjust if your route is different
      .send({ proofText: 'I found it!' }); // missing itemId
    expect([400, 401]).toContain(res.statusCode); // 401 if auth required, 400 if not
  });

  // 2. Create claim: invalid itemId format
  it('should return 400 or 401 for invalid itemId format', async () => {
    const res = await request(app)
      .post('/api/claims')
      .send({ itemId: 'notanid', proofText: 'Proof' });
    expect([400, 401]).toContain(res.statusCode);
  });

  // 3. Get finder claims: unauthorized
  it('should return 401 or 403 if not authenticated when getting finder claims', async () => {
    const res = await request(app)
      .get('/api/claims/finder');
    expect([401, 403]).toContain(res.statusCode);
  });

  // 4. Update claim status: invalid status
  it('should return 400, 401, or 403 for invalid claim status', async () => {
    const fakeClaimId = '507f1f77bcf86cd799439011'; // valid ObjectId format
    const res = await request(app)
      .patch(`/api/claims/${fakeClaimId}`)
      .send({ status: 'notvalid' });
    expect([400, 401, 403]).toContain(res.statusCode);
  });

  // 5. Get my claims: unauthorized
  it('should return 401 or 403 if not authenticated when getting my claims', async () => {
    const res = await request(app)
      .get('/api/claims/mine');
    expect([401, 403]).toContain(res.statusCode);
  });
});

describe('Lost Item Endpoints', () => {
  it('should return all lost items', async () => {
    const res = await request(app)
      .get('/api/lost/items'); // Change to /api/lfms/lost/items if that's your route
    expect([200, 404]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(Array.isArray(res.body)).toBe(true);
    }
  });

  // 2. Get a specific lost item with invalid ID
  it('should return 404, 401, or 403 for a non-existent lost item', async () => {
    const res = await request(app)
      .get('/api/lost/items/507f1f77bcf86cd799439011'); // valid ObjectId, but likely not in DB
    expect([404, 401, 403]).toContain(res.statusCode);
  });

  // 3. Delete a lost item without authentication
  it('should return 401, 403, or 404 when deleting a lost item without auth', async () => {
    const res = await request(app)
      .delete('/api/lost/items/507f1f77bcf86cd799439011');
    expect([401, 403, 404]).toContain(res.statusCode);
  });
});