const fs = require('fs');
const path = require("path");
const jwt = require('jsonwebtoken');
// http://travistidwell.com/blog/2013/09/06/an-online-rsa-public-and-private-key-generator/
// use 'utf8' to get string instead of byte array  (1024 bit key)
const privateKEY = fs.readFileSync(path.join(__dirname, '..', '/signing-config/private.key'), 'utf8'); // to sign JWT
const publicKEY = fs.readFileSync(path.join(__dirname, '..', '/signing-config/public.key'), 'utf8'); 	// to verify JWT

const $Options = require('../signing-config/issuers-config');

module.exports = {
    sign: (payload) => {
        /*
            sOptions = {
                issuer: "Authorizaxtion/Resource/This server",
                subject: "iam@user.me", 
                audience: "Client_Identity" // this should be provided by client
            }
        */

        // Token signing options
        var signOptions = {
            issuer: $Options.issuer,
            subject: $Options.subject,
            audience: $Options.audience,
            expiresIn: "30d",				// 30 days validity
            algorithm: "RS256" 			// RSASSA options[ "RS256", "RS384", "RS512" ]
        };
        return jwt.sign(payload, privateKEY, signOptions);
    },

    verify: (token) => {
        /*
            vOption = {
                issuer: "Authorization/Resource/This server",
                subject: "iam@user.me", 
                audience: "Client_Identity" // this should be provided by client
            }		
        */
        var verifyOptions = {
            issuer: $Option.issuer,
            subject: $Option.subject,
            audience: $Option.audience,
            expiresIn: "30d",
            algorithm: ["RS256"]
        };
        try {
            return jwt.verify(token, publicKEY, verifyOptions);
        } catch (err) {
            return false;
        }
    },

    decode: (token) => {
        return jwt.decode(token, { complete: true });
    }
}