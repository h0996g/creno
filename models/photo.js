const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const photoSchema = new mongoose.Schema({
    url: { type: String, required: true },

    
    terrain_id: { type: ObjectId, ref: 'Terrain' },
  }, { timestamps: true });


  const Photo = mongoose.model('Photo', photoSchema)

  module.exports = Photo