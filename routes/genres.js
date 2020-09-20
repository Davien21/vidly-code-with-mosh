const express = require('express');
const router = express.Router();
const Joi = require('joi');
const mongoose = require('mongoose');
mongoose
.connect('mongodb://localhost/vidly',
{ useNewUrlParser: true, useUnifiedTopology: true})
.then(()=> console.log('Connected to MongoDb...'))
.catch(err=>console.error('Could not connect to MongoDB...',err));

const Genre = mongoose.model('Genre', new mongoose.Schema({
  name: { 
		type : String,   
		required : true, 
		minlength : 5, 
		maxlength : 50
	}
}))
router.get('/', async (req,res) => {
	const genre = await Genre.find().sort('name').select('name')
	res.send(genre);
})
router.get('/:id', async (req,res) => {
	const genre = await Genre.find({ _id : req.params.id }).select('name')
	if (!genre) return invalid_genre (res); 
	res.send(genre);
})

router.post('/', async (req,res) => {
	const {error} = validateGenre(req.body);
	if (error) return bad_req(res,error.details[0].message);
	let genre = new Genre({ name : req.body.name });
	const result = await genre.save()
	res.send(genre);
})

router.put('/:id', async (req,res) => {
	const {error} = validateGenre(req.body);
	if (error) return bad_req(res,error.details[0].message);
	const genre = await Genre.findByIdAndUpdate(req.params.id, { 
		name : req.body.name
	}, {	useFindAndModify : false, new : true }
	)
	if (!genre) return invalid_genre (res); 
	res.send(genre);
})

router.delete('/:id', async (req,res) => {
	const {error} = validateGenre(req.body);
	if (error) return bad_req(res,error.details[0].message);
	const genre = await Genre.findByIdAndRemove(req.params.id,
		 {	useFindAndModify : false, new : true }
	)
	if (!genre) return invalid_genre (res); 
	res.send(genre);
})

function validateGenre (genre) {
	const schema = {
		name: Joi.string().min(3).required()
	};
	return result = Joi.validate(genre,schema);
}

//util functions: 
function bad_req (res,err) {
	return res.status(400).send(err)
}

function invalid_genre (res) {
	return res.status(404).send('Invalid Genre');
}
module.exports = router;