const auth = require('../middleware/auth'); 

const {bad_req, invalid} = require('../util');
const {Movie, validate} = require('../models/movies')
const {Genre} = require('../models/genres')

const express = require('express');
const router = express.Router();

router.get('/', async (req,res) => {
	const movie = await Movie.find().sort('name').select('name')
	res.send(movie);
})
router.get('/:id', async (req,res) => {
	const movie = await Movie.find({ _id : req.params.id })
	if (!movie) return invalid (res, 'Movie'); 
	res.send(movie);
})

router.post('/', auth, async (req,res) => {
  const {error} = validate(req.body);
  if (error) return bad_req(res,error.details[0].message);
  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return invalid (res, 'Genre'); 

	const movie = new Movie({ 
    title : req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
  });
  await movie.save();
	res.send(movie);
})

router.put('/:id', auth, async (req,res) => {
	const {error} = validate(req.body);
	if (error) return bad_req(res,error.details[0].message);
	const movie = await Movie.findByIdAndUpdate(req.params.id, { 
    title : req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
	}, {	useFindAndModify : false, new : true })
	if (!movie) return invalid (res, 'Movie'); 
	res.send(movie);
})

router.delete('/:id', auth, async (req,res) => {
	const {error} = validate(req.body);
	if (error) return bad_req(res,error.details[0].message);
	const movie = await Movie.findByIdAndRemove(req.params.id,
		 {	useFindAndModify : false, new : true }
	)
	if (!movie) return invalid (res, 'Movie'); 
	res.send(movie);
})

module.exports = router;