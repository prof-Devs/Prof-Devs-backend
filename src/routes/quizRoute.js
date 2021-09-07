
const express = require('express');
const Collection = require('./data.collection');
const bearerAuth = require('../auth/middleware/bearer');
const permissions = require('../auth/middleware/acl');
const quizModel = require('../auth/models/quiz');
const router = express.Router();

const quizInstCollection = new Collection(quizModel);

// -------------------//

// quiz route 
router.get('/student', bearerAuth.func1, quizHandleGetAll);
router.get('/student/:id', bearerAuth.func1, quizHandleGetOne);
router.get('/teacher',bearerAuth.func2, quizHandleGetAll);
router.get('/teacher/:id', bearerAuth.func2, quizHandleGetOne);
router.post('/',bearerAuth.func2, permissions('create'), quizHandleCreate);
router.put('/:id', bearerAuth.func2, permissions('update'), quizHandleUpdate);
router.put('/student/:id', bearerAuth.func1, permissions('studentUpdate'), HandleUpdatequizStudents);
router.delete('/:id',bearerAuth.func2, permissions('delete'), quizHandleDelete);

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

async function HandleUpdatequizStudents(req, res) {
    try {
        const id = req.params.id;
        const solution=req.body.solution;
        let objNew={"solution":solution}
        let updatedRecord = await quizInstCollection.update(id,objNew)
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