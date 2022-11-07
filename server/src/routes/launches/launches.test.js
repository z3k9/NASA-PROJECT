const request = require('supertest');
const app = require('../../app');
const { mongoConnect, mongoDisconnect } = require('../../services/mongo');

describe('Launches API', ()=>{
    beforeAll( async()=>{
        await mongoConnect();
    }, 30000);
   
    describe('TEST GET /launches', ()=>{
        test('It should respond with 200 success', async ()=>{
            const response = await request(app)
                .get('/launches')
                .expect('Content-Type', /json/)
                .expect(200)     
        })
    });
    
    describe('TEST POST /launches',()=>{
        const completeLaunchData ={
            mission: 'USS Enterprise',
            rocket: 'NCC 1701-D',
            target: 'Kepler-1652 b',
            launchDate: 'January 4, 2028'
        }
        const launchDataWithoutDate = {
            mission: 'USS Enterprise',
            rocket: 'NCC 1701-D',
            target: 'Kepler-1652 b',
        }
        const launchDataWithInvalidDate = {
            mission: 'USS Enterprise',
            rocket: 'NCC 1701-D', 
            target: 'Kepler-1652 b',
            launchDate: 'zoot'
        }
        test('It should respond with 201 success', async ()=>{
            const response = await request(app)
                .post('/launches')
                .send(completeLaunchData)
                .expect('Content-type', /json/)
                .expect(201);
            const requestDate = new Date(completeLaunchData.launchDate).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();
            expect(responseDate).toBe(requestDate);
            expect(response.body).toMatchObject(launchDataWithoutDate);   
        });
        test('It should catch missing required properties', async ()=>{
            const response = await request(app)
                .post('/launches')
                .send(launchDataWithoutDate)
                .expect('Content-type', /json/)
                .expect(400);
    
            expect(response.body).toStrictEqual({
                error: 'Missing required launch property'
            });
        });
        test('It should catch invalid dates', async ()=>{
            const response = await request(app)
                .post('/launches')
                .send(launchDataWithInvalidDate)
                .expect('Content-type', /json/)
                .expect(400)
            expect(response.body).toStrictEqual({
                error: 'Invalid launch date'
            });
        });
    });
});

