const express = require('express')
const router = express.Router()

const User = require('../models/user.js')

// router logic

// GET
router.get('/', async (req, res) => {
    const user = await User.findById(req.session.user._id)
    res.render('index.ejs', {user})
});

module.exports = router