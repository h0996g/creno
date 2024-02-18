const Admin = require('../models/admin')
const AdminServices = require('../services/admin.service')



exports.createAdmin = async (req, res, next) => {
    try {
        console.log("---req body---", req.body);
        const { email, mot_de_passe, nom, prenom, telephone, wilaya } = req.body;
        const duplicate = await AdminServices.getAdminByEmail(email);
        if (duplicate) {
            throw new Error(`Admin Name ${email}, Already Registered`)
        }

        const response = await AdminServices.registerAdmin(email, mot_de_passe, nom, prenom, telephone, wilaya);

        let tokenData;
        tokenData = { _id: response._id, email: email };


        const token = await AdminServices.generateAccessToken(tokenData, "secret", "1h")


        res.json({ status: true, message: 'Admin registered successfully', token: token, id: response._id });


    } catch (err) {
        console.log("---> err -->", err);
        next(err);
    }
}
exports.loginAdmin = async (req, res, next) => {
    try {

        const { email, mot_de_passe } = req.body;

        if (!email || !mot_de_passe) {
            throw new Error('Parameter are not correct');
        }
        let admin = await AdminServices.checkAdmin(email);
        if (!admin) {
            throw new Error('Admin does not exist');
        }

        const isMot_de_passeCorrect = await admin.compareMot_de_passe(mot_de_passe);

        if (isMot_de_passeCorrect === false) {
            throw new Error(`Admin Name or Password does not match`);
        }

        // Creating Token

        let tokenData;
        tokenData = { _id: admin._id, email: admin.email };


        const token = await AdminServices.generateAccessToken(tokenData, "secret", "1h")

        res.status(200).json({ status: true, success: "sendData", token: token, name: admin.nom });
    } catch (error) {
        console.log(error, 'err---->');
        next(error);
    }
}
