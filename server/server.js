const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const cors = require('cors');

const app = express();

dotenv.config({path: 'config.env'});
var PORT = process.env.PORT || 9001;

// log requests:
app.use(morgan('tiny'));

// parse request to bodyparser:
app.use(bodyparser.urlencoded({extended:true}));
// app.use(bodyparser.json());

// setting cors for react-app to be able to access our server:
app.use(cors()); 

// so that our server can understand received data from the client:
app.use(express.json());

// loading Routes:
app.use('/', require('./routes/router'))



app.listen(PORT, () => {console.log(`Server is running on http://localhost:${PORT}`)});

 