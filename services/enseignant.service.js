// // UserModel = require("../models/user.model");
// // const user = require('../models/etudient');
// const enseignant = require('../models/enseignant');

// const jwt = require("jsonwebtoken");

// class EnseignantServices {

//     static async registerEnseignant(email, password, name, phone, image, module) {
//         try {
//             console.log("-----Email --- Password-----", email, password, name, phone, image, module);

//             const createEnseignant = new enseignant({ email, password, name, phone, image, module });
//             return await createEnseignant.save();
//         } catch (err) {
//             throw err;
//         }
//     }

//     static async getEnseignantByEmail(email) {
//         try {
//             return await enseignant.findOne({ email });
//         } catch (err) {
//             console.log(err);
//         }
//     }

//     static async checkEnseignant(email) {
//         try {
//             return await enseignant.findOne({ email });
//         } catch (error) {
//             throw error;
//         }
//     }

//     static async generateAccessToken(tokenData, JWTSecret_Key, JWT_EXPIRE) {
//         return jwt.sign(tokenData, JWTSecret_Key, { expiresIn: JWT_EXPIRE });
//     }
// }

// module.exports = EnseignantServices;