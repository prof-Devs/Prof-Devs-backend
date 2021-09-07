
const express = require('express');
const Collection = require('./data.collection');
const bearerAuth = require('../auth/middleware/bearer');
const permissions = require('../auth/middleware/acl');
const course = require('../auth/models/course');
const { assignmentModel } = require('../auth/models/assignmets');


const router = express.Router();

const courseInstCollection = new Collection(course);
const assignmentInstCollection = new Collection(assignmentModel);

// -------------------//
// course route 

router.get('/student', bearerAuth.func1, courseHandleGetAll);
router.get('/student/:id', bearerAuth.func1, courseHandleGetOne);
router.get('/teacher', bearerAuth.func2, courseHandleGetAll);
router.get('/teacher/:id', bearerAuth.func2, courseHandleGetOne);
router.post('/', bearerAuth.func2, permissions('create'), courseHandleCreate);
router.put('/:id', bearerAuth.func2, permissions('update'), courseHandleUpdate);
router.delete('/:id', bearerAuth.func2, permissions('delete'), courseHandleDelete);

router.get('/student/getAssignments/:courseId', bearerAuth.func1, courseHandleGetAllAssignment);
router.get('/teacher/getAssignments/:courseId', bearerAuth.func2, courseHandleGetAllAssignment);

router.put('/addAssignment/:courseId', bearerAuth.func2, courseHandlePostAssignment);
// router.put('/updateAssignment/:courseId/:assignmentId',bearerAuth.func2, courseHandleUpdateAssignment);
// router.delete('/deleteAssignment/:courseId/:assignmentId',bearerAuth.func2, courseHandleDeleteAssignment);


// new

async function courseHandleGetAllAssignment(req, res) {
    try {
        const id = req.params.courseId;
        let allRecords = await courseInstCollection.get(id);
        let allAssignments = allRecords.assignmentModel;
        res.status(200).json(allAssignments);

    } catch (e) {
        throw new Error(e.message)
    }
};


async function courseHandlePostAssignment(req, res) {
    try {
        // let obj = req.body;
        const id = req.params.courseId;

        let allRecordsNew = await assignmentInstCollection.get();
        if (allRecordsNew) {
            allRecordsNew.filter(ele => {
                ele.courseId === id;
                console.log('llllllllll');
            })
        } else {
            res.status(201).json('🙄');

        }

        let updatedRecord = await courseInstCollection.update(id, allRecordsNew);

        console.log('updatedRecord ', updatedRecord );
        console.log('allRecordsNew ', allRecordsNew );
        res.status(201).json(updatedRecord );
    } catch (e) {
        throw new Error(e.message)
    }
}






// course functions

async function courseHandleGetAll(req, res) {
    try {
        let allRecords = await courseInstCollection.get();
        res.status(200).json(allRecords);

    } catch (e) {
        throw new Error(e.message)
    }
}

async function courseHandleGetOne(req, res) {
    try {
        const id = req.params.id;
        let theRecord = await courseInstCollection.get(id)
        res.status(200).json(theRecord);
    } catch (e) {
        throw new Error(e.message)
    }

}

async function courseHandleCreate(req, res) {
    try {
        let obj = req.body;
        let newRecord = await courseInstCollection.create(obj);
        res.status(201).json(newRecord);
    } catch (e) {
        throw new Error(e.message)
    }
}

async function courseHandleUpdate(req, res) {
    try {
        const id = req.params.id;
        const obj = req.body;
        let updatedRecord = await courseInstCollection.update(id, obj)
        res.status(200).json(updatedRecord);
    } catch (e) {
        throw new Error(e.message)
    }
}

async function courseHandleDelete(req, res) {
    try {
        let id = req.params.id;
        let deletedRecord = await courseInstCollection.delete(id);
        res.status(200).json('deleted');
    } catch (e) {
        throw new Error(e.message)
    }
}


module.exports = router;