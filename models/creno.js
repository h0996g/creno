const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const crenoSchema = new mongoose.Schema({
    userId: {
        type: ObjectId, ref: "User"
    }, terrainId: {
        type: ObjectId, ref: "Terrain"
    },
    equipeId: {
        type: ObjectId, ref: "Equipe"
    },
    dateStart: {
        type: String
    },
    dateEnd: {
        type: String
    },
    timeStart: {
        type: String
    }, timeEnd: {
        type: String
    }
})


const Creno = mongoose.model('Creno', crenoSchema)
module.exports = Creno   