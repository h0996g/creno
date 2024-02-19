const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const geopositionSchema = new mongoose.Schema({
  
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },


  
  terrain_id: { type: ObjectId, ref: 'Terrain' },
    

    }, { timestamps: true }
   
)


const Geoposition = mongoose.model('Geoposition', geopositionSchema)
module.exports = Geoposition   