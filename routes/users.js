const auth = require('../middleware/auth'); //we are using this for authorization

const bcrypt = require('bcrypt');
const _ = require('lodash');
const {bad_req, invalid} = require('../util');
const {User, validate} = require('../models/user')

const express = require('express');
const router = express.Router();

router.get('/', async (req,res) => {
	const user = await User.find().sort('name').select('name')
	res.send(user);
})
router.get('/me', auth, async (req,res) => {
	const user = await User.findById(req.user._id).select('-password')
	if (!user) return invalid (res, 'User'); 
	res.send(user);
})

router.post('/', auth, async (req,res) => {
	const {error} = validate(req.body);
  if (error) return bad_req(res,error.details[0].message);

  let user =  await User.findOne({ email: req.body.email});
  if (user) return bad_req(res,'User already exists');

  user = new User(_.pick(req.body,['name','email','password']));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password,salt);

	await user.save();
  const token =  user.generateAuthToken();
	res.header('x-auth-token',token).send(_.pick(user,['_id','name','email',
'isAdmin']));
})

router.put('/:id', auth, async (req,res) => {
	const {error} = validate(req.body);
	if (error) return bad_req(res,error.details[0].message);
  const user = await User.findByIdAndUpdate(req.params.id, 
    _.pick(req.body,['name','email','password']), 
    {	useFindAndModify : false, new : true }
	)
	if (!user) return invalid (res, 'User'); 
	res.send(user);
})

router.delete('/:id', auth, async (req,res) => {
	const {error} = validate(req.body);
	if (error) return bad_req(res,error.details[0].message);
	const user = await User.findByIdAndRemove(req.params.id,
		 {	useFindAndModify : false, new : true }
	)
	if (!user) return invalid (res, 'User'); 
	res.send(user);
})

module.exports = router;