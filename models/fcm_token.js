const mongoose = require('mongoose');
const { Schema } = mongoose;
const ObjectId = mongoose.Types.ObjectId;


const fcmTokenSchema = new Schema({
    token: {
        type: String,
        required: true
    },
    device: {
        type: String,
        required: true
    },
    joueur_id: { type: ObjectId, ref: 'Joueur', required: false },
    admin_id: { type: ObjectId, ref: 'Admin', required: false }
}, { timestamps: true });

const FcmToken = mongoose.model('FcmToken', fcmTokenSchema);

module.exports = FcmToken;
