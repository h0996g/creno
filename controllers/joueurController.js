const Joueur = require('../models/joueur')
const Equipe = require('../models/equipe')
const Token = require('../models/token')
const JoueurServices = require('../services/joueur.service')
const nodemailer = require('nodemailer');
const bcrypt = require("bcrypt");
const { ObjectId } = require('mongoose').Types;


//----------------------------
exports.createJoueur = async (req, res, next) => {
    try {
        console.log("---req body---", req.body);
        const { username, email, mot_de_passe, nom, telephone, age, poste, wilaya, commune, photo, prenom } = req.body;

        // Check for duplicate email or username
        const duplicate = await Joueur.findOne({
            $or: [{ email: email }, { username: username }]
        });

        if (duplicate) {
            let message = "L'email ou le nom d'utilisateur est déjà enregistré";
            if (duplicate.email === email) {
                message = `L'email ${email} est déjà enregistré`;
            } else if (duplicate.username === username) {
                message = `Le nom d'utilisateur ${username} est déjà utilisé`;
            }
            return res.status(400).json({ status: false, message: message });
        }

        const joueur = await JoueurServices.registerJoueur(username, email, mot_de_passe, nom, telephone, age, poste, wilaya, commune, photo, prenom);

        let tokenData;
        tokenData = { _id: joueur._id, email: email, role: "joueur" };

        const token = await JoueurServices.generateAccessToken(tokenData, "365d")

        res.json({ status: true, message: 'Joueur registered successfully', token: token, data: joueur });

    } catch (err) {
        console.log("---> err -->", err);
        next(err);
    }
};

//----------------------------
exports.loginJoueur = async (req, res, next) => {
    try {

        const { email, mot_de_passe } = req.body;

        if (!email || !mot_de_passe) {
            // throw new Error('Parameter are not correct');
            return res.status(400).json({ status: false, message: 'Les paramètres ne sont pas corrects' });
        }
        let joueur = await JoueurServices.checkJoueur(email);
        if (!joueur) {
            // throw new Error('Joueur does not exist');
            return res.status(404).json({ status: false, message: 'Le joueur n\'existe pas' });
        }

        const isPasswordCorrect = await joueur.compareMot_de_passe(mot_de_passe);

        if (isPasswordCorrect === false) {
            // throw new Error(`Username or Password does not match`);
            return res.status(401).json({ status: false, message: 'Email ou le mot de passe ne correspond pas' });

        }

        // Creating Token

        let tokenData;
        tokenData = { _id: joueur._id, email: joueur.email, role: "joueur" };


        const token = await JoueurServices.generateAccessToken(tokenData, "365d")

        res.status(200).json({ status: true, success: "Bien connecté", token: token, data: joueur });
    } catch (error) {
        console.log(error, 'err---->');
        next(error);
    }
}
//----------------------------
exports.getMyInformation = async (req, res) => {
    try {
        const joueur_id = req.user._id;

        const joueur = await Joueur.findById(joueur_id);

        if (!joueur) {
            return res.status(404).json({ message: 'Joueur not found' });
        }

        res.json(joueur);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


//----------------------------
exports.updateJoueur = async (req, res) => {
    try {
        const joueurData = req.body;
        const joueur_id = req.user._id; // Extract admin ID from the token

        // Check if username is being updated and if it exists elsewhere
        if (joueurData.username) {
            const existingJoueur = await Joueur.findOne({
                username: joueurData.username,
                _id: { $ne: joueur_id } // Exclude this joueur's ID
            });

            if (existingJoueur) {
                return res.status(400).json({ message: 'Username already in use by another joueur' });
            }
        }

        // Update joueur data
        const updatedJoueur = await Joueur.findByIdAndUpdate(joueur_id, joueurData, { new: true });

        if (!updatedJoueur) {
            return res.status(404).json({ message: 'Joueur not found or unauthorized' });
        }

        res.json(updatedJoueur);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// exports.updateJoueur = async (req, res) => {
//     try {
//         // const id = req.params.id;
//         const joueurData = req.body;

//         // Extract admin ID from the token
//         const joueur_id = req.user._id;

//         // Update joueur data
//         const updatedJoueur = await Joueur.findByIdAndUpdate(joueur_id, joueurData, { new: true });

//         if (!updatedJoueur) {
//             return res.status(404).json({ message: 'Joueur not found or unauthorized' });
//         }
//         res.json(updatedJoueur);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };


//----------------------------
exports.getJoueurById = async (req, res) => {
    try {
        const id = req.params.id;
        const joueur = await Joueur.findById(id);
        if (!joueur) {
            return res.status(404).json({ message: 'Joueur not found' });
        }
        res.json(joueur);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
//-------------------------------------
exports.getJoueurByUsername = async (req, res) => {
    try {
        const  username  = req.params.username; // Get username from the request parameters
        const joueur = await Joueur.findOne({ username: username });
        if (!joueur) {
            return res.status(404).json({ message: 'Joueur not found' });
        }
        res.json(joueur);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//----------------------------

exports.getAllJoueurs = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 3; // How many documents to return
        const query = {};
        if (req.query.cursor) {
            query._id = { $lt: new ObjectId(req.query.cursor) }
        }
        // Fetch the documents from the database
        const joueurs = await Joueur.find(query).sort({ _id: -1 }).limit(limit);
        // Determine if there's more data to fetch
        const moreDataAvailable = joueurs.length === limit;

        // Optionally, you can fetch the next cursor by extracting the _id of the last document
        const nextCursor = moreDataAvailable ? joueurs[joueurs.length - 1]._id : null;

        res.json({
            data: joueurs,
            moreDataAvailable,
            nextCursor,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


//----------------------------

exports.filterJoueurs = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 3; // How many documents to return
        const filter = req.query; // Use the entire query object as the filter

        if (req.query.cursor) {
            filter._id = { $lt: new ObjectId(req.query.cursor) };
        }

        // Fetch the documents from the database, sort by _id
        const joueurs = await Joueur.find(filter).sort({ _id: -1 }).limit(limit);

        // Determine if there's more data to fetch
        const moreDataAvailable = joueurs.length === limit;

        // Optionally, you can fetch the next cursor by extracting the _id of the last document
        const nextCursor = moreDataAvailable ? joueurs[joueurs.length - 1]._id : null;

        res.json({
            data: joueurs,
            moreDataAvailable,
            nextCursor,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Update admin password
exports.updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        // Extract admin ID from the token
        const joueur_id = req.user._id;

        // Fetch admin by ID
        const joueur = await Joueur.findById(joueur_id);


        const isMatch = await joueur.compareMot_de_passe(oldPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Old password is incorrect' });
        }


        joueur.mot_de_passe = newPassword;
        await joueur.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


//----------------------------
exports.deleteJoueur = async (req, res) => {
    try {
        const joueurId = req.params.id;
        const deletedJoueur = await Joueur.deleteOne({ _id: joueurId });
        if (!deletedJoueur) {
            return res.status(404).json({ message: 'Joueur not found' });
        }
        res.json({ message: 'Joueur deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


//---------------------------- joueur yb3tdemande 
exports.demendeRejoindreEquipe = async (req, res) => {
    try {
        const { equipeId } = req.params;
        const joueurId = req.user._id;



        const equipe = await Equipe.findById(equipeId);
        if (!equipe) {
            return res.status(404).json({ message: 'equipe not found' });
        }

        // Find the joueur by ID
        const joueur = await Joueur.findById(joueurId);
        if (!joueur) {
            return res.status(404).json({ message: 'Joueur not found' });
        }



        // Update joueur's equipes array
        await Joueur.updateOne({ _id: joueurId }, { $push: { demande_equipes: equipeId } });

        // Update equipe's joueurs array
        await Equipe.updateOne({ _id: equipeId }, { $push: { attente_joueurs_demande: joueurId } });

        res.status(200).json({ message: 'Joueur asked to join equipe successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//--------------------------------- capitaine accept un joueur ------------------

exports.capitaineAcceptJoueur = async (req, res) => {
    try {
        const { equipeId, joueurId } = req.params;



        const equipe = await Equipe.findById(equipeId);
        if (!equipe) {
            return res.status(404).json({ message: 'equipe not found' });
        }

        // Find the joueur by ID
        const joueur = await Joueur.findById(joueurId);
        if (!joueur) {
            return res.status(404).json({ message: 'Joueur not found' });
        }



        // Update joueur's equipes array
        await Joueur.updateOne({ _id: joueurId }, { $pull: { demande_equipes: equipeId } });

        // Update equipe's joueurs array
        await Equipe.updateOne({ _id: equipeId }, { $pull: { attente_joueurs_demande: joueurId } });

        await Joueur.updateOne({ _id: joueurId }, { $push: { equipes: equipeId } });

        // Update equipe's joueurs array
        await Equipe.updateOne({ _id: equipeId }, { $push: { joueurs: joueurId } });

        res.status(200).json(joueur);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//------------------- capitaine anula demande te3 joueur 

exports.capitainerefuserjoueur = async (req, res) => {
    try {
        const { equipeId, joueurId } = req.params;



        const equipe = await Equipe.findById(equipeId);
        if (!equipe) {
            return res.status(404).json({ message: 'equipe not found' });
        }

        // Find the joueur by ID
        const joueur = await Joueur.findById(joueurId);
        if (!joueur) {
            return res.status(404).json({ message: 'Joueur not found' });
        }



        // Update joueur's equipes array
        await Joueur.updateOne({ _id: joueurId }, { $pull: { demande_equipes: equipeId } });

        // Update equipe's joueurs array
        await Equipe.updateOne({ _id: equipeId }, { $pull: { attente_joueurs_demande: joueurId } });

 

        res.status(200).json({ message: 'Joueur joined team successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//--------- capitaine demande joueur

exports.capitainedemandeJoueur = async (req, res) => {
    try {
        const { equipeId, joueurId } = req.params;



        const equipe = await Equipe.findById(equipeId);
        if (!equipe) {
            return res.status(404).json({ message: 'equipe not found' });
        }

        // Find the joueur by ID
        const joueur = await Joueur.findById(joueurId);
        if (!joueur) {
            return res.status(404).json({ message: 'Joueur not found' });
        }



        // Update joueur's equipes array
        await Joueur.updateOne({ _id: joueurId }, { $push: { demande_equipes: equipeId } });

        // Update equipe's joueurs array
        await Equipe.updateOne({ _id: equipeId }, { $push: { attente_joueurs: joueurId } });

 

        res.status(200).json(joueur);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
//-------------- capitaine yanuli invitation
exports.capitaineannulerJoueur = async (req, res) => {
    try {
        const { equipeId, joueurId } = req.params;



        const equipe = await Equipe.findById(equipeId);
        if (!equipe) {
            return res.status(404).json({ message: 'equipe not found' });
        }

        // Find the joueur by ID
        const joueur = await Joueur.findById(joueurId);
        if (!joueur) {
            return res.status(404).json({ message: 'Joueur not found' });
        }



        // Update joueur's equipes array
        await Joueur.updateOne({ _id: joueurId }, { $pull: { demande_equipes: equipeId } });

        // Update equipe's joueurs array
        await Equipe.updateOne({ _id: equipeId }, { $pull: { attente_joueurs: joueurId } });

 

        res.status(200).json({ message: 'Joueur joined team successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//---------------------------- nanuli demande te3i bch ndkhl l equipe ------
exports.annulerDemandeEquipe = async (req, res) => {
    try {
        const { equipeId } = req.params;
        const joueurId = req.user._id;


        // Find the creneau by ID
        const equipe = await Equipe.findById(equipeId);
        if (!equipe) {
            return res.status(404).json({ message: 'equipe not found' });
        }

        // Find the joueur by ID
        const joueur = await Joueur.findById(joueurId);
        if (!joueur) {
            return res.status(404).json({ message: 'Joueur not found' });
        }





        // Update joueur's equipes array
        await Joueur.updateOne({ _id: joueurId }, { $pull: { demande_equipes: equipeId } });

        // Update equipe's joueurs array
        await Equipe.updateOne({ _id: equipeId }, { $pull: { attente_joueurs_demande: joueurId } });



        res.status(200).json({ message: 'Joueur removed from equipe successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//----------------------------ki yb3tuli  w naccepti
exports.accepterRejoindreEquipe = async (req, res) => {
    try {
        const { equipeId } = req.params;
        const joueurId = req.user._id;


        const equipe = await Equipe.findById(equipeId);
        if (!equipe) {
            return res.status(404).json({ message: 'equipe not found' });
        }

        // Find the joueur by ID
        const joueur = await Joueur.findById(joueurId);
        if (!joueur) {
            return res.status(404).json({ message: 'Joueur not found' });
        }



        // Update joueur's equipes array
        await Joueur.updateOne({ _id: joueurId }, { $pull: { demande_equipes: equipeId } });

        await Joueur.updateOne({ _id: joueurId }, { $push: { equipes: equipeId } });

        // Update equipe's joueurs array
        await Equipe.updateOne({ _id: equipeId }, { $pull: { attente_joueurs: joueurId } });
        await Equipe.updateOne({ _id: equipeId }, { $push: { joueurs: joueurId } });

        res.status(200).json({ message: 'Joueur asked to join equipe successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//----------------------------ki yb3tuli  w refuser
exports.refuserRejoindreEquipe = async (req, res) => {
    try {
        const { equipeId } = req.params;
        const joueurId = req.user._id;


        const equipe = await Equipe.findById(equipeId);
        if (!equipe) {
            return res.status(404).json({ message: 'equipe not found' });
        }

        // Find the joueur by ID
        const joueur = await Joueur.findById(joueurId);
        if (!joueur) {
            return res.status(404).json({ message: 'Joueur not found' });
        }



        // Update joueur's equipes array
        await Joueur.updateOne({ _id: joueurId }, { $pull: { demande_equipes: equipeId } });

       

        // Update equipe's joueurs array
        await Equipe.updateOne({ _id: equipeId }, { $pull: { attente_joueurs: joueurId } });
    

        res.status(200).json({ message: 'Joueur asked to join equipe successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


//---------------------------- ki yb3tuli w maneciptich
exports.supprimerRejoindreEquipe = async (req, res) => {
    try {
        const { equipeId, joueurId } = req.params;


        const equipe = await Equipe.findById(equipeId);
        if (!equipe) {
            return res.status(404).json({ message: 'equipe not found' });
        }

        // Find the joueur by ID
        const joueur = await Joueur.findById(joueurId);
        if (!joueur) {
            return res.status(404).json({ message: 'Joueur not found' });
        }


        await Joueur.updateOne({ _id: joueurId }, { $pull: { equipes: equipeId } });

        // Update equipe's joueurs array
        // await Equipe.updateOne({ _id: equipeId }, { $pull: { attente_joueurs: joueurId } });
        await Equipe.updateOne({ _id: equipeId }, { $pull: { joueurs: joueurId } });

        res.status(200).json({ message: 'Joueur asked to join equipe successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//----------------------------
exports.recoverPassword = async (req, res) => {
    try {
        const { email } = req.body;
        // Check if the email exists in the database
        const joueur = await Joueur.findOne({ email: email });
        if (!joueur) {
            return res.status(404).json({ status: false, message: 'Email not found. Please enter a registered email address.' });
        }
        // Check if a token already exists for this joueur
        const existingToken = await Token.findOne({ joueur_id: joueur._id });
        if (existingToken) {
            // Optional: Delete the existing token before creating a new one
            await Token.deleteOne({ _id: existingToken._id });
        }
        // Generate a random verification code
        const verificationCode = Math.floor(10000 + Math.random() * 90000); // Generates a 5-digit code
        // Create a new token document in the database
        await Token.create({
            joueur_id: joueur._id, // Associate the token with the joueur
            token: verificationCode,
        });
        // Set up nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // Use environment variables
                pass: process.env.EMAIL_PASS, // Use environment variables
            },
        });

        // Define mail options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verification Code for Password Recovery',
            text: `Your verification code is: ${verificationCode}`,
        };

        // Send an email with the verification code
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ status: false, message: 'Internal server error' });
            }
            console.log('Email sent:', info.response);
            res.json({ status: true, message: 'Verification code sent successfully' });
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
        const joueur = await Joueur.findOne({ email: email });
        if (!joueur) {
            return res.status(404).json({ status: false, message: 'Email not found.' });
        }
        // Find a token for the joueur
        const token = await Token.findOne({ joueur_id: joueur._id, token: codeVerification });
        if (!token) {
            // If no matching token found, respond with an error status
            return res.status(404).json({ status: false, message: 'Verification code does not match or has expired.' });
        }
        // Respond with success status if the token matches
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
        const joueur = await Joueur.findOne({ email: email });
        if (!joueur) {
            return res.status(404).json({ status: false, message: 'Email not found. Please enter a registered email address.' });
        }
        const token = await Token.findOne({ joueur_id: joueur._id, token: codeVerification });
        if (!token) {
            // If no matching token found, respond with an error status
            return res.status(404).json({ status: false, message: 'Verification code does not match or has expired.' });
        }
        // Delete the token after successful verification to ensure it's used only once
        await Token.deleteOne({ _id: token._id });
        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt); // Assuming 10 is the salt rounds
        // Update the joueur's password with the hashed new password using Mongoose's findOneAndUpdate
        await Joueur.findOneAndUpdate(
            { email: email },
            { $set: { mot_de_passe: hashedPassword } } // Use $set to specify the fields to update
        );
        return res.status(200).json({ status: true, message: 'Password reset successful' });
    } catch (error) {
        console.error('Error during password reset:', error);
        return res.status(500).json({ status: false, message: 'Internal server error' });
    }
};