const Joi = require('joi');
const mongoose = require('mongoose');
let model = {};
model.genreSchema = new mongoose.Schema({
  name: { 
		type : String,   
		required : true, 
		minlength : 5, 
		maxlength : 50
	}
})
model.Genre = mongoose.model('Genre', model.genreSchema)

model.validate = (genre) => {
	const schema = {
		name: Joi.string().min(3).required()
	};
	return result = Joi.validate(genre,schema);
}
/* model.validGenre  = async (genreId) => {
	let genre = await Genre.findById(genreId);
	return genre;
} */
module.exports = model;
