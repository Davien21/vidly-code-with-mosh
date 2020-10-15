const moment = require('moment')
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const {bad_req, invalid} = require('../util');
const { Rental } = require('../models/rental')
const { Movie } = require('../models/movie')

router.post('/', auth, async (req,res) => {
	// if (error) return bad_req(res,error.details[0].message);
  if (!req.body.customerId) return res.status(400).send('customerId not provided')
  if (!req.body.movieId) return res.status(400).send('customerId not provided')
  
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

  return res.status(200).send('Return was processed');
})


module.exports = router;