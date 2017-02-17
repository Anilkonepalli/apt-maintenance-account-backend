var assert = require('assert');

describe('User - Array', function(){
	describe('#indexOf()', function() {
		it('should return 4 when the value is present', function() {
			assert.equal(4, [1,2,3,4,5].indexOf(5));
		});		
	});
});