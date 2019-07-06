const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');

const router = express.Router();


router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });
    try {
        await task.save();
        await task.populate('owner').execPopulate();
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e);
    }
});

router.get('/tasks', auth, async (req, res) => {
    try {
        await req.user.populate('tasks').execPopulate();
        res.send(req.user.tasks);
    } catch (e) {
        res.status(500).send()
    }
});

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findOne({ _id, owner: req.user._id });
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (e) {
        res.status(404).send()
    }
});

router.patch('/tasks/:id', auth, async (req, res) => {
    const properties = Object.keys(Task.schema.obj);
    const updates = Object.keys(req.body);
    const isUpdateFeasible = updates.every(update => properties.includes(update));
    if (!isUpdateFeasible)
        return res.status(400).send({ 'error': 'Invalid updates!' });
    try {
        const task = await Task.updateOne({ _id: req.params.id, owner: req.user._id }, req.body, { new: true, runValidators: true })
        if (!task)
            return res.status(404).send();
        res.send(task);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
        if (!task)
            return res.status(404).send();
        res.send(task);
    } catch (e) {
        res.status(500).send();
    }
})

module.exports = router;