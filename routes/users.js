const bcrypt = require('bcrypt');
const _ = require('lodash');
const {bad_req, invalid} = require('../util');
const {User, validate} = require('../models/users')

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
  if (user) return bad_req(res,'User already exists');

  user = new User(_.pick(req.body,['name','email','password']));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password,salt);

  await user.save();
  res.send(_.pick(user,['_id','name','email']));
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

module.exports = router;