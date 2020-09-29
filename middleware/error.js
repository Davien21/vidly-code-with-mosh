const winston = require('winston');

module.exports = function(err, req, res, next){
  // winston.log('error',err.message) //- method a
  winston.error(err.message, err);
  //Logging levels:
    // error
    // warn
    // info 
    // verbose
    // debug
    // silly
	//Log the exception
  res.status(500).send('Something failed.')
}