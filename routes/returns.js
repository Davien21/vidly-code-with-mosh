gitconst auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const {bad_req, invalid} = require('../util');
const { User } = require('../models/user')

router.post('/', async (req,res) => {
  // const {error} = validate(req.body);
	// if (error) return bad_req(res,error.details[0].message);
  if (!req.body.customerId) return res.status(400).send('customerId not provided')
  if (!req.body.movieId) return res.status(400).send('customerId not provided')
  
  // if (req.body.customerId && req.body.movieId) return res.status(200).send('good')

  res.status(401).send('Unauthorized')
})


module.exports = router;