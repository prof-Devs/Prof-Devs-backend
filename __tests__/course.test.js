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

test('post method for course', async () => {
    const response = await request.post('/course').send({
        courseName: 'Math',
        courseDisc: 'Seience of numbers',
        courseStudents: ['hiba','ahmed'],
        courseTeacher: 'Dina'
    }).set({ "Authorization": `Bearer ${teacherToken}` });
    expect(response.status).toBe(201);
    expect(response.body.courseName).toBe('Math');
    expect(response.body.courseStudents[0]).toBe('hiba');
    expect(response.body.courseTeacher).toEqual('Dina');

    id = response.body._id;
})

test('get method for course by teacher', async () => {
    const response = await request.get('/course/teacher')
    .set({ "Authorization": `Bearer ${teacherToken}` });
    expect(response.status).toBe(200);
    console.log(response.body);
    expect(response.body[0].courseName).toBe('Math');
    expect(response.body[0].courseStudents[0]).toBe('hiba');
    expect(response.body[0].courseTeacher).toEqual('Dina');

})

test('get method for course by teacher using id', async () => {
    const response = await request.get(`/course/teacher/${id}`)
    .set({ "Authorization": `Bearer ${teacherToken}` });
    expect(response.status).toBe(200);
    console.log(response.body);
    expect(response.body.courseName).toBe('Math');
    expect(response.body.courseStudents[0]).toBe('hiba');
    expect(response.body.courseTeacher).toEqual('Dina');

})

test('get method for course by student', async () => {
    const response = await request.get('/course/student')
    .set({ "Authorization": `Bearer ${studentToken}` });
    expect(response.status).toBe(200);
    console.log(response.body);
    expect(response.body[0].courseName).toBe('Math');
    expect(response.body[0].courseStudents[0]).toBe('hiba');
    expect(response.body[0].courseTeacher).toEqual('Dina');

})

test('get method for course by student using id', async () => {
    const response = await request.get(`/course/student/${id}`)
    .set({ "Authorization": `Bearer ${studentToken}` });
    expect(response.status).toBe(200);
    console.log(response.body);
    expect(response.body.courseName).toBe('Math');
    expect(response.body.courseStudents[0]).toBe('hiba');
    expect(response.body.courseTeacher).toEqual('Dina');

})

test('update method for course by id', async () => {
    const response = await request.put(`/course/${id}`)
    .send({
        courseName: 'biology',
        courseDisc: 'structure of human',
        courseStudents: ['hiba','ahmed','Khaled'],
        courseTeacher: 'Dina'
    })
    .set({ "Authorization": `Bearer ${teacherToken}` });
    expect(response.status).toBe(200);
    console.log(response.body);
    expect(response.body.courseName).toBe('biology');
    expect(response.body.courseStudents[2]).toBe('Khaled');
    expect(response.body.courseTeacher).toEqual('Dina');

})

test('delete method for course by id', async () => {
    const response = await request.delete(`/course/${id}`)
    .set({ "Authorization": `Bearer ${teacherToken}` });
    expect(response.status).toBe(200);
})

})
