const Joueur = require('../models/joueur')
const Equipe = require('../models/equipe')
const Creneau = require('../models/creneau')
const JoueurServices = require('../services/joueur.service')



exports.createJoueur = async (req, res, next) => {
    try {
        console.log("---req body---", req.body);
        const { email, mot_de_passe, nom, telephone, age, poste, wilaya, photo, prenom } = req.body;
        const duplicate = await JoueurServices.getJoueurByEmail(email);
        if (duplicate) {
            // throw new Error(`Etudient Name ${email}, Already Registered`)
            return res.status(400).json({ status: false, message: `L'email ${email} est déjà enregistré` });
        }

        const joueur = await JoueurServices.registerJoueur(email, mot_de_passe, nom, telephone, age, poste, wilaya, photo, prenom);

        let tokenData;
        tokenData = { _id: joueur._id, email: email, role: "joueur" };


        const token = await JoueurServices.generateAccessToken(tokenData, "365d")

        res.json({ status: true, message: 'Joueur registered successfully', token: token, data: joueur });


    } catch (err) {
        console.log("---> err -->", err);
        next(err);
    }
}

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




exports.updateJoueur = async (req, res) => {
    try {
        // const id = req.params.id;
        const joueurData = req.body;

        // Extract admin ID from the token
        const joueur_id = req.user._id;

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


exports.getAllJoueurs = async (req, res) => {
    try {
        const joueurs = await Joueur.find();
        res.json(joueurs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



exports.filterJoueurs = async (req, res) => {
    try {
        const filter = req.query; // Extract the filter from query parameters
        const joueurs = await Joueur.find(filter);
        res.json(joueurs);
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



exports.rejoindreEquipe = async (req, res) => {
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
        await Joueur.updateOne({ _id: joueurId }, { $push: { equipes: equipeId } });

        // Update equipe's joueurs array
        await Equipe.updateOne({ _id: equipeId }, { $push: { joueurs: joueurId } });

        res.status(200).json({ message: 'Joueur added to equipe successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




exports.quitterEquipe = async (req, res) => {
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
        await Joueur.updateOne({ _id: joueurId }, { $pull: { equipes: equipeId } });

        // Update equipe's joueurs array
        await Equipe.updateOne({ _id: equipeId }, { $pull: { joueurs: joueurId } });

     

        res.status(200).json({ message: 'Joueur removed from equipe successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




exports.demanderCreneau = async (req, res) => {
    try {
        const { creneauId } = req.params;
        const joueurId = req.user._id; // Assuming the authenticated user's ID is stored in req.user._id


     // Find the creneau by ID
     const creneau = await Creneau.findById(creneauId);
     if (!creneau) {
         return res.status(404).json({ message: 'Creneau not found' });
     }

     // Find the joueur by ID
     const joueur = await Joueur.findById(joueurId);
     if (!joueur) {
         return res.status(404).json({ message: 'Joueur not found' });
     }




 await Joueur.updateOne({ _id: joueurId }, { $push: { creneaus_reserve: creneauId } });

 
 await Creneau.updateOne({ _id: creneauId }, { $push: { joueurs: joueurId } });


       

        res.status(200).json({ message: 'Joueur added to creneau successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};