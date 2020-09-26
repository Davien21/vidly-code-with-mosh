const {bad_req, invalid} = require('../util');
const {Genre, validate} = require('../models/genres')

const express = require('express');
const router = express.Router();

router.get('/', async (req,res) => {
	const genre = await Genre.find().sort('name').select('name')
	res.send(genre);
})
router.get('/:id', async (req,res) => {
	const genre = await Genre.find({ _id : req.params.id }).select('name')
	if (!genre) return invalid (res, 'Genre'); 
	res.send(genre);
})

router.post('/', async (req,res) => {
	const {error} = validate(req.body);
	if (error) return bad_req(res,error.details[0].message);
	const genre = new Genre({ name : req.body.name });
	await genre.save()
	res.send(genre);
})

router.put('/:id', async (req,res) => {
	const {error} = validate(req.body);
	if (error) return bad_req(res,error.details[0].message);
	const genre = await Genre.findByIdAndUpdate(req.params.id, { 
		name : req.body.name
	}, {	useFindAndModify : false, new : true }
	)
	if (!genre) return invalid (res, 'Genre'); 
	res.send(genre);
})

router.delete('/:id', async (req,res) => {
	const {error} = validate(req.body);
	if (error) return bad_req(res,error.details[0].message);
	const genre = await Genre.findByIdAndRemove(req.params.id,
		 {	useFindAndModify : false, new : true }
	)
	if (!genre) return invalid (res, 'Genre'); 
	res.send(genre);
})

module.exports = router;