const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');//installer le module mongoose (avant vous devez installer et configurer Mongodb)
const apiRouter = require('./routes/api');

// const options = { /* ... */ };
require('./jobs/jobs.js');
require('dotenv').config()


const PORT = process.env.PORT || 3000;
const app = express();



app.use(cors());
// const server = require('http').createServer(app);
// const io = require('socket.io')(server, options);


app.use(bodyParser.json());

// Connexion à la base de données MongoDB
mongoose.set('strictQuery', true);
// mongodb://127.0.0.1:27017/creno
mongoose.connect(
    // process.env.MongoURI
    "mongodb://127.0.0.1:27017/creno"

    , { useNewUrlParser: true })
    .then(() => {
        console.log('Connexion réussie à la base de données');

    })
    .catch((error) => {
        console.log(`Erreur de connexion à la base de données : ${error}`);
    });



// app.use((req, res, next) => {
//     req.io = io;
//     next();
// });
// let liked = 0;
// io.on('connection', socket => {
//     console.log('user connected');
//     console.log('socket id', socket.id);
//     // io.emit('terrain', 'terrain');

//     // socket.on('msg', (socket) => {
//     //     console.log('msg', socket)
//     // });
//     // io.emit('likeupdate', liked);

//     // socket.on('liked', (socket) => {
//     //     liked++;
//     //     console.log('liked', liked)
//     //     io.emit('likeupdate', liked);
//     // });

//     socket.on('disconnect', () => {
//         console.log('socket disconnect ')
//     });
// });





app.use('/api', apiRouter);
// app.listen(3000, () => {
//     console.log('Server started on port 3000');
// });
app.listen(PORT, () => {
    console.log('server started on port 3000');
});