const Joi = require('joi');
const mongoose = require('mongoose');
const {genreSchema} = require('./genres')

let model = {};
model.movieSchema = new mongoose.Schema({
  title: { 
		type: String, 
    required: true,
    minlength: 5,
    maxlength: 255, 
    trim: true,
  },
  genre: { 
    type: genreSchema, 
    required: true,
  },
  numberInStock: { 
    type: Number, 
    required: true,
    min: 0,
    max: 255,
    default: 0,
  },
  dailyRentalRate: { 
    type: Number, 
    required: true,
    min: 0,
    max: 255,
    default: 0,
  },
});

model.Movie = mongoose.model('Movie', model.movieSchema);

model.validate = (movie) => {
	const schema = {
    title: Joi.string().min(5).max(50).required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required(),
  };
  return result = Joi.validate(movie,schema);
}
 
module.exports = model;
 