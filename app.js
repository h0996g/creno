const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');//installer le module mongoose (avant vous devez installer et configurer Mongodb)
const apiRouter = require('./routes/api');

const app = express();

app.use(bodyParser.json());

// Connexion à la base de données MongoDB
mongoose.set('strictQuery', true);

mongoose.connect('mongodb://127.0.0.1:27017/creno', { useNewUrlParser: true })
    .then(() => {
        console.log('Connexion réussie à la base de données');



        app.use('/api', apiRouter);

        app.listen(3000, () => {
            console.log('Server started on port 3000');
        });
    })
    .catch((error) => {
        console.log(`Erreur de connexion à la base de données : ${error}`);
    });