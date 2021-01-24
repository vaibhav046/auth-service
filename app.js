
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require('./routes/permissions')(app);
require('./routes/roles')(app);
require('./routes/login')(app);



const PORT = 5001;

app.listen(PORT, (err) => {
    if (err)
        console.error(err);
    else
        console.info('server running on PORT', PORT);
});


module.exports = app;
