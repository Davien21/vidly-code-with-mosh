const moment = require('moment');
const request = require('supertest')
const { Rental } = require('../../models/rental');
const { User } = require('../../models/user');
const { Movie } = require('../../models/movie');
const mongoose = require('mongoose')

describe('/api/returns', () => {
  let server;
  let customerId;
  let movieId;
  let rental;
  let movie;
  let token;  
  beforeEach( async () => { 
    server = require('../../app'); 

    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    token = new User().generateAuthToken();

    movie = new Movie({
      _id: movieId,
      title: 'Movie1',
      genre: {
        name: 'action',
      },
      numberInStock: 5,
      dailyRentalRate: 2
    })

    rental = new Rental({
      customer : {
        _id: customerId,
        name: '12345',
        phone: '12345',
      },
      movie: {
        _id: movieId,
        title: 'movie title',
        dailyRentalRate: 2
      }
    })
    await movie.save();
    await rental.save();
  })
  
  afterEach( async () => { 
    await server.close(); 
    await Rental.remove({});
    await Movie.remove({});
  })
  describe('POST /', () => {

    const exec = () => {
      return request(server)
        .post('/api/returns')
        .set('x-auth-token', token)
        .send({ customerId, movieId })
    }
    it('should return a 401 if client is not logged in', async () => {
      token = '';

      const res = await exec();
      
      expect(res.status).toBe(401);
    })
    it('should return a 400 if customerId is not provided', async () => {
      customerId = '';

      const res = await exec();
      
      expect(res.status).toBe(400);
    })
    it('should return a 400 if movieId is not provided', async () => {
      movieId = '';

      const res = await exec();
      
      expect(res.status).toBe(400);
    })
    it('should return a 404 if rental not is not found', async () => {
      await Rental.remove({})

      const res = await exec();
      
      expect(res.status).toBe(404);
    })
    it('should return 400 if rental already processed', async () => {
      // when return date is set
      rental.dateReturned = new Date();
      await  rental.save();

      const res = await exec();
      
      expect(res.status).toBe(400);
    })
    it('should return 200 if we have a valid request', async () => {
      const res = await exec();
      
      expect(res.status).toBe(200);
    })

    it('should set return date if input is valid', async () => {
      await exec();

      const rentalInDB = await Rental.findById(rental._id);
      const timeDiff = new Date().getTime() - rentalInDB.dateReturned.getTime();

      expect(timeDiff).toBeLessThan(10 * 1000);
      expect(rentalInDB.dateReturned).toBeDefined();
    })
    it('should set rental fee if input is valid', async () => {
      rental.dateOut = moment().add(-7, 'days').toDate();
      await rental.save();

      await exec();

      const rentalInDB = await Rental.findById(rental._id);
      expect(rentalInDB.rentalFee).toBe(14);
    })
    it('should increase the movie stock if input is valid', async () => {
      await exec();

      const movieInDB = await Movie.findById( movie._id )
      
      expect(movieInDB.numberInStock).toBe(movie.numberInStock + 1);
    })
    it('should return the rental if input is valid', async () => {
      const res = await exec();

      const rentalInDB = await Rental.findById(rental._id);
      expect(Object.keys(res.body)).toEqual(
        expect.arrayContaining([
          'dateOut', 'dateReturned', 'rentalFee', 'customer', 'movie'
        ])
      )
    })
  })

})

// POST /api/returns {customerId, movieId}

// Return 401 if client is not logged in
// Return 400 if customerId is not provided
// Return 400 if movieId is not provided
// Return 404 if not rental for this customer/movie
// Return 400 if rental already processed 
// Return 200 if valid request 
// Set the return date 
// Calculate the rental fee (numberOfDays * movie.dailyRentalRate)
// Increase the stock 
// Return the rental 