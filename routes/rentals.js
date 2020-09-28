const auth = require('../middleware/auth'); 

const {bad_req, invalid} = require('../util');
const {Rental, validate} = require('../models/rentals')
const {Movie} = require('../models/movies')
const {Customer} = require('../models/customers')
const Fawn = require('fawn');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();


//fawn is a class and has an init method:

Fawn.init(mongoose);
router.get('/', async (req,res) => {
  const rental = await Rental.find().sort('-dateOut')
  res.send(rental);
})
router.get('/:id', async (req,res) => {
	const rental = await Rental.find({ _id : req.params.id })
	if (!rental) return invalid (res, 'Rental'); 
	res.send(rental);
})

router.post('/', auth, async (req,res) => {
  const {error} = validate(req.body);
  if (error) return bad_req(res,error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return invalid (res, 'Customer'); 
  
  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return invalid (res, 'Movie'); 

  if (!movie.numberInStock === 0) return bad_req(res,'Movie not in stock');

	const rental = new Rental({ 
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    }
  });
  try {
    new Fawn.Task()
        .save('rentals', rental)
        .update('movies', { _id: movie._id }, {
          $inc: { numberInStock: -1 }
        })
        .run();
      res.send(rental);
  } catch (ex) {
    res.status(500).send('Something failed.');
  }
})

router.put('/:id', auth, async (req,res) => {
	const {error} = validate(req.body);
	if (error) return bad_req(res,error.details[0].message);
	const rental = await Rental.findByIdAndUpdate(req.params.id, { 
    title : req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
	}, {	useFindAndModify : false, new : true })
	if (!rental) return invalid (res, 'Rental'); 
	res.send(rental);
})

router.delete('/:id', auth, async (req,res) => {
	const {error} = validate(req.body);
	if (error) return bad_req(res,error.details[0].message);
	const rental = await Rental.findByIdAndRemove(req.params.id,
		 {	useFindAndModify : false, new : true }
	)
	if (!rental) return invalid (res, 'Rental'); 
	res.send(rental);
})

module.exports = router;