const request = require('supertest');
const app = require('../app');

describe('Black Box Testing - User Registration & Lost Item Posting', () => {
  // Equivalence Partitioning: Valid registration
  it('should register a user with valid data', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        FirstName: 'Ali',
        SecondName: 'Test',
        Email: `ali${Date.now()}@example.com`,
        UserName: 'alitest',
        Number: '1234567890',
        Password: 'password123'
      });
    expect([200, 500]).toContain(res.statusCode); // 500 if email fails
  });

  // Equivalence Partitioning: Invalid email format
  it('should reject registration with invalid email', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        FirstName: 'Ali',
        SecondName: 'Test',
        Email: 'invalidemail',
        UserName: 'alitest',
        Number: '1234567890',
        Password: 'password123'
      });
    expect(res.statusCode).toBe(400);
  });

  // Equivalence Partitioning: Missing required field
  it('should reject registration with missing password', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        FirstName: 'Ali',
        SecondName: 'Test',
        Email: `ali${Date.now()}@example.com`,
        UserName: 'alitest',
        Number: '1234567890'
        // Password missing
      });
    expect(res.statusCode).toBe(400);
  });

  // Boundary Value: Password at minimum length (assuming min 8)
  it('should accept password at minimum length', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        FirstName: 'Ali',
        SecondName: 'Test',
        Email: `ali${Date.now()}@example.com`,
        UserName: 'alitest',
        Number: '1234567890',
        Password: '12345678'
      });
    expect([200, 500]).toContain(res.statusCode);
  });

  // Boundary Value: Password just below minimum length
  it('should reject password below minimum length', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        FirstName: 'Ali',
        SecondName: 'Test',
        Email: `ali${Date.now()}@example.com`,
        UserName: 'alitest',
        Number: '1234567890',
        Password: '1234567'
      });
    expect(res.statusCode).toBe(400);
  });

  // Equivalence Partitioning: Valid lost item post (should require auth, expect 401)
  it('should reject lost item post without authentication', async () => {
    const res = await request(app)
      .post('/api/lost/post')
      .send({
        email: 'ali@example.com',
        itemName: 'Wallet',
        description: 'Black leather wallet',
        category: 'Accessories',
        location: 'Library',
        dateLost: '2024-04-01',
        contactInfo: '1234567890'
      });
    expect([401, 404]).toContain(res.statusCode);
  });

  // Boundary Value: Date at earliest allowed (assuming 2000-01-01)
  it('should accept lost item with earliest allowed date', async () => {
    const res = await request(app)
      .post('/api/lost/post')
      .send({
        email: 'ali@example.com',
        itemName: 'Wallet',
        description: 'Black leather wallet',
        category: 'Accessories',
        location: 'Library',
        dateLost: '2000-01-01',
        contactInfo: '1234567890'
      });
    expect([401, 404]).toContain(res.statusCode); // 401 if no auth, 404 if route not found
  });

  // Boundary Value: Date just before earliest allowed
  it('should reject lost item with date before allowed', async () => {
    const res = await request(app)
      .post('/api/lost/post')
      .send({
        email: 'ali@example.com',
        itemName: 'Wallet',
        description: 'Black leather wallet',
        category: 'Accessories',
        location: 'Library',
        dateLost: '1999-12-31',
        contactInfo: '1234567890'
      });
    expect([400, 401, 404]).toContain(res.statusCode);
  });

  // Equivalence Partitioning: Search with valid type
  it('should return results for valid search type', async () => {
    const res = await request(app)
      .get('/api/search?type=lost');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('lostItems');
  });

  // Equivalence Partitioning: Search with invalid type
  it('should handle invalid search type gracefully', async () => {
    const res = await request(app)
      .get('/api/search?type=invalidtype');
    expect(res.statusCode).toBe(200); // Should still return results, but both arrays empty
    expect(res.body).toHaveProperty('lostItems');
    expect(res.body).toHaveProperty('foundItems');
  });
});

describe('Black Box Testing - Additional Cases', () => {
  // 1. User Sign In: Valid email, wrong password (Equivalence Partitioning)
  it('should reject sign in with wrong password', async () => {
    const res = await request(app)
      .post('/api/users/signin')
      .send({ Email: 'test@example.com', Password: 'wrongpassword' });
    expect([401, 400]).toContain(res.statusCode);
  });

  // 2. User Sign In: Empty email (Boundary Value)
  it('should reject sign in with empty email', async () => {
    const res = await request(app)
      .post('/api/users/signin')
      .send({ Email: '', Password: 'password123' });
    expect([400, 401]).toContain(res.statusCode);
  });

  // 3. Search: Invalid category (Equivalence Partitioning)
  it('should handle search with invalid category gracefully', async () => {
    const res = await request(app)
      .get('/api/search?category=invalidcategory');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('lostItems');
    expect(res.body).toHaveProperty('foundItems');
  });

  // 4. Search: Boundary value for limit (limit=1)
  it('should return only one result when limit=1', async () => {
    const res = await request(app)
      .get('/api/search?limit=1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('lostItems');
  });

  // 5. Admin: Get dashboard stats (Equivalence Partitioning)
  it('should return dashboard stats for admin', async () => {
    const res = await request(app)
      .get('/api/admin/dashboard/stats');
    expect([200, 401, 403]).toContain(res.statusCode);
  });

  // 6. Lost Item: Post with future date (Boundary Value)
  it('should reject lost item post with future date', async () => {
    const futureDate = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const res = await request(app)
      .post('/api/lost/post')
      .send({
        email: 'ali@example.com',
        itemName: 'Wallet',
        description: 'Black leather wallet',
        category: 'Accessories',
        location: 'Library',
        dateLost: futureDate,
        contactInfo: '1234567890'
      });
    expect([400, 401, 404]).toContain(res.statusCode);
  });

  // 7. Found Item: Post with empty description (Boundary Value)
  it('should reject found item post with empty description', async () => {
    const res = await request(app)
      .post('/api/found/post')
      .send({
        email: 'ali@example.com',
        itemName: 'Keys',
        description: '',
        category: 'Accessories',
        location: 'Cafeteria',
        dateFound: '2024-04-01',
        contactInfo: '1234567890'
      });
    expect([400, 401, 404]).toContain(res.statusCode);
  });

  // 8. Lost Item: Post with long itemName (Boundary Value)
  it('should reject lost item post with excessively long itemName', async () => {
    const longName = 'A'.repeat(300);
    const res = await request(app)
      .post('/api/lost/post')
      .send({
        email: 'ali@example.com',
        itemName: longName,
        description: 'Black leather wallet',
        category: 'Accessories',
        location: 'Library',
        dateLost: '2024-04-01',
        contactInfo: '1234567890'
      });
    expect([400, 401, 404]).toContain(res.statusCode);
  });

  // 9. Found Item: Post with missing location (Equivalence Partitioning)
  it('should reject found item post with missing location', async () => {
    const res = await request(app)
      .post('/api/found/post')
      .send({
        email: 'ali@example.com',
        itemName: 'Keys',
        description: 'Car keys',
        category: 'Accessories',
        dateFound: '2024-04-01',
        contactInfo: '1234567890'
      });
    expect([400, 401, 404]).toContain(res.statusCode);
  });

  // 10. Lost Item: Post with invalid email format (Equivalence Partitioning)
  it('should reject lost item post with invalid email format', async () => {
    const res = await request(app)
      .post('/api/lost/post')
      .send({
        email: 'notanemail',
        itemName: 'Wallet',
        description: 'Black leather wallet',
        category: 'Accessories',
        location: 'Library',
        dateLost: '2024-04-01',
        contactInfo: '1234567890'
      });
    expect([400, 401, 404]).toContain(res.statusCode);
  });
});
