const express = require('express')
const router = express.Router()

const User = require('../models/user.js')

// sorting logic
async function sortTasks(req) {
    const user = await User.findById(req.session.user._id);
    const tasks = user.tasks.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
    });
    user.tasks = tasks
    await user.save()
    return tasks
}

// router logic

// GET
router.get('/', async (req, res) => {
    const user = await User.findById(req.session.user._id)
    const sortedTasks = await sortTasks(req)
    await user.save()
    res.render('tasks/index.ejs', {user, tasks: sortedTasks})
});

// POST
router.post('/', async (req, res) => {
    const user = await User.findById(req.session.user._id)
    user.tasks.push(req.body)
    await user.save()
    await sortTasks(req)
    res.redirect(`/users/${user._id}/tasks`)
})

// DELETE
router.delete('/:taskId', async (req, res) => {
    const user = await User.findById(req.session.user._id);
    user.tasks = user.tasks.filter(task => task._id.toString() !== req.params.taskId)
    user.taskCounter++
    await user.save();
    await sortTasks(req)
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
        task.dueDate = new Date(req.body.dueDate)
    } else {
        task.dueDate = null;
    }
    await user.save();
    await sortTasks(req)
    res.redirect(`/users/${user._id}/tasks`)
});

module.exports = router