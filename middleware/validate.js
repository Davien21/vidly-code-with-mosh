
const { bad_req } = require('../util')

module.exports = validate = (validator) => {
  return (req, res, next) => {
    const { error } = validator(req.body);
    if (error) return bad_req(res,error.details[0].message);
    next();
  }
}
