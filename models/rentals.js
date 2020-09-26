const Joi = require('joi');
const mongoose = require('mongoose');

let model = {};
model.rentalSchema = new mongoose.Schema({
  customer: {
    type: new mongoose.Schema({
      isGold : { type : Boolean, default : false },
      name: { 
        type : String,   
        required : true, 
        minlength : 5, 
        maxlength : 50
      },
      phone: { 
        type : String,   
        required : true, 
        minlength : 5, 
        maxlength : 50
      }
    }),
    required: true,
  },
  movie: {
    type : new mongoose.Schema({
      title: { 
        type: String, 
        required: true,
        minlength: 5,
        maxlength: 255, 
        trim: true,
      },
      dailyRentalRate: { 
        type: Number, 
        required: true,
        min: 0,
        max: 255,
        default: 0,
      },
    }),
    required: true
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now
  },
  dateReturned: {
    type: Date
  },
  rentalFee: {
    type: Number,
    min: 0
  }
  
});

model.Rental = mongoose.model('Rental', model.rentalSchema);

model.validate = (rental) => {
	const schema = {
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  };
  return result = Joi.validate(rental,schema);
}
 
module.exports = model;
 