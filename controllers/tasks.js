const express = require('express')
const router = express.Router()

const User = require('../models/user.js')

// router logic

// GET
router.get('/', async (req, res) => {
    const user = await User.findById(req.session.user._id)
    res.render('tasks/index.ejs', {user, tasks: user.tasks})
});

// POST
router.post('/', async (req, res) => {
    const user = await User.findById(req.session.user._id)
    user.tasks.push(req.body)
    await user.save()
    res.redirect(`/users/${user._id}/tasks`)
})

// DELETE
router.delete('/:taskId', async (req, res) => {
    const user = await User.findById(req.session.user._id);
    user.tasks = user.tasks.filter(task => task._id.toString() !== req.params.taskId)
    await user.save();
    res.redirect(`/users/${user._id}/tasks`);
});

// GET
router.get('/:taskId/edit', async (req, res) => {
    const user = await User.findById(req.session.user._id);
    const task = user.tasks.id(req.params.taskId);
    res.render('tasks/edit.ejs', { user, task });
});

// PUT
router.put('/:taskId', async (req, res) => {
    const user = await User.findById(req.session.user._id);
    const task = user.tasks.id(req.params.taskId);
    task.name = req.body.name;
    if (req.body.dueDate) {
        const dueDate = req.body.dueDate;
        const dueTime = req.body.dueTime || "00:00";
        task.dueDate = new Date(`${dueDate}T${dueTime}:00`);
    } else {
        task.dueDate = null;
    }
    await user.save();
    res.redirect(`/users/${user._id}/tasks`)
});

module.exports = router