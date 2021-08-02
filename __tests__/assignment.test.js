const supergoose = require('@code-fellows/supergoose');
const server = require('../src/server');
const request = supergoose(server.server);
const bcrypt = require('bcrypt');
const { response } = require('express');

let teacher = { email: 'faur@yahoo.com', password: '0000', firstName: 'teacher', lastName: 'Teacher lastName' }
let students = { email: 'student@gmail.com', password: 'password', firstName: 'student', lastName: 'lastName', gender: 'male', age: '24' }

describe('CRUD for courses by teacher', () => {
    let teacherToken;
    let studentToken;
    let id;

    test('sign up for teacher', async () => {
        const response = await request.post('/signup/teacher').send(teacher);
        expect(response.status).toBe(201);
        expect(response.body.token).toBeDefined();
        expect(response.body.user._id).toBeDefined();
        expect(response.body.user.email).toEqual(teacher.email);

    })
    test('teacher sign in ', async () => {
        const response = await request.post('/signin/teacher').auth(teacher.email, teacher.password);
        teacherToken = response.body.token;

        expect(response.status).toBe(200);
        expect(response.body.token).toBeDefined();
        expect(response.body.user._id).toBeDefined();
        expect(response.body.user.email).toEqual(teacher.email);
        const passDecode = await bcrypt.compare(teacher.password, response.body.user.password)
        expect(passDecode).toBeTruthy();

    })

    test('sign up for students', async () => {
        const response = await request.post('/signup/student').send(students);
        expect(response.status).toBe(201);
        expect(response.body.token).toBeDefined();
        expect(response.body.user._id).toBeDefined();
        expect(response.body.user.email).toEqual(students.email);
        studentToken = response.body.token
    })
    test('student sign in ', async () => {
        const response = await request.post('/signin/user').auth(students.email, students.password);
        studentToken = response.body.token;

        expect(response.status).toBe(200);
        expect(response.body.token).toBeDefined();
        expect(response.body.user._id).toBeDefined();
        expect(response.body.user.email).toEqual(students.email);
        const passDecode = await bcrypt.compare(students.password, response.body.user.password)
        expect(passDecode).toBeTruthy();

    })


    test('post method for assignment', async () => {
        const response = await request.post('/assignment').send({
            title: 'Math assignment',
            text: 'describe Seience of numbers?',
            due_date: '2012-04-23T18:25:43.511Z'
        }).set({ "Authorization": `Bearer ${teacherToken}` });
        expect(response.status).toBe(201);
        expect(response.body.title).toBe('Math assignment');
        expect(response.body.text).toBe('describe Seience of numbers?');
        expect(response.body.due_date).toEqual('2012-04-23T18:25:43.511Z');

        id = response.body._id;
    })

    test('get method for assignment by teacher', async () => {
        const response = await request.get('/assignment/teacher')
            .set({ "Authorization": `Bearer ${teacherToken}` });
        expect(response.status).toBe(200);
        // (response.body);
        expect(response.body[0].title).toBe('Math assignment');
        expect(response.body[0].text).toBe('describe Seience of numbers?');
        expect(response.body[0].due_date).toEqual('2012-04-23T18:25:43.511Z');
    })

    test('get method for assignment by teacher using id', async () => {
        const response = await request.get(`/assignment/teacher/${id}`)
            .set({ "Authorization": `Bearer ${teacherToken}` });
        expect(response.status).toBe(200);
        expect(response.body.title).toBe('Math assignment');
        expect(response.body.text).toBe('describe Seience of numbers?');
        expect(response.body.due_date).toEqual('2012-04-23T18:25:43.511Z');
    })

    test('get method for assignment by student', async () => {
        const response = await request.get('/assignment/student')
            .set({ "Authorization": `Bearer ${studentToken}` });
        expect(response.status).toBe(200);
        (response.body);
        expect(response.body[0].title).toBe('Math assignment');
        expect(response.body[0].text).toBe('describe Seience of numbers?');
        expect(response.body[0].due_date).toEqual('2012-04-23T18:25:43.511Z');
    })

    test('get method for assignment by student using id', async () => {
        const response = await request.get(`/assignment/student/${id}`)
            .set({ "Authorization": `Bearer ${studentToken}` });
        expect(response.status).toBe(200);
        (response.body);
        expect(response.body.title).toBe('Math assignment');
        expect(response.body.text).toBe('describe Seience of numbers?');
        expect(response.body.due_date).toEqual('2012-04-23T18:25:43.511Z');
    })

    test('update method for assignment by id', async () => {
        const response = await request.put(`/assignment/${id}`)
            .send({
                title: 'new Math assignment',
                text: 'updated describe Seience of numbers?',
                due_date: '2012-04-23T18:25:43.511Z'
            })
            .set({ "Authorization": `Bearer ${teacherToken}` });
        expect(response.status).toBe(200);
        (response.body);
        expect(response.body.title).toBe('new Math assignment');
        expect(response.body.text).toBe('updated describe Seience of numbers?');
        expect(response.body.due_date).toEqual('2012-04-23T18:25:43.511Z');
    })

    // update assignment solution by students

    test('update assignment solution by students using id', async () => {
        const response = await request.put(`/assignment/student/${id}`)
            .send({
                solution: [{ "email": "testEmail1", "solution": "after111122222222" }, { "email": "testEmail1", solution: "after111122222222" }]
            })
            .set({ "Authorization": `Bearer ${studentToken}` });
        expect(response.status).toBe(200);
        // (response.body);
        expect(response.body.solution).toEqual([{ "email": "testEmail1", "solution": "after111122222222" }, { "email": "testEmail1", solution: "after111122222222" }]);
    })

    test('delete method for assignment by id', async () => {
        const response = await request.delete(`/assignment/${id}`)
            .set({ "Authorization": `Bearer ${teacherToken}` });
        expect(response.status).toBe(200);
    })
})
