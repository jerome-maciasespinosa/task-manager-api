const express = require('express');
const Task = require('../models/task');
const auth = require('./../middlewares/auth');

const router = new express.Router();

router.post('/tasks',auth, async (req, res, next) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id,
    })

    try {
        const createdTask = await task.save();
        res.status(201).send(createdTask);
    } catch (error) {
        res.status(500).send(error);
    }
})

// GET / tasks?completed=true
// GET / tasks?limit=2&skip=2
// GET / tasks?sortBy=createdAt:desc    
router.get('/tasks',auth, async (req, res) => {
    const match = {}
    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }
    const options = {
        skip: parseInt(req.query.skip),
        limit: parseInt(req.query.limit),
        sort: {},
    }

    if (req.query.sortBy) {
        const sortArr = req.query.sortBy.split(':');
        if (sortArr.length === 2) {
            // options.sort = {
            //     // createdAt: 1 // sort by asc
            //     // createdAt: -1 // sort by desc
            //     [sortArr[0]]: sortArr[1] === 'desc' ? -1 : 1 // sort by desc
            // }
            options.sort[sortArr[0]] = sortArr[1] === 'desc' ? -1 : 1 // sort by desc

        }
    }
    try {
        // const tasks = await Task.find({owner: req.user._id});
        // await req.user.populate('tasks').execPopulate()
        await req.user.populate({
            path:'tasks', 
            match,
            options
        }).execPopulate()
        res.send(req.user.tasks);
    } catch (error) {
        res.status(500).send(error);
    }

})

router.get('/tasks/:id',auth, async (req, res) => {
    try {
        // const task = await Task.findById(req.params.id);
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
        if (!task) return res.status(404).send();
        res.send(task);
    } catch (error) {
        res.status(500).send(error);
        
    }
})

router.patch('/tasks/:id',auth, async (req, res) => {
    const inputs = Object.keys(req.body)
    const allowedProperties = ['description', 'completed']
    const areInputsValid = inputs.every(item => allowedProperties.includes(item));
    if (!areInputsValid) return res.status(400).send({error: 'inputs are invalid'})

    try {
        // const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        // res.send(updatedTask);

        // const updatedTask = await Task.findById(req.params.id);
        // if (!updatedTask) return res.status(404).send();
        // inputs.forEach(item => updatedTask[item] = req.body[item]);
        // await updatedTask.save();
        // res.send(updatedTask);

        const updatedTask = await Task.findOne({_id: req.params.id, owner: req.user._id})
        if (!updatedTask) return res.status(404).send();
        inputs.forEach(item => updatedTask[item] = req.body[item]);
        await updatedTask.save();
        res.send(updatedTask);
    } catch (error) {
        res.status(400).send(error); 
    }
})

router.delete('/tasks/:id',auth, async (req, res) => {
    try {
        // const task = await Task.findByIdAndDelete(req.params.id);
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        if (!task) return res.status(404).send();
        res.send(task);
    } catch (error) {
        res.status(500).send(error);
    }
})


module.exports = router;