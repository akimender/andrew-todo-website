const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const User = require('./models/user.js')

app.use(express.static(__dirname + '/public'));

const passUserToView = require('./middleware/pass-user-to-view.js');
const isSignedIn = require('./middleware/is-signed-in.js');

const authController = require('./controllers/auth.js');
const tasksController = require('./controllers/tasks.js');

const port = process.env.PORT ? process.env.PORT : '3000';

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
// app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passUserToView)

app.get('/', async (req, res) => {
  if (req.session.user) {
    const user = await User.findById(req.session.user._id);
    res.render('index.ejs', {
      user,
    });
  } else {
    res.render('index.ejs', {
      user: null,
    })
  }
});

app.use('/auth', authController);
app.use(isSignedIn)
app.use('/users/:userId/tasks',tasksController);

app.use('/auth', authController);

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
