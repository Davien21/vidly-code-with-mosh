const {Customer, validate} = require('../models/customers')
const {bad_req, invalid} = require('../util');
const express = require('express');
const router = express.Router();

router.get('/', async (req,res) => {
	const customer = await Customer.find().sort('name').select('name isGold')
	res.send(customer);
})
router.get('/:id', async (req,res) => {
	const customer = await Customer.find({ _id : req.params.id }).select('name isGold')
	if (!customer) return invalid (res,'Customer'); 
	res.send(customer);
})

router.post('/', async (req,res) => {
	const {error} = validate(req.body);
	if (error) return bad_req(res,error.details[0].message);
	const customer = new Customer({ 
    name : req.body.name, 
    phone : req.body.phone, 
    isGold : req.body.isGold
  });
	await customer.save();
	res.send(customer);
})
router.put('/:id', async (req,res) => {
	const {error} = validate(req.body);
	if (error) return bad_req(res,error.details[0].message);
  const customer = await Customer.findByIdAndUpdate(req.params.id, { 
    name : req.body.name, 
    phone : req.body.phone, 
    isGold : req.body.isGold
	}, {	useFindAndModify : false, new : true }
	)
	if (!customer) return invalid (res,'Customer'); 
	res.send(customer);
})

router.delete('/:id', async (req,res) => {
	const {error} = validate(req.body);
	if (error) return bad_req(res,error.details[0].message);
	const customer = await Customer.findByIdAndRemove(req.params.id,
		{	useFindAndModify : false, new : true }
	)
	if (!customer) return invalid (res,'Customer'); 
	res.send(customer);
})

module.exports = router;
