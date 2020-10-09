require('express-async-errors');

const winston = require('winston');
require('winston-mongodb');

const error = require('./middleware/error')
const config = require('config');
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi);

const mongoose = require('mongoose');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const express = require('express');
const app = express();

winston.handleExceptions(
	new winston.transports.File({ filename: 'uncaughtExceptions.log'}))

process.on('unhandledRejection', (ex)=> {
	throw ex;
})
winston.add(winston.transports.File, { filename: 'logfile.log' });
winston.add(winston.transports.MongoDB, { 
	db: 'mongodb://localhost/vidly',
	level: 'info'
});
const p = Promise.reject( new Error('Something failed miserably!'));
p.then(()=>console.log('Done'));

// throw new Error('Something bad joor!');

if (!config.get('jwtPrivateKey')) {
	console.log('FATAL ERROR: jwtPrivateKey is not defined.');
	process.exit(1);
}

mongoose
.connect('mongodb://localhost/vidly',
{ useNewUrlParser: true, useUnifiedTopology: true})
.then(()=> console.log('Connected to MongoDb...'))
.catch(err=>console.error('Could not connect to MongoDB...',err));



app.use(express.json());
app.use('/api/genres', genres); //use the genres router
app.use('/api/customers', customers); //use the customers router
app.use('/api/movies', movies); //use the movies router
app.use('/api/rentals', rentals); //use the rentals router
app.use('/api/users', users); //use the users router
app.use('/api/auth', auth); //use the auth router

//error middleware
app.use(error);
const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(
		`Server running at port ${port}`
	);
})

