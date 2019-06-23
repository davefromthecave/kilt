'use strict';
module.exports = function(app) {
    const kilt = require('../controllers/kiltController');

    // todoList Routes
    app.route('/attest')
        .post(kilt.attest);

    app.route('/rideinformation')
        .get(kilt.getRideInformation);

    // test for docker
    app.route('/test')
        .get(kilt.test);

    app.route('/generateclaims')
        .get(kilt.generateClaims);

};