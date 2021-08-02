'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
let secret =(process.env.SECRET||'ibrahim');


const forVirtual = function () {
    let tokenObject = {
        email: this.email,
    }
    return jwt.sign(tokenObject, secret)
}

const forVirtual2 = function () {
    let acl = {
        user: ['read','studentUpdate'],
        editor: ['read', 'create', 'update','delete'],
        admin: ['read', 'create', 'update','delete','adminDelete']
    };
    return acl[this.role];
}

const forPre = async function () {
    try {
        if (this.isModified('password')) {
            this.password = await bcrypt.hash(this.password, 10);
        }
    } catch (e) {
        throw new Error(e.message);
    }
}

const forBasic = async function (email, password) {
    try {
        const user = await this.findOne({ email })
        const valid = await bcrypt.compare(password, user.password)
        if (valid) { return user; }
        throw new Error('Invalid User');
    } catch (e) {
        throw new Error(e.message);
    }
}

const forBearer = async function (token) {
    try {
        const parsedToken = jwt.verify(token, secret);
        const user = this.findOne({ email: parsedToken.email })
        if (user) { return user; }
        throw new Error("User Not Found");
    } catch (e) {
        throw new Error(e.message)
    }
}

module.exports = { forVirtual, forVirtual2, forPre, forBasic, forBearer }