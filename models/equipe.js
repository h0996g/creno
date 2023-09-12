const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
var results = new Object();

const equipeSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    players: [{
        userId: {
            type: ObjectId, required: true
        },
        post: {
            type: String
        },
    }],
    capitan: {
        type: ObjectId, required: true
    }
})





const Equipe = mongoose.model('Equipe', equipeSchema)
module.exports = Equipe   