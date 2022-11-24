const express = require('express');
const app = express();
const path = require(('path'));
const cors = require('cors');
const morgan = require('morgan');
const v1 = require('./routes/v1');
const helmet = require('helmet');

// setting up our middleware
app.use(helmet);
app.use(cors({
    origin:'http://localhost:3000',
}));
app.use(morgan("combined"));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/v1', v1);


app.get('/*',(req,res)=>{
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
})

module.exports = app;