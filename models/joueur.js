const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const ObjectId = mongoose.Types.ObjectId;



const joueurSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
    prenom: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true

    },
    telephone: {
        type: Number
    },
    mot_de_passe: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    poste: {
        type: String,
        // required: false
    },
    wilaya: {
        type: String,
        required: false
    },
    photo: {
        type: String,
        required: false
    },
    equipes: [{
        equipes: {
            type: ObjectId, required: true,
            ref: "Equipe"
        }
    }],

}, { timestamps: true })


joueurSchema.pre("save", async function () {
    var joueur = this;
    if (!joueur.isModified("mot_de_passe")) {
        return
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(joueur.mot_de_passe, salt);

        joueur.mot_de_passe = hash;
    } catch (err) {
        throw err;
    }
}, { timestamps: true });


//used while signIn decrypt
joueurSchema.methods.compareMot_de_passe = async function (candidateMot_de_passe) {
    try {
        console.log('----------------no mot_de_passe', this.mot_de_passe);
        // @ts-ignore
        const isMatch = await bcrypt.compare(candidateMot_de_passe, this.mot_de_passe);
        return isMatch;
    } catch (error) {
        throw error;
    }
};



const Joueur = mongoose.model('Joueur', joueurSchema)
module.exports = Joueur   