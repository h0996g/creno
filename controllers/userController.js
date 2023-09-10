const User = require('../models/user')
const UserServices = require('../services/user.service')


exports.createUser = async (req, res, next) => {
    try {
        console.log("---req body---", req.body);
        const { email, password, name, phone, age, post, left } = req.body;
        const duplicate = await UserServices.getUserByEmail(email);
        if (duplicate) {
            throw new Error(`Etudient Name ${email}, Already Registered`)
        }

        const response = await UserServices.registerUser(email, password, name, phone, age, post, left);

        let tokenData;
        tokenData = { _id: response._id, email: email };


        const token = await UserServices.generateAccessToken(tokenData, "secret", "1h")

        res.json({ status: true, message: 'User registered successfully', token: token, id: response._id });


    } catch (err) {
        console.log("---> err -->", err);
        next(err);
    }
}

