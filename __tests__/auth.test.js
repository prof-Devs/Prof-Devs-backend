const supergoose = require('@code-fellows/supergoose');
const server = require('../src/server');
const request = supergoose(server.server);
const bcrypt = require('bcrypt');
// const base64 = require('base64');
require('dotenv').config();


let students = { email: 'student@gmail.com', password: 'password', firstName: 'student', lastName: 'lastName', gender: 'male', age: '24' }
  
let teacher = { email: 'dina.faur@yahoo.com', password: '0000',firstName: 'teacher', lastName: 'Teacher lastName'}

describe('sign-up sign-in test', () => {
   
        test('sign up', async () => {
            const response = await request.post('/signup/student').send(students);
            expect(response.status).toBe(201);
            expect(response.body.token).toBeDefined();
            expect(response.body.user._id).toBeDefined();
            expect(response.body.user.email).toEqual(students.email);
    })

    test('student sign in ', async () => {
        const response = await request.post('/signin/user').auth(students.email,students.password);
        expect(response.status).toBe(200);
        expect(response.body.token).toBeDefined();
        expect(response.body.user._id).toBeDefined();
        expect(response.body.user.email).toEqual(students.email);
        const passDecode = await bcrypt.compare( students.password,response.body.user.password)
        expect(passDecode).toBeTruthy();

})

test('sign up for teacher', async () => {
    const response = await request.post('/signup/teacher').send(teacher);
    expect(response.status).toBe(201);
    expect(response.body.token).toBeDefined();
    expect(response.body.user._id).toBeDefined();
    expect(response.body.user.email).toEqual(teacher.email);
})
test('teacher sign in ', async () => {
    const response = await request.post('/signin/teacher').auth(teacher.email,teacher.password);
    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(response.body.user._id).toBeDefined();
    expect(response.body.user.email).toEqual(teacher.email);
    const passDecode = await bcrypt.compare( teacher.password,response.body.user.password)
    expect(passDecode).toBeTruthy();

})


})
