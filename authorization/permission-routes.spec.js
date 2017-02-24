// Test Spec on Permission's Routes 

var constants = require('../config/constants');

let server = constants.server;
let testUser = constants.appTestUser;

// require the dev dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);

/**
 * Test the /permissions route 
 */
describe('Testing Routes... /api/permissions', () => {

	it('should GET all the permissions', () => {

		chai.request(server)
			.post('/api/login')
			.send(testUser) // first login with user credentials
			.then( (res) => { // response now has jwt token in it
				return chai.request(server)
					.get('/api/permissions') // get accounts details 
					.set('Content-Type', 'application/x-www-form-urlencoded')
					.set('x-access-token', res.body.id_token); // set id_token received in response object
			})
			.then( (res) => { // response has account objects
				//expect(res).to.have.status(200);
				res.should.have.status(200);
				res.body.should.be.a('array');
			})
			.catch( (err) => { // in case of any errors, throw it
				throw err;
			});

	});


});