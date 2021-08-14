const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const { success, error } = require("consola");

// init the app
const app = express();

// log in terminal
app.use(morgan('tiny'));


// middlewares
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

require('./server/middlewares/passport')(passport);


// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))



//  load configuration 
const { DB_URL, PORT } = require('./server/config/index');


// connect to mongoDB
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', (err) => error({ message: `can't connect to db\n${err}`, badge: true }));
db.once('open', () => success({ message: `DB connected`, badge: true }));


// routes
app.use('/api/users', require('./server/routes/users'));


app.listen(PORT, () => success({ message: `server running on ${PORT}`, badge: true }));

