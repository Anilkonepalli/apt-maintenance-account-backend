var	jwt					= require('jsonwebtoken');
var	constants			= require('../config/constants');

// middleware to use for all requests
//userRoutes.use(
function verifyToken(req, res, next){
	// do logging
	console.log('User Access is happening...');

	let token = req.body.token || req.query.token || req.headers['x-access-token'];

	// decode token
	if(token) {
		// verifies secret and checks exp
		jwt.verify(token, constants.secret, function(err, decoded){
			if (err) {
				return res.json({success: false, message: 'Failed to authenticate token'});
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;
				next();
			}
		});
	} else {
		// if there is no token, return an error
		return res.status(403).send({
			success: false,
			message: 'No token provided in UserRoutes.'
		});
	}

}

//);

//export all the functions
module.exports = { verifyToken };