'use strict';

global.chai = require('chai');
global.chai.should();

let chaiHttp = require('chai-http');
global.chai.use(chaiHttp);

global.expect = global.chai.expect;
global.sinon = require('sinon');

global.sinonChai = require('sinon-chai');
global.chai.use(global.sinonChai);


let constants = require('../config/constants');

global.server = constants.server;
global.testUser = constants.appTestUser;
