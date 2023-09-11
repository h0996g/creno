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