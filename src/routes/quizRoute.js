
const express = require('express');
const Collection = require('./data.collection');
const bearerAuth = require('../auth/middleware/bearer');
const permissions = require('../auth/middleware/acl');
const quiz = require('../auth/models/quiz');
const router = express.Router();

const quizInstCollection = new Collection(quiz);

// -------------------//

// quiz route 
router.get('/', bearerAuth, quizHandleGetAll);
router.get('/:id', bearerAuth, quizHandleGetOne);
router.post('/', bearerAuth, permissions('create'), quizHandleCreate);
router.put('/:id', bearerAuth, permissions('update'), quizHandleUpdate);
router.delete('/:id', bearerAuth, permissions('delete'), quizHandleDelete);

// quiz functions

async function quizHandleGetAll(req, res) {
    try {
        let allRecords = await quizInstCollection.get();
        res.status(200).json(allRecords);

    } catch (e) {
        throw new Error(e.message)
    }
}

async function quizHandleGetOne(req, res) {
    try {
        const id = req.params.id;
        let theRecord = await quizInstCollection.get(id)
        res.status(200).json(theRecord);
    } catch (e) {
        throw new Error(e.message)
    }

}

async function quizHandleCreate(req, res) {
    try {
        let obj = req.body;
        let newRecord = await quizInstCollection.create(obj);
        res.status(201).json(newRecord);
    } catch (e) {
        throw new Error(e.message)
    }
}

async function quizHandleUpdate(req, res) {
    try {
        const id = req.params.id;
        const obj = req.body;
        let updatedRecord = await quizInstCollection.update(id, obj)
        res.status(200).json(updatedRecord);
    } catch (e) {
        throw new Error(e.message)
    }
}

async function quizHandleDelete(req, res) {
    try {
        let id = req.params.id;
        let deletedRecord = await quizInstCollection.delete(id);
        res.status(200).json('deleted');
    } catch (e) {
        throw new Error(e.message)
    }
}

module.exports = router;