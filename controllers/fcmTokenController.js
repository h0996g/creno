const FcmToken = require('../models/fcm_token');
const Admin = require('../models/admin')
const Joueur = require('../models/joueur')

// ------------------admin-------------------------------------
exports.addOrUpdateTokenAdmin = async (req, res) => {
    const admin_id = req.user._id;
    const { token, device } = req.body;
    try {
        let fcmToken = await FcmToken.findOne({ admin_id: admin_id, device: device });
        if (fcmToken) {
            fcmToken.token = token;
        } else {
            fcmToken = new FcmToken({ admin_id: admin_id, token, device });
        }

        await fcmToken.save();
        res.status(200).json({ message: "Token updated successfully", fcmToken });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.removeTokenFcmAdmin = async (req, res) => {
    const admin_id = req.user._id;
    const { device } = req.body;

    try {
        const result = await FcmToken.deleteOne({ admin_id: admin_id, device: device });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Token not found" });
        }
        res.status(200).json({ message: "Token removed successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// ------------------joueur-------------------------------------
exports.addOrUpdateTokenJoueur = async (req, res) => {
    const joueur_id = req.user._id;
    const { token, device } = req.body;
    try {
        let fcmToken = await FcmToken.findOne({ joueur_id: joueur_id, device: device });
        if (fcmToken) {
            fcmToken.token = token;
        } else {
            fcmToken = new FcmToken({ joueur_id: joueur_id, token, device });
        }

        await fcmToken.save();
        res.status(200).json({ message: "Token updated successfully", fcmToken });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.removeTokenFcmJoueur = async (req, res) => {
    const joueur_id = req.user._id;
    const { device } = req.body;

    try {
        const result = await FcmToken.deleteOne({ joueur_id: joueur_id, device: device });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Token not found" });
        }
        res.status(200).json({ message: "Token removed successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}