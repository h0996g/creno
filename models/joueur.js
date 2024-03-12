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

        type: ObjectId, required: false,
        ref: "Equipe"

    }],

    mes_equipes: [{

        type: ObjectId, required: false,
        ref: "Equipe"

    }],

    // terrains: [{

    //         type: ObjectId, required: true,
    //         ref: "Terrain"

    // }],
    annonces: [{
        type: ObjectId, required: false,
        ref: "Annonce"

    }],
    creneaus_reserve: [{

        type: ObjectId, required: false,
        ref: "Creneau"

    }],
    creneaus_finale: [{

        type: ObjectId, required: false,
        ref: "Creneau"

    }],


}, {
    toJSON: {
        transform: function (doc, ret) {
            delete ret.mot_de_passe;
        }
    }
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



joueurSchema.pre('deleteOne', async function (next) {
    try {
        const joueurId = this.getQuery()._id;
        // nehi les annonce
        await mongoose.model('Annonce').deleteMany({ joueur_id: joueurId })
        // nehi les equipe
        await mongoose.model('Equipe').deleteMany({ capitaine_id: joueurId })
        // nehi id mn equipe reni fiha
        const equipes = await mongoose.model('Equipe').find({ joueurs: joueurId });

        for (const equipe of equipes) {
            equipe.joueurs.pull(joueurId);
            await equipe.save();
        }
        
// nehi id mn creno demandi
        const creneaus = await mongoose.model('Creneau').find({ joueurs: joueurId });

        for (const creneau of creneaus) {
            creneau.joueurs.pull(joueurId);
            await creneau.save();
        }
        //nehi id mn crenau hekmu
        await mongoose.model('Creneau').updateMany({ joueur_id: joueurId }, { $unset: { joueur_id: "" } });



    } catch (error) {
        console.log(error);
    }
});




const Joueur = mongoose.model('Joueur', joueurSchema)
module.exports = Joueur   