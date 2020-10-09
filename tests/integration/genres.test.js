const request = require('supertest')
let server = require('../../app')
describe('/api/genres', () => {
  beforeEach(() => { server = require('../../app'); })
  afterEach(() => { server.close(); })
  describe('GET /', () => {
    it('should return all genres', async () => {
      const res = await request(server).get('/api/genres');
      expect(res.status).toBe(200)
    })
  })
})