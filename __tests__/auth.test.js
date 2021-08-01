const supergoose = require('@code-fellows/supergoose');
const server = require('../src/server');
const request = supergoose(server.server);
const bcrypt = require('bcrypt');
// const base64 = require('base64');
require('dotenv').config();


let students = { email: 'student@gmail.com', password: 'password', firstName: 'student', lastName: 'lastName', gender: 'male', age: '24' }
  
let teacher = { email: 'ibrahimabuawadwork@gmail.com', password: '0000',firstName: 'teacher', lastName: 'Teacher lastName'}

let admin = { email: 'admin@yahoo.com', password: '0000',firstName: 'admin', lastName: 'admin lastName'}

describe('sign-up sign-in test', () => {
   let id ;
   let adminToken;
   let teacherToken;
   let idUser;
        test('sign up', async () => {
            const response = await request.post('/signup/student').send(students);
            expect(response.status).toBe(201);
            expect(response.body.token).toBeDefined();
            expect(response.body.user._id).toBeDefined();
            expect(response.body.user.email).toEqual(students.email);
            idUser=response.body.user._id;
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
    id = response.body.user._id;
    teacherToken = response.body.token;
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

// get students by admin

test('get students ', async () => {
    const response = await request.get(`/showStudents`).set({ "Authorization": `Bearer ${teacherToken}` });
    // console.log('accesssss',response.body);
    expect(response.status).toBe(200);
    // console.log(response.body);
    expect(response.body[0]).toEqual('student@gmail.com')
})

// delete students by admin

test('delete students ', async () => {
    const response = await request.delete(`/userDelete/${idUser}`).set({ "Authorization": `Bearer ${teacherToken}` });
    expect(response.status).toBe(200);
})

test('sign up for admin', async () => {
    const response = await request.post('/signup/admin').send(admin);
    expect(response.status).toBe(201);
    expect(response.body.token).toBeDefined();
    expect(response.body.user._id).toBeDefined();
    expect(response.body.user.email).toEqual(admin.email);
    adminToken = response.body.token;
})
test('admin sign in ', async () => {
    const response = await request.post('/signin/admin').auth(admin.email,admin.password);
    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(response.body.user._id).toBeDefined();
    expect(response.body.user.email).toEqual(admin.email);
    const passDecode = await bcrypt.compare( admin.password,response.body.user.password)
    expect(passDecode).toBeTruthy();

})

// get teachers by admin

test('get teacher ', async () => {
    const response = await request.get(`/getTeachers`);
    expect(response.status).toBe(200);
    // console.log(response.body);
    expect(response.body[1].email).toEqual('ibrahimabuawadwork@gmail.com')
})

// delete teacher by admin

test('admin delete teacher ', async () => {
    console.log('teacher id',id);
    const response = await request.delete(`/teacherDelete/${id}`)
    .set({ "Authorization": `Bearer ${adminToken}` });
    expect(response.status).toBe(200);
})

})
