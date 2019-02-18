const express = require('express');
const mongoose = require('mongoose');

const app = express();

require('./startup/router')(app);

mongoose.connect('mongodb+srv://sanar:LiIQgOHa8QbEDtiO@cluster0-f7akh.mongodb.net/sanar?retryWrites=true', { useNewUrlParser: true })
    .then(result => {
        console.log('Conected!');
        app.listen(3000);
    }).catch(err => {
        console.log(err);
    })
