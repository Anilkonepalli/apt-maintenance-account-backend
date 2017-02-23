// Note:
// 1. Run json-server before running this test
// 2. To run json-server, open a command prompt, go to 'test' folder where json-server.js file is found.
// 3. Then run command 'node json-server'.  
// 4. It should now show 'JSON Server is running'

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
//let server = require('../test/json-server');
let server = "http://localhost:3000";
let should = chai.should();

chai.use(chaiHttp);

/**
 * Test the /GET route
 */
describe('/GET Accounts', () => {
	it('should GET all the accounts', (done) => {
		chai.request(server)
		.get('/maintenance_accounts')
		.end((err, res) => {
console.log('Response is: ...'); console.log(res);			
			res.should.have.status(200);
			res.body.should.be.a('array');
			res.body.length.should.be.eql(2);
			done();
		});
	});
});