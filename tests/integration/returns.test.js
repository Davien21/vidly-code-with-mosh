const request = require('supertest')
const { Rental } = require('../../models/rental');
const { User } = require('../../models/user');
const mongoose = require('mongoose')

describe('/api/returns', () => {
  let server;
  let customerId;
  let movieId;
  let rental;
  let token = new User().generateAuthToken();

  
  beforeEach( async () => { 
    server = require('../../app'); 

    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
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
    await rental.save();
  })
  
  afterEach( async () => { 
    await server.close(); 
    await Rental.remove({});
  })
  describe('POST /', () => {
    const exec = async () => {
      return await request(server)
       .post('/api/returns')
       .send({ customerId, movieId })
    }
    it('should return a 401 if client is not logged in', async () => {
      token = '';
  
      const res =  await exec();
      
      expect(res.status).toBe(401);
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
// Calculate the rental fee 
// Increase the stock 
// Return the rental 