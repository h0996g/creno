const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const ObjectId = mongoose.Types.ObjectId;



const joueurSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
        
    },
    nom: {
        type: String,
        required: true
    },
    prenom: {
        type: String,
        
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
    commune: {
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

    demande_equipes: [{

        type: ObjectId, required: false,
        ref: "Equipe"

    }],

    mes_equipes: [{

        type: ObjectId, required: false,
        ref: "Equipe"

    }],

  
    annonces: [{
        type: ObjectId, required: false,
        ref: "Annonce"

    }],


    reservations: [{

        type: ObjectId, required: false,
        ref: "reservation"
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






joueurSchema.pre('deleteOne', async function(next) {
    try {
        const joueurId = this.getQuery()._id;

        // Delete all annonces associated with the joueur being deleted
        await mongoose.model('Annonce').deleteMany({ joueur_id: joueurId });

        // Delete all equipes where the joueur is the capitaine
        await mongoose.model('Equipe').deleteMany({ capitaine_id: joueurId });

        // Update all equipes where the joueur is a member to remove the joueur from joueurs array
        await mongoose.model('Equipe').updateMany(
            { joueurs: joueurId },
            { $pull: { joueurs: joueurId } }
        );


        await mongoose.model('Equipe').updateMany(
            { attente_joueurs: joueurId },
            { $pull: { attente_joueurs: joueurId } }
        );

        await mongoose.model('Reservation').deleteMany({ joueur_id: joueurId });


       
    } catch (error) {
        console.log(error);
    }
});





const Joueur = mongoose.model('Joueur', joueurSchema)
module.exports = Joueur   