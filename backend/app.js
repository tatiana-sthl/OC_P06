const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const path = require('path');

// define the routes and their location in the code
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

// initialize the secret of variables environment
require('dotenv').config();

const app = express();

// connect to database
mongoose.connect(process.env.DB_ACCESS,
    { useNewUrlParser: true,
     useUnifiedTopology: true 
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// filter request and allow access to echange about back and front
app.use((req, res, next) => 
{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

// call the routes
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;