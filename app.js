
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const config = require('./config/keys');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// mongoose.connect(`mongodb://localhost:27017/auth-config`, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
//     if (!err)
//         console.log('mongo db connected successfully');
//     else
//         console.log(err);
// });


// require('./services/passport');
// app.use(passport.initialize());
// app.use(passport.session());

require('./routes/permissions')(app);
require('./routes/roles')(app);
require('./routes/login')(app);



const PORT = 5001;

app.listen(PORT, (err) => {
    if (err)
        console.error(err);
    else
        console.info('server running');
});


module.exports = app;
