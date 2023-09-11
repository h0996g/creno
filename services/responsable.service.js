const responsable = require('../models/responsable');

const jwt = require("jsonwebtoken");

class ResponsableServices {

    static async registerResponsable(email, password, name, phone, image) {
        try {
            console.log("-----Email --- Password-----", email, password, name, phone, image);

            const createResponsable = new responsable({ email, password, name, phone, image });
            return await createResponsable.save();
        } catch (err) {
            throw err;
        }
    }

    static async getResponsableByEmail(email) {
        try {
            return await responsable.findOne({ email });
        } catch (err) {
            console.log(err);
        }
    }

    static async checkResponsable(email) {
        try {
            return await responsable.findOne({ email });
        } catch (error) {
            throw error;
        }
    }

    static async generateAccessToken(tokenData, JWTSecret_Key, JWT_EXPIRE) {
        return jwt.sign(tokenData, JWTSecret_Key, { expiresIn: JWT_EXPIRE });
    }
}

module.exports = ResponsableServices;