const Joi = require('joi');
const moment = require('moment');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const { bad_req, invalid } = require('../util');
const { Rental } = require('../models/rental')
const { Movie } = require('../models/movie')

router.post('/', auth, async (req,res) => {
  const {error} = validate(req.body);
	if (error) return bad_req(res,error.details[0].message);

  const rental = await Rental.findOne({
    'customer._id': req.body.customerId, 
    'movie._id': req.body.movieId, 
  });

  if (!rental) return res.status(404).send('Rental not found');

  if (rental.dateReturned) return res.status(400).send('Return already processed')
  
  rental.dateReturned = new Date();
  const rentalDays = moment().diff(rental.dateOut, 'days');
  rental.rentalFee = rentalDays * rental.movie.dailyRentalRate;

  await rental.save();

  await Movie.update({ _id: rental.movie._id }, {
    $inc: { numberInStock: 1 }
  })

  return res.status(200).send(rental);
})

function validate (returns) {
	const schema = {
		customerId: Joi.objectId().required(),
		movieId: Joi.objectId().required(),
	};
	return result = Joi.validate(returns,schema);
}

module.exports = router;