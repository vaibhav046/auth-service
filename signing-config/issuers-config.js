
// const dotenv = require('dotenv').config();
// const process = require('process');

// module.exports = {
//     // clientID: process.env.CLIENT_ID,
//     // clientSecret: process.env.CLIENT_SECRET,
//     mongoURI: process.env.MONGO_URI,
//     PORT: process.env.PORT
// }
const i = 'Localhost Corp';			// Issuer (Software organization who issues the token)
const s = 'vaibhav046@gmail.com';			// Subject (intended user of the token)
const a = 'http://localhost:5001';	// Audience (Domain within which this token will live and function)

const signOptions = {
    issuer: i,
    subject: s,
    audience: a,
    expiresIn: "112h",
    algorithm: "RS256" 			// RSASSA options[ "RS256", "RS384", "RS512" ]
};

module.exports = signOptions;