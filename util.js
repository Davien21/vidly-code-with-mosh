let util = {};
util.bad_req = (res,err) => {
	return res.status(400).send(err)
}

util.invalid = (res,name) => {
	return res.status(404).send(`Invalid ${name}`);
}

module.exports = util;