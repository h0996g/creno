const User = require('../models/user')
const UserServices = require('../services/user.service')
const DemandCreno = require('../models/demandCreno')


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

exports.loginUser = async (req, res, next) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            throw new Error('Parameter are not correct');
        }
        let user = await UserServices.checkUser(email);
        if (!user) {
            throw new Error('User does not exist');
        }

        const isPasswordCorrect = await user.comparePassword(password);

        if (isPasswordCorrect === false) {
            throw new Error(`Username or Password does not match`);
        }

        // Creating Token

        let tokenData;
        tokenData = { _id: user._id, email: user.email };


        const token = await UserServices.generateAccessToken(tokenData, "secret", "1h")

        res.status(200).json({ status: true, success: "sendData", token: token, name: user.name, email: user.email });
    } catch (error) {
        console.log(error, 'err---->');
        next(error);
    }
}

exports.demandCreno = async (req, res) => {
    try {
        const { userId, terrainId, dateStart, dateEnd, timeStart, timeEnd } = req.body;
        const demandCreno = new DemandCreno({ userId, terrainId, dateStart, dateEnd, timeStart, timeEnd })
        await demandCreno.save();
        res.json({ data: demandCreno });
    } catch (e) {

    }
}
