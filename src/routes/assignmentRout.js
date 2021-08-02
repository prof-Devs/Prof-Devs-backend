const express = require('express');
const Collection = require('./data.collection');
const bearerAuth = require('../auth/middleware/bearer');
const permissions = require('../auth/middleware/acl');
const assignment = require('../auth/models/assignmets');
const router = express.Router();

const assignmentInstCollection = new Collection(assignment);

// -------------------//

// assignment route 
router.get('/student', bearerAuth.func1,assignmentHandleGetAll);
router.get('/student/:id', bearerAuth.func1, assignmentHandleGetOne);
router.get('/teacher',bearerAuth.func2, assignmentHandleGetAll);
router.get('/teacher/:id', bearerAuth.func2, assignmentHandleGetOne);
router.post('/', bearerAuth.func2, permissions('create'), assignmentHandleCreate);
router.put('/:id', bearerAuth.func2, permissions('update'), assignmentHandleUpdate);
router.put('/student/:id', bearerAuth.func1, permissions('studentUpdate'), HandleUpdateAssignmentStudents);
router.delete('/:id',bearerAuth.func2, permissions('delete'), assignmentHandleDelete);

// assignment functions

async function assignmentHandleGetAll(req, res) {
    try {
        let allRecords = await assignmentInstCollection.get();
        res.status(200).json(allRecords);

    } catch (e) {
        throw new Error(e.message)
    }
}

async function assignmentHandleGetOne(req, res) {
    try {
        const id = req.params.id;
        let theRecord = await assignmentInstCollection.get(id)
        res.status(200).json(theRecord);
    } catch (e) {
        throw new Error(e.message)
    }

}

async function assignmentHandleCreate(req, res) {
    try {
        let obj = req.body;
        let newRecord = await assignmentInstCollection.create(obj);
        res.status(201).json(newRecord);
    } catch (e) {
        throw new Error(e.message)
    }
}

async function assignmentHandleUpdate(req, res) {
    try {
        const id = req.params.id;
        const obj = req.body;
        let updatedRecord = await assignmentInstCollection.update(id, obj)
        res.status(200).json(updatedRecord);
    } catch (e) {
        throw new Error(e.message)
    }
}

async function HandleUpdateAssignmentStudents(req, res) {
    try {
        const id = req.params.id;
        const solution=req.body.solution;
        let objNew={"solution":solution}
        let updatedRecord = await assignmentInstCollection.update(id,objNew)
        res.status(200).json(updatedRecord);
    } catch (e) {
        throw new Error(e.message)
    }
}

async function assignmentHandleDelete(req, res) {
    try {
        let id = req.params.id;
        let deletedRecord = await assignmentInstCollection.delete(id);
        res.status(200).json('deleted');
    } catch (e) {
        throw new Error(e.message)
    }
}

module.exports = router;