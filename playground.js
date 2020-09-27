const bcrypt = require('bcrypt');
const { has } = require('lodash');

async function makeSalt() {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash('chidiEBERE123!',salt);
  console.log(salt);
  console.log(hashed);
}
makeSalt();