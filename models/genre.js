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
		name: Joi.string().min(5).max(50).required()
	};
	return result = Joi.validate(genre,schema);
}

module.exports = model;
