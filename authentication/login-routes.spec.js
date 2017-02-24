// Test Spec on Login routes

/**
 * Test /api/login route
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
				res.should.have.status(201);
				res.body.should.be.a('object');
				//res.body.should.have.property('errors');
				res.body.should.have.property('id_token');
				//res.body.errors.should.have.property('password');
				done();
			});
	});


});
