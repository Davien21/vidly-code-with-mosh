const Joi = require('joi');
const mongoose = require('mongoose');
let model = {};
model.Customer = mongoose.model('Customer', new mongoose.Schema({
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
}))

model.validate = (customer) => {
	const schema = {
    isGold: Joi.boolean().required(),
    name: Joi.string().min(5).max(50).required(),
    phone: Joi.string().min(5).max(50).required(),
	};
	return result = Joi.validate(customer,schema);
}

module.exports = model;