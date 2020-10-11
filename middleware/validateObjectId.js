const mongoose = require('mongoose');
const {bad_req, invalid} = require('../util');

module.exports = function (req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return invalid (res, 'ID.');
    
  next();
}