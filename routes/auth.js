const config = require('config');
const jwt = require('jsonwebtoken'); 
const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');

const bcrypt = require('bcrypt');
const _ = require('lodash');
const {bad_req, invalid} = require('../util');
const {User} = require('../models/users')

const express = require('express');
const router = express.Router();

router.get('/', async (req,res) => {
	const user = await User.find().sort('name').select('name')
	res.send(user);
})
router.get('/:id', async (req,res) => {
	const user = await User.find({ _id : req.params.id }).select('name')
	if (!user) return invalid (res, 'User'); 
	res.send(user);
})

router.post('/', async (req,res) => {
	const {error} = validate(req.body);
  if (error) return bad_req(res,error.details[0].message);

  let user =  await User.findOne({ email: req.body.email});
  if (!user) return bad_req(res,'Invalid email or password');

  const validPassword =  await bcrypt.compare(req.body.password,user.password);
  if(!validPassword) return bad_req(res,'Invalid email or password');

  const token =  jwt.sign({_id: user._id}, config.get('jwtPrivateKey'));

  res.send(token);
})

router.put('/:id', async (req,res) => {
	const {error} = validate(req.body);
	if (error) return bad_req(res,error.details[0].message);
  const user = await User.findByIdAndUpdate(req.params.id, 
    _.pick(req.body,['name','email','password']), 
    {	useFindAndModify : false, new : true }
	)
	if (!user) return invalid (res, 'User'); 
	res.send(user);
})

router.delete('/:id', async (req,res) => {
	const {error} = validate(req.body);
	if (error) return bad_req(res,error.details[0].message);
	const user = await User.findByIdAndRemove(req.params.id,
		 {	useFindAndModify : false, new : true }
	)
	if (!user) return invalid (res, 'User'); 
	res.send(user);
})

validate = (req) => {
	const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: new passwordComplexity().required(),
  });
  return schema.validate(req);
}

module.exports = router;