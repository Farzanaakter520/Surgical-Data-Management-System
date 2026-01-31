const request = require('supertest');
const app = require('../../app.js');
const database = require('../../services/database.js');
const jwt = require('jsonwebtoken');
const { refresh } = require('../../controllers/authController.js');

describe('Auth Controller', () => {
    let bearerToken;
    let refreshToken;
    afterAll(async () => {
        await database.pool.end(); // Close the pool after all tests
    });
    beforeAll(async () => {
        // Log in to get a valid token for testing profile
        const response = await request(app)
            .post('/auth/signin')
            .send({ user_id: 'USR001', password: 'abcxyz123' });

        refreshToken = response.body.refreshToken;
    });

    describe('POST /auth/signin', () => {
        it('should login an existing user with correct credentials', async () => {
            const response = await request(app)
                .post('/auth/signin')
                .send({ user_id: 'USR001', password: 'abcxyz123' });

            expect(response.statusCode).toBe(200);
          //  expect(response.body).toHaveProperty('accessToken');
            expect(response.body).toHaveProperty('refreshToken');
           // bearerToken = response.body.accessToken;
            refreshToken = response.body.refreshToken;
        });

        it('should return 400 for invalid credentials', async () => {
            const response = await request(app)
                .post('/auth/signin')
                .send({ user_id: 'USR001', password: 'wrongpassword' });

            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe('Invalid credentials');
        });
    });

    describe('GET /auth/profile', () => {
        it('should return the user profile if authenticated', async () => {
            const response = await request(app)
                .get('/auth/profile')
               // .set('Authorization', `Bearer ${bearerToken}`)
                .set('Cookie', [`jwt=${refreshToken}`])
                .send({ action_mode: "get_by_id", userId: 'USR001' });

                //console.log(response.body); // Log the response body for debugging

                expect(response.statusCode).toBe(200);
                expect(response.body).toHaveProperty('user_id', 'USR001');
                expect(response.body).toHaveProperty('user_name', 'Atiqur');
                expect(response.body).toHaveProperty('user_name_beng', 'আতিকুর');
        });

        it('should return 401 if not authenticated', async () => {
            const response = await request(app)
                .get('/auth/profile');
                // .set('Authorization', `Bearer ${bearerToken}`);
            expect(response.statusCode).toBe(401);
            expect(response.body.message).toBe('Unauthorised');
        });
    });

   
   
 

        it('should logout successfully with a valid token', async () => {
            const response = await request(app)
                .post('/auth/logout')
                // .set('Authorization', `Bearer ${bearerToken}`)
                .set('Cookie', [`jwt=${refreshToken}`]);

            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBe('Logged out successfully');
        });

       it('should return 401 for logout without a token', async () => {
            const response = await request(app)
                .post('/auth/logout');

            expect(response.statusCode).toBe(401);
            expect(response.body.message).toBe('Unauthorised');
        });
    
    });