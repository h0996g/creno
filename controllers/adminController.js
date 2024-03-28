const Admin = require('../models/admin')
// const Creneau = require('../models/creneau')
const Joueur = require('../models/joueur')
const Equipe = require('../models/equipe')
const Reservation = require('../models/reservation')
const AdminServices = require('../services/admin.service')
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
exports.loginAdmin = async (req, res, next) => {
    try {

        const { email, mot_de_passe } = req.body;

        if (!email || !mot_de_passe) {
            // throw new Error('Parameter are not correct');
            return res.status(400).json({ status: false, message: 'Les paramètres ne sont pas corrects' });
        }
        let admin = await AdminServices.checkAdmin(email);
        if (!admin) {
            // throw new Error('Admin does not exist');
            return res.status(404).json({ status: false, message: 'L\'administrateur n\'existe pas' });
        }

        const isMot_de_passeCorrect = await admin.compareMot_de_passe(mot_de_passe);

        if (isMot_de_passeCorrect === false) {
            // throw new Error(`Admin Name or Password does not match`);
            return res.status(401).json({ status: false, message: 'Le nom d\'administrateur ou le mot de passe ne correspond pas' });
        }

        // Creating Token

        let tokenData;

        tokenData = { _id: admin._id, email: admin.email, role: "admin" };


        const token = await AdminServices.generateAccessToken(tokenData, "365d")

        res.status(200).json({ status: true, success: "Bien connecté", token: token, data: admin });
    } catch (error) {
        console.log(error, 'err---->');
        next(error);
    }
}
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


exports.updateAdmin = async (req, res) => {
    try {
        const adminData = req.body;

        // Extract admin ID from the token
        const admin_id = req.user._id;

        // Update admin data
        const updatedAdmin = await Admin.findByIdAndUpdate(admin_id, adminData, { new: true });

        if (!updatedAdmin) {
            return res.status(404).json({ message: 'Admin not found or unauthorized' });
        }
        res.json(updatedAdmin);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

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

// Get all admins
exports.getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find();
        res.json(admins);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Filter admins
exports.filterAdmins = async (req, res) => {
    try {
        const filter = req.query; // Extract the filter from query parameters
        const admins = await Admin.find(filter);
        res.json(admins);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// Update admin password
exports.updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        // Extract admin ID from the token
        const admin_id = req.user._id;

        // Fetch admin by ID
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


// Delete admin by ID
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



// exports.accepterDemande = async (req, res) => {
//     try {
//         const { creneauId, joueurId } = req.params;

//         // Find the creneau by ID
//         const creneau = await Creneau.findById(creneauId);
//         if (!creneau) {
//             return res.status(404).json({ message: 'Creneau not found' });
//         }

//         // Find the joueur by ID
//         const joueur = await Joueur.findById(joueurId);
//         if (!joueur) {
//             return res.status(404).json({ message: 'Joueur not found' });
//         }

//         // Update the creneau with joueur_id and remove joueurId from joueurs array
//         await Creneau.updateOne({ _id: creneauId }, { $set: { joueur_id: joueurId }, $pull: { joueurs: joueurId } });

//         // Remove the creneauId from creneaus_reserve and add it to creneaus_finale in joueur
//         await Joueur.updateOne({ _id: joueurId }, { $pull: { creneaus_reserve: creneauId }, $push: { creneaus_finale: creneauId } });

//         res.status(200).json({ message: 'Demande accepted successfully' });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };


// exports.suprimerReservationCreneau = async (req, res) => {
//     try {
//         const { creneauId, joueurId } = req.params;

//         // Find the creneau by ID
//         const creneau = await Creneau.findById(creneauId);
//         if (!creneau) {
//             return res.status(404).json({ message: 'Creneau not found' });
//         }

//         // Find the joueur by ID
//         const joueur = await Joueur.findById(joueurId);
//         if (!joueur) {
//             return res.status(404).json({ message: 'Joueur not found' });
//         }

//         // Update the creneau with joueur_id and remove joueurId from joueurs array
//         await Creneau.updateOne({ _id: creneauId }, { $unset: { joueur_id: "" }});

//         // Remove the creneauId from creneaus_reserve and add it to creneaus_finale in joueur
//         await Joueur.updateOne({ _id: joueurId }, {  $pull: { creneaus_finale: creneauId } });

//         res.status(200).json({ message: 'creno libre a nouveau' });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// exports.payCreneau = async (req, res) => {
//     try {
//         const { creneauId } = req.params;

        
//         await Creneau.updateOne(
//             { _id: creneauId },
//             { $set: { payment: "paye" } }
//         );

        
       

//         res.status(200).json({ message: 'Payment status updated successfully' });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// exports.nonPayeCreneau = async (req, res) => {
//     try {
//         const { creneauId } = req.params;

//         // Update the payment field to its default value using updateOne
//         await Creneau.updateOne(
//             { _id: creneauId },
//             { $set: { payment: "non" } }
//         );

//         // Check if the update was successful
       

//         res.status(200).json({ message: 'Payment status set to default successfully' });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };




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

exports.refuserReservation = async (req, res) => {
    try {
        const { reservationId } = req.params;

        // Find the creneau by ID
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




exports.payReservation = async (req, res) => {
        try {
            const { reservationId } = req.params;
    
            
            await Reservation.updateOne(
                { _id: reservationId },
                { $set: { payment: "paye" } }
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
                { $set: { payment: "non" } }
            );
    
            
           
    
            res.status(200).json({ message: 'Payment status updated successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };




    exports.recoverPassword = async (req, res) => {
        try {
            const { email } = req.body;
    
            // Check if the email exists in the database (Mongoose syntax)
            const admin = await Admin.findOne({ email: email });
            if (!admin) {
                return res.status(404).json({ status: false, message: 'Email not found. Please enter a registered email address.' });
            }
    
            // Generate a random verification code
            const verificationCode = Math.floor(10000 + Math.random() * 90000); // Generates a 5-digit code
    
            // Update the user's verification code in the database (Mongoose syntax)
            await Admin.findOneAndUpdate(
                { email: email },
                { $set: { verificationCode: verificationCode.toString() } } // Convert to string and use $set for updating
            );
    
            // Send an email to the user with the verification code
            // Note: Replace with your actual email and password, and use environment variables for sensitive data
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    
                    user: process.env.EMAIL_USER, // Recommended to use environment variables
                    
                     pass: process.env.EMAIL_PASS,
                     // Recommended to use environment variables
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
    
    
    
    exports.resetPassword = async (req, res) => {
        try {
            const { email, newPassword } = req.body;
    
            // Find the patient by email using Mongoose's findOne
            const admin = await Admin.findOne({ email: email });
            if (!admin) {
                return res.status(404).json({ status: false, message: 'Email not found. Please enter a registered email address.' });
            }
    
            // Hash the new password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt); // Assuming 10 is the salt rounds
    
         // Update the joueur's password with the hashed new password using Mongoose's findOneAndUpdate
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