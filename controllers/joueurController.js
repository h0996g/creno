const Joueur = require('../models/joueur')
const JoueurServices = require('../services/joueur.service')
const DemandCreno = require('../models/demandCreno')


exports.createJoueur = async (req, res, next) => {
    try {
        console.log("---req body---", req.body);
        const { email, mot_de_passe, nom, telephone, age, poste, wilaya, photo, prenom } = req.body;
        const duplicate = await JoueurServices.getJoueurByEmail(email);
        if (duplicate) {
            // throw new Error(`Etudient Name ${email}, Already Registered`)
            return res.status(400).json({ status: false, message: `L'email ${email} est déjà enregistré` });
        }

        const response = await JoueurServices.registerJoueur(email, mot_de_passe, nom, telephone, age, poste, wilaya, photo, prenom);

        let tokenData;
        tokenData = { _id: response._id, email: email };


        const token = await JoueurServices.generateAccessToken(tokenData, "secret", "1h")

        res.json({ status: true, message: 'Joueur registered successfully', token: token, id: response._id });


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
            return res.status(404).json({ status: false, message: 'L\'administrateur n\'existe pas' });
        }

        const isPasswordCorrect = await joueur.compareMot_de_passe(mot_de_passe);

        if (isPasswordCorrect === false) {
            // throw new Error(`Username or Password does not match`);
            return res.status(401).json({ status: false, message: 'Le nom d\'administrateur ou le mot de passe ne correspond pas' });
        
        }

        // Creating Token

        let tokenData;
        tokenData = { _id: joueur._id, email: joueur.email };


        const token = await JoueurServices.generateAccessToken(tokenData, "secret", "1h")

        res.status(200).json({ status: true, success: "Bien connecté", token: token, name: joueur.nom, email: joueur.email });
    } catch (error) {
        console.log(error, 'err---->');
        next(error);
    }
}

exports.demandCreno = async (req, res) => {
    try {
        const userId = req.user._id
        const { terrainId, dateStart, dateEnd, timeStart, timeEnd } = req.body;
        const demandCreno = new DemandCreno({ userId, terrainId, dateStart, dateEnd, timeStart, timeEnd })
        await demandCreno.save();
        res.json({ data: demandCreno });
    } catch (e) {
        res.status(500).json({ error: e.message });

    }
}
