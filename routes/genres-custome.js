const mongoose = require('mongoose');

mongoose
.connect('mongodb://localhost/vidly',
{ useNewUrlParser: true, useUnifiedTopology: true})
.then(()=> console.log('Connected to MongoDb...'))
.catch(err=>console.error('Could not connect to MongoDB...',err));

const genreSchema = new mongoose.Schema({
  name: { type : String, required : true, minlength : 5, maxlength : 50}
})
const Genre = mongoose.model('genre', genreSchema);
const express = require('express');
const router = express.Router();
const Joi = require('joi');

const db = require('../controllers/dbHandler');

router.get('/', async (req,res) => {
	const result = await db.getGenres(null);
	res.send(formattedResponse(result));
})
router.get('/:id', async (req,res) => {
	const result = await db.getGenres(req.params.id);
	res.send(formattedResponse(result));
})
router.post('/', async (req,res) => {
	const {error} = validateGenre(req.body);
	if (error) return bad_req(res,error.details[0].message);
	const result = await db.createGenre(req.body);
	res.send(formattedResponse(result));
})

router.put('/:id', async (req,res) => {
	const {error} = validateGenre(req.body);
	if (error) return bad_req(res,error.details[0].message);
	const result = await db.updateGenre(req.params.id,req.body);
	res.send(formattedResponse(result));
})

router.delete('/:id', async (req,res) => {
	const {error} = validateGenre(req.body);
	if (error) return bad_req(res,error.details[0].message);
	const result = await db.removeGenre(req.params.id);
	res.send(formattedResponse(result));
})

function validateGenre (genre) {
	const schema = {
		genre: Joi.string().min(3).required()
	};
	return result = Joi.validate(genre,schema);
}

function bad_req (res,err) {
	return res.status(400).send(err)
}

let formattedResponse = (result) => {
	if (result.error) return {result : result.data,	message: result.error};
	return {result : result.data,message:'success'};
}
module.exports = router;