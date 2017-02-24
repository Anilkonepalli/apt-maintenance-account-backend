
/*
var assert = require('assert');

describe('Accounts - Array', function(){
	describe('#indexOf()', function() {
		it('should return 1 when the value is present', function() {
			assert.equal(1, [1,2,3].indexOf(2));
		});		
	});
});
*/

let Account = require('./maint-acct-model');

// require the dev dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
//let server = require('../app.server');
let server = 'http://localhost:3002';
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

/*
	it('should now GET all the accounts as token is sent', (done) => {
		// login
		//var agent = chai.request.agent(server);
		chai.request(server)
			.post('/api/login')
			.send({ email: 'user1@eastgate.in', password: 'user1secret' })
			.then( (res) => {
//console.log('Get id_token...');console.log(res);				
console.log('id_token: ');console.log(res.body.id_token);
				//expect(res).to.have.cookie('id_token');
				chai.request(server)
					.get('/api/maintenance-accounts')
					.set('Content-Type', 'application/x-www-form-urlencoded')
					.set('x-access-token', res.body.id_token)
					.end( (err, res) => {
//console.log('Response from Accounts...');console.log(res);						
							expect(res).to.have.status(200);
							done();
					});
			})
			.catch( (err) => {
				throw err;
			})

	});
*/

	it('should now GET all the accounts as token is sent', () => {

		chai.request(server)
			.post('/api/login')
			.send({ email: 'user1@eastgate.in', password: 'user1secret' })
			.then( (res) => {
//console.log('id_token: ');console.log(res.body.id_token);
				return chai.request(server)
					.get('/api/maintenance-accounts')
					.set('Content-Type', 'application/x-www-form-urlencoded')
					.set('x-access-token', res.body.id_token);
			})
			.then( (res) => {
console.log('---------------------------------');
console.log('ID TOken in Response from Accounts...');console.log(res.body.id_token);
console.log('---------------------------------');
				expect(res).to.have.status(200);
			})
			.catch( (err) => {
				throw err;
			})

	});



});