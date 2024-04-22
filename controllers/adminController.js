const Admin = require('../models/admin')
const Token = require('../models/token')
const Joueur = require('../models/joueur')
const Equipe = require('../models/equipe')
const Reservation = require('../models/reservation')
const AdminServices = require('../services/admin.service')
const { ObjectId } = require('mongoose').Types
const bcrypt = require("bcrypt");


exports.createAdmin = async (req, res, next) => {
    try {
        console.log("---req body---", req.body);
        const { email, mot_de_passe, nom, prenom, telephone, wilaya, photo } = req.body;
        const duplicate = await AdminServices.getAdminByEmail(email);
        if (duplicate) {
            // throw new Error(`this ${email}, Already Registered`)
            return res.status(400).json({ status: false, message: `L'email ${email} est déjà enregistré` });
        }

        const admin = await AdminServices.registerAdmin(email, mot_de_passe, nom, prenom, telephone, wilaya, photo);

        let tokenData;
        tokenData = { _id: admin._id, email: email, role: "admin" };


        const token = await AdminServices.generateAccessToken(tokenData, "365d")


        res.json({ status: true, message: 'Admin enregistré avec succès', token: token, id: admin._id, data: admin });


    } catch (err) {
        console.log("---> err -->", err);
        next(err);
    }
}
//----------------------------
exports.loginAdmin = async (req, res, next) => {
    try {
        const { email, mot_de_passe } = req.body;
        if (!email || !mot_de_passe) {
            return res.status(400).json({ status: false, message: 'Les paramètres ne sont pas corrects' });
        }
        let admin = await AdminServices.checkAdmin(email);
        if (!admin) {
            return res.status(404).json({ status: false, message: 'L\'administrateur n\'existe pas' });
        }
        const isMot_de_passeCorrect = await admin.compareMot_de_passe(mot_de_passe);
        if (isMot_de_passeCorrect === false) {
            return res.status(401).json({ status: false, message: 'Le nom d\'administrateur ou le mot de passe ne correspond pas' });
        }
        let tokenData;
        tokenData = { _id: admin._id, email: admin.email, role: "admin" };
        const token = await AdminServices.generateAccessToken(tokenData, "365d")
        res.status(200).json({ status: true, success: "Bien connecté", token: token, data: admin });
    } catch (error) {
        console.log(error, 'err---->');
        next(error);
    }
}
//----------------------------
exports.getMyInformation = async (req, res) => {
    try {
        const admin_id = req.user._id;
        const admin = await Admin.findById(admin_id);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.json(admin);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//----------------------------
exports.updateAdmin = async (req, res) => {
    try {
        const adminData = req.body;

        const admin_id = req.user._id;
        const updatedAdmin = await Admin.findByIdAndUpdate(admin_id, adminData, { new: true });
        if (!updatedAdmin) {
            return res.status(404).json({ message: 'Admin not found or unauthorized' });
        }
        res.json(updatedAdmin);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
//----------------------------
// Get an admin by ID
exports.getAdminById = async (req, res) => {
    try {
        const id = req.params.id;
        const admin = await Admin.findById(id);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.json(admin);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


//----------------------------
exports.getAllAdmins = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 3; // How many documents to return
        const query = {};
        if (req.query.cursor) {
            query._id = { $lt: new ObjectId(req.query.cursor) }
        }
        const admins = await Admin.find(query).sort({ _id: -1 }).limit(limit);
        const moreDataAvailable = admins.length === limit;
        const nextCursor = moreDataAvailable ? admins[admins.length - 1]._id : null;

        res.json({
            data: admins,
            moreDataAvailable,
            nextCursor,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


//----------------------------
exports.filterAdmins = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 3; // How many documents to return
        const filter = req.query; // Use the entire query object as the filter

        if (req.query.cursor) {
            filter._id = { $lt: new ObjectId(req.query.cursor) };
        }

        const admins = await Admin.find(filter).sort({ _id: -1 }).limit(limit);

        const moreDataAvailable = admins.length === limit;

        const nextCursor = moreDataAvailable ? admins[admins.length - 1]._id : null;

        res.json({
            data: admins,
            moreDataAvailable,
            nextCursor,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



//----------------------------
exports.updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        const admin_id = req.user._id;

        const admin = await Admin.findById(admin_id);


        const isMatch = await admin.compareMot_de_passe(oldPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Old password is incorrect' });
        }


        admin.mot_de_passe = newPassword;
        await admin.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


//----------------------------
exports.deleteAdmin = async (req, res) => {
    try {
        const adminId = req.params.id;
        const deletedAdmin = await Admin.deleteOne({ _id: adminId });
        if (!deletedAdmin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.json({ message: 'Admin deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//----------------------------
exports.accepterReservation = async (req, res) => {
    try {
        const { reservationId } = req.params;

        // Find the creneau by ID
        const reservation = await Reservation.findById(reservationId);
        if (!reservation) {
            return res.status(404).json({ message: 'reservation not found' });
        }
        await Reservation.updateOne({ _id: reservationId }, { $set: { etat: "accepter" } });

        res.status(200).json({ message: 'Demande accepted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
//----------------------------
exports.refuserReservation = async (req, res) => {
    try {
        const { reservationId } = req.params;

        const reservation = await Reservation.findById(reservationId);
        if (!reservation) {
            return res.status(404).json({ message: 'reservation not found' });
        }
        await Reservation.updateOne({ _id: reservationId }, { $set: { etat: "refuser" } });

        res.status(200).json({ message: 'Demande refuser' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



//----------------------------
exports.payReservation = async (req, res) => {
    try {
        const { reservationId } = req.params;


        await Reservation.updateOne(
            { _id: reservationId },
            { $set: { payment: true } }
        );
        res.status(200).json({ message: 'Payment status updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.nonpayReservation = async (req, res) => {
    try {
        const { reservationId } = req.params;


        await Reservation.updateOne(
            { _id: reservationId },
            { $set: { payment: false } }
        );




        res.status(200).json({ message: 'Payment status updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



//----------------------------
exports.recoverPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const admin = await Admin.findOne({ email: email });
        if (!admin) {
            return res.status(404).json({ status: false, message: 'Email not found. Please enter a registered email address.' });
        }

        const existingToken = await Token.findOne({ admin_id: admin._id });
        if (existingToken) {
            await Token.deleteOne({ _id: existingToken._id });
        }

        const verificationCode = Math.floor(10000 + Math.random() * 90000); // Generates a 5-digit code

        await Token.create({
            admin_id: admin._id, // Associate the token with the joueur
            token: verificationCode,

        });
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {

                user: process.env.EMAIL_USER, // Recommended to use environment variables

                pass: process.env.EMAIL_PASS,
            },
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verification Code for Password Recovery',
            text: `Your verification code is: ${verificationCode}`,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ status: false, message: 'Internal server error' });
            }
            console.log('Email sent:', info.response);
            res.json({ status: true, message: 'Verification code sent successfully', verificationCode: verificationCode.toString() });
        });
    } catch (error) {
        console.error('Error during password recovery:', error);
        res.status(500).json({ status: false, message: 'Internal server error' });
    }
};


//----------------------------

exports.verifyToken = async (req, res) => {
    try {
        const { email, codeVerification } = req.body;
        // Find the joueur by email
        const admin = await Admin.findOne({ email: email });
        if (!admin) {
            return res.status(404).json({ status: false, message: 'Email not found.' });
        }
        // Find a token for the joueur
        const token = await Token.findOne({ admin_id: admin._id, token: codeVerification });
        if (!token) {
            // If no matching token found, respond with an error status
            return res.status(404).json({ status: false, message: 'Verification code does not match or has expired.' });
        }
        res.status(200).json({ status: true, message: 'Verification successful.' });
    } catch (error) {
        console.error('Error during token verification:', error);
        res.status(500).json({ status: false, message: 'Internal server error' });
    }
};
//----------------------------
exports.resetPassword = async (req, res) => {
    try {
        const { email, newPassword, codeVerification } = req.body;

        // Find the patient by email using Mongoose's findOne
        const admin = await Admin.findOne({ email: email });
        if (!admin) {
            return res.status(404).json({ status: false, message: 'Email not found. Please enter a registered email address.' });
        }
        const token = await Token.findOne({ admin_id: admin._id, token: codeVerification });
        if (!token) {

            return res.status(404).json({ status: false, message: 'Verification code does not match or has expired.' });
        }
        await Token.deleteOne({ _id: token._id });
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt); // Assuming 10 is the salt rounds

        await Admin.findOneAndUpdate(
            { email: email },
            { $set: { mot_de_passe: hashedPassword } } // Use $set to specify the fields to update
        );

        return res.status(200).json({ status: true, message: 'Password reset successful' });
    } catch (error) {
        console.error('Error during password reset:', error);
        return res.status(500).json({ status: false, message: 'Internal server error' });
    }
};