const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const demandCreno = new mongoose.Schema({
    userId: {
        type: ObjectId, ref: "User"
    }, terrainId: {
        type: ObjectId, ref: "Terrain"
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
    },
}, { timestamps: true })


const DemandCreno = mongoose.model('DemandCreno', demandCreno)
module.exports = DemandCreno   