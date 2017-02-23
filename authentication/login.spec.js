/*
var assert = require('assert');

describe('Login - Array', function(){
	describe('#indexOf()', function() {
		it('should return 2 when the value is present', function() {
			assert.equal(2, [1,2,3].indexOf(3));
		});		
	});
});
*/

// require the dev dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let port = 3002;
let server = 'http://localhost:'+port;
let should = chai.should();

chai.use(chaiHttp);

/**
 * Test the login with credentials
 */
describe('/POST login credentials', () => {
	it('should not post credentials without password field', (done) => {
		let user = {
			email: 'user1@eastgate.in'
		}
		chai.request(server)
			.post('/api/login')
			.send(user)
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
		let user = {
			email: 'user1@eastgate.in',
			password: 'user1secret'
		}
		chai.request(server)
			.post('/api/login')
			.send(user)
			.end((err, res) => {
//console.log('Response is...'); console.log(res);				
				res.should.have.status(201);
				res.body.should.be.a('object');
				//res.body.should.have.property('errors');
				res.body.should.have.property('id_token');
console.log('Token: '+res.body.id_token);
				//res.body.errors.should.have.property('password');
				done();
			});
	});


});
