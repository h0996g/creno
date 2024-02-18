const admin = require('../models/admin');

const jwt = require("jsonwebtoken");

class AdminServices {

    static async registerAdmin(email, mot_de_passe, nom, prenom, telephone, wilaya) {
        try {
            console.log("-----Email --- Password-----", email, mot_de_passe, nom, prenom, telephone, wilaya);

            const createAdmin = new admin({ email, mot_de_passe, nom, prenom, telephone, wilaya });
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

    static async generateAccessToken(tokenData, JWTSecret_Key, JWT_EXPIRE) {
        return jwt.sign(tokenData, JWTSecret_Key, { expiresIn: JWT_EXPIRE });
    }
}

module.exports = AdminServices;