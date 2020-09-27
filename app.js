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
console.log(config.get('jwtPrivateKey'))
if (!config.get('jwtPrivateKey')) {
	console.log('adsa')
	console.log('FATAL ERROR: jwtPrivateKey is not defined.');
	// process.exit(1);
}

mongoose
.connect('mongodb://localhost/vidly',
{ useNewUrlParser: true, useUnifiedTopology: true})
.then(()=> console.log('Connected to MongoDb...'))
.catch(err=>console.error('Could not connect to MongoDB...',err));

const express = require('express');
const app = express();

app.use(express.json());
app.use('/api/genres', genres); //use the genres router
app.use('/api/customers', customers); //use the customers router
app.use('/api/movies', movies); //use the movies router
app.use('/api/rentals', rentals); //use the rentals router
app.use('/api/users', users); //use the users router
app.use('/api/auth', auth); //use the auth router

const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(
		`Server running at port ${port}`
	);
})

