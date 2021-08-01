const supergoose = require('@code-fellows/supergoose');
const server = require('../src/server');
const request = supergoose(server.server);
const bcrypt = require('bcrypt');
const { response } = require('express');

let  teacher = { email: 'faur@yahoo.com', password: '0000',firstName: 'teacher', lastName: 'Teacher lastName'}
let  students = { email: 'student@gmail.com', password: 'password', firstName: 'student', lastName: 'lastName', gender: 'male', age: '24' }

describe('CRUD for courses by teacher', () => {
    let teacherToken ;
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
        const response = await request.post('/signin/teacher').auth(teacher.email,teacher.password);
        teacherToken = response.body.token;

        expect(response.status).toBe(200);
        expect(response.body.token).toBeDefined();
        expect(response.body.user._id).toBeDefined();
        expect(response.body.user.email).toEqual(teacher.email);
        const passDecode = await bcrypt.compare( teacher.password,response.body.user.password)
        expect(passDecode).toBeTruthy();

    })

    test('sign up for students', async () => {
        const response = await request.post('/signup/student').send(students);
        expect(response.status).toBe(201);
        expect(response.body.token).toBeDefined();
        expect(response.body.user._id).toBeDefined();
        expect(response.body.user.email).toEqual(students.email);
    })
    test('student sign in ', async () => {
        const response = await request.post('/signin/user').auth(students.email,students.password);
        studentToken = response.body.token;
    
        expect(response.status).toBe(200);
        expect(response.body.token).toBeDefined();
        expect(response.body.user._id).toBeDefined();
        expect(response.body.user.email).toEqual(students.email);
        const passDecode = await bcrypt.compare( students.password,response.body.user.password)
        expect(passDecode).toBeTruthy();
    
    })

test('post method for quiz', async () => {
    const response = await request.post('/quiz').send({
        title: 'Math quiz',
        questions: [{question:'Q1', options:[1,2,3],correct_answer:2}],
        timer: 1
    }).set({ "Authorization": `Bearer ${teacherToken}` });
    expect(response.status).toBe(201);
    expect(response.body.title).toBe('Math quiz');
    expect(response.body.questions).toEqual([{question:'Q1', options:[1,2,3],correct_answer:2}]);
    expect(response.body.timer).toEqual(1);

    id = response.body._id;
})

test('get method for quiz by teacher', async () => {
    const response = await request.get('/quiz/teacher')
    .set({ "Authorization": `Bearer ${teacherToken}` });
    expect(response.status).toBe(200);
    // console.log(response.body);
    expect(response.body[0].title).toBe('Math quiz');
    expect(response.body[0].questions).toEqual([{question:'Q1', options:[1,2,3],correct_answer:2}]);
    expect(response.body[0].timer).toEqual(1);
})

test('get method for quiz by teacher using id', async () => {
    const response = await request.get(`/quiz/teacher/${id}`)
    .set({ "Authorization": `Bearer ${teacherToken}` });
    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Math quiz');
    expect(response.body.questions).toEqual([{question:'Q1', options:[1,2,3],correct_answer:2}]);
    expect(response.body.timer).toEqual(1);
})

test('get method for quiz by student', async () => {
    const response = await request.get('/quiz/student')
    .set({ "Authorization": `Bearer ${studentToken}` });
    expect(response.status).toBe(200);
    // console.log(response.body);
    expect(response.body[0].title).toBe('Math quiz');
    expect(response.body[0].questions).toEqual([{question:'Q1', options:[1,2,3],correct_answer:2}]);
    expect(response.body[0].timer).toEqual(1);
})

test('get method for quiz by student using id', async () => {
    const response = await request.get(`/quiz/student/${id}`)
    .set({ "Authorization": `Bearer ${studentToken}` });
    expect(response.status).toBe(200);
    // console.log(response.body);
    expect(response.body.title).toBe('Math quiz');
    expect(response.body.questions).toEqual([{question:'Q1', options:[1,2,3],correct_answer:2}]);
    expect(response.body.timer).toEqual(1);
})

test('update method for quiz by id', async () => {
    const response = await request.put(`/quiz/${id}`)
    .send({
        title: 'Math quiz',
        questions: [{question:'Q1', options:[1,2,3],correct_answer:2}],
        timer: 1
    })
    .set({ "Authorization": `Bearer ${teacherToken}` });
    expect(response.status).toBe(200);
    // console.log(response.body);
    expect(response.body.title).toBe('Math quiz');
    expect(response.body.questions).toEqual([{question:'Q1', options:[1,2,3],correct_answer:2}]);
    expect(response.body.timer).toEqual(1);

})

test('delete method for quiz by id', async () => {
    const response = await request.delete(`/quiz/${id}`)
    .set({ "Authorization": `Bearer ${teacherToken}` });
    expect(response.status).toBe(200);
})
})
