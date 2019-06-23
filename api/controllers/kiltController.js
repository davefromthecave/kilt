'use strict';
module.exports.generateClaims = function () {
    const generator = require('../utils/claimGenerator.js');
    generator.generateRandomClaims();
};

module.exports.test = function (req, res) {
    res.send("test2");
};

module.exports.attest = function (req, res) {
    const Kilt = require('@kiltprotocol/sdk-js');

    let body = getChunk(req);
    console.log(body);

    const attester = Kilt.Identity.buildFromMnemonic('combine floor camera hurt flight embody erosion equal eight census scene ecology');

    const requestForAttestationAsObj = JSON.parse(body);
    const requestForAttestation = Kilt.RequestForAttestation.fromObject(requestForAttestationAsObj);

    const isDataValid = requestForAttestation.verifyData();
    const isSignatureValid = requestForAttestation.verifySignature();
    console.log(isDataValid);
    console.log(isSignatureValid);

    const attestation = new Kilt.Attestation(requestForAttestation, attester);
    Kilt.default.connect('wss://full-nodes.kilt.io:9944');

    attestation.store(attester).then(data => {
        console.log(data)
    }).then(() => {
        // Put the code from section "Create AttestedClaim" here!
    }).catch(e => {
        console.log(e)
    }).finally(() => {
        Kilt.BlockchainApiConnection.getCached().then(blockchain => {
            blockchain.api.disconnect()
        })
    });

    // The AttestedClaim object is the one sent back to the claimer.
    const attestedClaim = new Kilt.AttestedClaim(requestForAttestation, attestation);

    // Let's copy the result and put it back to the exchange
    console.log(JSON.stringify(attestedClaim));

    res.send(JSON.stringify(attestedClaim));
};

module.exports.getRideInformation = function (req, res) {
    return res.send(randomGeneratedRideInformation());
};

let randomGeneratedRideInformation = function() {
    return {
        time: getStringRandomNumberFromTO(0.2, 48),
        date: randomDate(new Date(2012, 0, 1), new Date()),
        distance: getFloatRandomNumberFromTO(5, 100),
        startGeolocation: "Latitude: 56.39537, Longitude: 88.00192, Distortion: 3.26",
        endGeolocation: "Latitude: 55.39537, Longitude: 88.00192, Distortion: 3.26",
        gasUsagePerKm: getFloatRandomNumberFromTO(1.5, 50),
        co2Kg: getFloatRandomNumberFromTO(40, 200)
    };
};

let randomDate = function(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
};

let getFloatRandomNumberFromTO = function(from, to) {
    return parseFloat(getStringRandomNumberFromTO(from, to));
};

let getStringRandomNumberFromTO = function(from, to) {
    return (Math.random() * (to - from) + from).toFixed(2);
};

let getChunk = function(req) {
    let body = [];
    req.on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toJSON();
        // at this point, `body` has the entire request body stored in it as a string

        console.log(body);
    });
    return body;
};
