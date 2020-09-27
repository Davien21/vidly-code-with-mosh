const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');
const mongoose = require('mongoose');

let model = {};
model.userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 255,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
    trim: true,
  }
  
});

model.User = mongoose.model('User', model.userSchema);

//validate with regex:
/* model.validate = (user) => {
  console.log(user);
	const schema = {
    name: Joi.string().trim().regex(/^([a-z]{2,})+( ([a-z]{2,})+)+$/i).max(255).required(),
    email: Joi.string().trim().regex(/^([^"( )])+(\@)[a-z]+(\.)[a-z]+$/i).min(5).max(255).required(),
    // password: Joi.string().min(5).max(255).required(),
  };
  return result = Joi.validate(user,schema);
} */
 
//in built validators:
model.validate = (user) => {
	const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: new passwordComplexity().required(),
  });
  return schema.validate(user);
}
module.exports = model;
 