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
describe('/POST login credentials', () => {
	it('should not post credentials without password field', (done) => {
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


	it('should post credentials with email and password fields', (done) => {
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
