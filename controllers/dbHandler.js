const mongoose = require('mongoose');

mongoose
.connect('mongodb://localhost/vidly',
{ useNewUrlParser: true, useUnifiedTopology: true})
.then(()=> console.log('Connected to MongoDb...'))
.catch(err=>console.error('Could not connect to MongoDB...',err));

let db = {};
const genreSchema = new mongoose.Schema({
  name: { type : String, required : true}
})
const Genre = mongoose.model('genre', genreSchema);

db.createGenre = async function (body) {
  const genre = new Genre({
    name : body.genre
  });
  try {
    return result = {
      data : await genre.save(),
      error : false
    }
  }catch (err) {
    return result = {
      data : false,
      error : filteredErrors(err.errors)
    }
  }
}
db.getGenres = async function (id) {
  try {
    if (id) id = { _id : id}
    return result = {
      data : await Genre.find(id).select('name'),
      error : false
    }
  }catch (err) {
    return result = {
      data : false,
      error : filteredErrors(err.errors)
    }
  }
}

db.updateGenre = async function (id,body) {
  try {
    id = { _id : id};
    return result = {
      data : await Genre.findByIdAndUpdate(id, 
        {
          $set : {
            name : body.genre,
          }
        },{useFindAndModify : false, new : true,select : {name:1}}
      ),
      error : false
    }
  }catch (err) {
    return result = {
      data : false,
      error : filteredErrors(err.errors)
    }
  }
}

let filteredErrors = (errorObject) => {
  let filter = {};
  for (field in errorObject) {
    filter[field] = errorObject[field].message
  }
  return filter;
}
db.removeGenre = async function removeGenre(id) {
  try {
    id = { _id : id};
    return result = {
      data : await Genre.findByIdAndRemove(id,
        {useFindAndModify : false, new : true,select : {name:1}
      }),
      error : false
    }
  }catch (err) {
    return result = {
      data : false,
      error : filteredErrors(err.errors)
    }
  }
}

module.exports = db;