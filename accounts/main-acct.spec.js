var constants = require('../config/constants');

let server = constants.server;
let testUser = constants.appTestUser;

let Account = require('./maint-acct-model');

// require the dev dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);

/**
 * Test the /GET route
 */
describe('/GET Accounts', () => {

	it('should FAIL to GET all the accounts as no token sent', (done) => {
		chai.request(server)
		.get('/api/maintenance-accounts')
		.end((err, res) => {
//console.log('Response is: ...'); console.log(res);			
			res.should.have.status(403);
			//res.body.should.be.a('array');
			//res.body.length.should.be.eql(2);
			done();
		});
	});

	it('should now GET all the accounts as token is sent', () => {

		chai.request(server)
			.post('/api/login')
			.send(testUser) // first login with user credentials
			.then( (res) => { // response now has jwt token in it
				return chai.request(server)
					.get('/api/maintenance-accounts') // get accounts details 
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