const express = require('express');

const genres = require('../routes/genres');
const customers = require('../routes/customers');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
const users = require('../routes/users');
const auth = require('../routes/auth');
const returns = require('../routes/returns');
const error = require('../middleware/error')

module.exports = function(app) {

  app.use(express.json());
  app.use('/api/genres', genres); //use the genres router
  app.use('/api/customers', customers); //use the customers router
  app.use('/api/movies', movies); //use the movies router
  app.use('/api/rentals', rentals); //use the rentals router
  app.use('/api/users', users); //use the users router
  app.use('/api/auth', auth); //use the auth router
  app.use('/api/returns', returns); //use the returns router
  
  //error middleware
  app.use(error);

}