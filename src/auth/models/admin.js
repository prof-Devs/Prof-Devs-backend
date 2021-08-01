'use strict';

const mongoose = require('mongoose');
const functionModel = require('./functions')

const admin = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role: { type: String, required: true, default: 'admin', enum: 'admin' }
});

admin.virtual('token').get(functionModel.forVirtual);

admin.virtual('capabilities').get(functionModel.forVirtual2);

admin.pre('save', functionModel.forPre);

// BASIC AUTH
admin.statics.authenticateBasic = functionModel.forBasic;

// BEARER AUTH
admin.statics.authenticateWithToken = functionModel.forBearer;

const modelTeacher = mongoose.model('admin', admin);

function seeding() {
    const Admin = new modelTeacher({
        email: 'admin@gmail.com',
        password: '0000',
        firstName: 'admin',
        lastName: 'lastName',
        role: 'admin'
    });
    // Admin.save();
}
seeding();

module.exports = modelTeacher;

