'use strict';

const mongoose = require('mongoose');
const functionModel = require('./functions')

const teachers = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    teachersCourses: { type: Object, required: false },
    role: { type: String, required: true, default: 'admin', enum: 'admin' }
});

teachers.virtual('token').get(functionModel.forVirtual);

teachers.virtual('capabilities').get(functionModel.forVirtual2);

teachers.pre('save', functionModel.forPre);

// BASIC AUTH
teachers.statics.authenticateBasic = functionModel.forBasic;

// BEARER AUTH
teachers.statics.authenticateWithToken = functionModel.forBearer;

const modelTeacher = mongoose.model('teachers', teachers);

function seeding() {
    const Ibrahim = new modelTeacher({
        email: 'ibrahimabuawadwork@gmail.com',
        password: '0000',
        firstName: 'Ibrahim',
        lastName: 'AbuAwad',
        teachersCourses: ['math', 'art', 'music'],
        role: 'admin'
    });
    const Dina = new modelTeacher({
        email: 'dina.faur@yahoo.com',
        password: '0000',
        firstName: 'Dina',
        lastName: 'Khaleel',
        teachersCourses: 'science',
        role: 'admin'
    });
    const Haneen = new modelTeacher({
        email: 'aabonser@gmail.com',
        password: '0000',
        firstName: 'Haneen',
        lastName: 'Abonser',
        teachersCourses: 'biology',
        role: 'admin'
    });

    // Ibrahim.save();
    // Dina.save();
    // Haneen.save()

}

seeding();

module.exports = modelTeacher;

