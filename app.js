const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const assinaturaRoutes = require('./routes/assinatura');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE'); 
    res.setHeader('Access-Control-Allow-Headers', 'Contenty-Type, Authorization'); 
    next();
  });

  app.use('/assinatura', assinaturaRoutes);

  app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message: message });
  });

  //app.listen(3000);

  mongoose.connect('mongodb+srv://sanar:LiIQgOHa8QbEDtiO@cluster0-f7akh.mongodb.net/sanar?retryWrites=true', { useNewUrlParser: true })
  .then( result => {
    console.log('Conected!');
    app.listen(3000);
  }).catch( err => {
    console.log(err);
  })