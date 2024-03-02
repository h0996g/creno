const admin = require('../models/admin');

const jwt = require("jsonwebtoken");

class AdminServices {

    static async registerAdmin(email, mot_de_passe, nom, prenom, telephone, wilaya, photo) {
        try {
            console.log("-----Email --- Password-----", email, mot_de_passe, nom, prenom, telephone, wilaya, photo);

            const createAdmin = new admin({ email, mot_de_passe, nom, prenom, telephone, wilaya, photo });
            return await createAdmin.save();
        } catch (err) {
            throw err;
        }
    }

    static async getAdminByEmail(email) {
        try {
            return await admin.findOne({ email });
        } catch (err) {
            console.log(err);
        }
    }

    static async checkAdmin(email) {
        try {
            return await admin.findOne({ email });
        } catch (error) {
            throw error;
        }
    }

    static async generateAccessToken(tokenData, JWT_EXPIRE) {
        return jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRE });
    }
}

module.exports = AdminServices;