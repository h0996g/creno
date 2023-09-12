const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const ObjectId = mongoose.Types.ObjectId;


const responsableSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true

    },
    phone: {
        type: Number
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },



}, { timestamps: true })


responsableSchema.pre("save", async function () {
    var responsable = this;
    if (!responsable.isModified("password")) {
        return
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(responsable.password, salt);

        responsable.password = hash;
    } catch (err) {
        throw err;
    }
});


//used while signIn decrypt
responsableSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        console.log('----------------no password', this.password);
        // @ts-ignore
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (error) {
        throw error;
    }
};



const Responsable = mongoose.model('Responsable', responsableSchema)
module.exports = Responsable   