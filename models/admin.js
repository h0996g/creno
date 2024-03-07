const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const ObjectId = mongoose.Types.ObjectId;


const adminSchema = new mongoose.Schema({
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
        type: Number,
        require: true
    },
    mot_de_passe: {
        type: String,
        required: true
    },
    wilaya: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        // required: true
    },



    annonces: [{


        type: ObjectId, required: false,
        ref: "Annonce"

    }],
    tournois: [{

        type: ObjectId, required: false,
        ref: "Tournoi"

    }],
    terrains: [{

        type: ObjectId, required: false,
        ref: "Terrain"

    }],
}, {
    toJSON: {
        transform: function (doc, ret) {
            delete ret.mot_de_passe;
        }
    }
}, { timestamps: true })

// Pre-save hook to hash password
adminSchema.pre("save", async function () {
    console.log("sace")
    var admin = this;
    if (!admin.isModified("mot_de_passe")) {
        return;
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(admin.mot_de_passe, salt);
        admin.mot_de_passe = hash;
    } catch (err) {
        throw err;
    }
});

// Method to compare passwords during sign -in
adminSchema.methods.compareMot_de_passe = async function (candidateMot_de_passe) {
    try {
        const isMatch = await bcrypt.compare(candidateMot_de_passe, this.mot_de_passe);
        return isMatch;
    } catch (error) {
        throw error;
    }
};

adminSchema.pre('deleteOne', async function (next) {
    try {
        await mongoose.model('Terrain').deleteMany({ admin_id: this.getQuery()._id })
    } catch (error) {
        console.log(error);
    }
});


const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
