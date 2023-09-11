const Responsable = require('../models/responsable')
const ResponsableServices = require('../services/responsable.service')



exports.createResponsible = async (req, res, next) => {
    try {
        console.log("---req body---", req.body);
        const { email, password, name, phone, age } = req.body;
        const duplicate = await ResponsableServices.getResponsableByEmail(email);
        if (duplicate) {
            throw new Error(`Responsable Name ${email}, Already Registered`)
        }

        const response = await ResponsableServices.registerResponsable(email, password, name, phone, age);

        let tokenData;
        tokenData = { _id: response._id, email: email };


        const token = await ResponsableServices.generateAccessToken(tokenData, "secret", "1h")


        res.json({ status: true, message: 'Responsable registered successfully', token: token, id: response._id });


    } catch (err) {
        console.log("---> err -->", err);
        next(err);
    }
}
exports.loginResponsable = async (req, res, next) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            throw new Error('Parameter are not correct');
        }
        let responsable = await ResponsableServices.checkResponsable(email);
        if (!responsable) {
            throw new Error('Responsable does not exist');
        }

        const isPasswordCorrect = await responsable.comparePassword(password);

        if (isPasswordCorrect === false) {
            throw new Error(`Responsable Name or Password does not match`);
        }

        // Creating Token

        let tokenData;
        tokenData = { _id: responsable._id, email: responsable.email };


        const token = await ResponsableServices.generateAccessToken(tokenData, "secret", "1h")

        res.status(200).json({ status: true, success: "sendData", token: token, name: responsable.name });
    } catch (error) {
        console.log(error, 'err---->');
        next(error);
    }
}
