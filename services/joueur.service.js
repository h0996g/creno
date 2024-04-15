const joueur = require('../models/joueur');

const jwt = require("jsonwebtoken");

class JoueurServices {

    static async registerJoueur(email, mot_de_passe, nom, telephone, age, poste, wilaya, photo, commune,prenom) {
        try {
            console.log("-----Email --- Password-----", email, mot_de_passe, nom, telephone, age, poste, wilaya, photo, commune,prenom);

            const createJoueur = new joueur({ email, mot_de_passe, nom, telephone, age, poste, wilaya, photo, commune,prenom });
            return await createJoueur.save();
        } catch (err) {
            throw err;
        }
    }

    static async getJoueurByEmail(email) {
        try {
            return await joueur.findOne({ email });
        } catch (err) {
            console.log(err);
        }
    }

    static async checkJoueur(email) {
        try {
            return await joueur.findOne({ email });
        } catch (error) {
            throw error;
        }
    }

    static async generateAccessToken(tokenData, JWT_EXPIRE) {
        return jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRE });
    }
}

module.exports = JoueurServices;