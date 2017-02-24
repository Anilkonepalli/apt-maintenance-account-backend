var constants = require('../config/constants');

let server = constants.server;
let testUser = constants.appTestUser;


// require the dev dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);

/**
 * Test the login with credentials
 */
describe('Testing Routes... /api/login', () => {
	it('should fail on insufficient user credentials', (done) => {
		let user = {
			email: testUser.email
		}
		chai.request(server)
			.post('/api/login')
			.send(user) // send incomplete user credentials
			.end((err, res) => {
//console.log('Response is...'); console.log(res);				
				res.should.have.status(400);
				res.body.should.be.a('object');
				//res.body.should.have.property('errors');
				//res.body.errors.should.have.property('password');
				done();
			});
	});


	it('should pass with sufficient user credentials', (done) => {
		chai.request(server)
			.post('/api/login')
			.send(testUser) // send a complete user credentials
			.end((err, res) => {
//console.log('Response is...'); console.log(res);				
				res.should.have.status(201);
				res.body.should.be.a('object');
				//res.body.should.have.property('errors');
				res.body.should.have.property('id_token');
//console.log('Token: '+res.body.id_token);
				//res.body.errors.should.have.property('password');
				done();
			});
	});


});
