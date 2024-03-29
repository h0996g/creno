const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const tokenSchema = new mongoose.Schema({
    joueur_id: { type: ObjectId, ref: 'Joueur',required: false },
    admin_id: { type: ObjectId, ref: 'Admin',required: false },
    token: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600,
    },
});


  const Token = mongoose.model('Token', tokenSchema)

  module.exports = Token