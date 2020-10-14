const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const {bad_req, invalid} = require('../util');
const { Rental } = require('../models/rental')

router.post('/', async (req,res) => {
  // const {error} = validate(req.body);
	// if (error) return bad_req(res,error.details[0].message);
  if (!req.body.customerId) return res.status(400).send('customerId not provided')
  if (!req.body.movieId) return res.status(400).send('customerId not provided')
  
  const rental = await Rental.findOne({
    'customer._id': req.body.customerId, 
    'movie._id': req.body.movieId, 
  })

  if (!rental) return res.status(404).send('Rental not found')
  if (rental.dateReturned) return res.status(400).send('Return already processed')

  // if (req.body.customerId && req.body.movieId) 

  res.status(401).send('Unauthorized')
})


module.exports = router;