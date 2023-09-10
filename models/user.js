const mongoose = require('mongoose');
const bcrypt = require("bcrypt");


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true

    },
    phone: {
        type: Number
    },
    password: {
        type: String,
        requre: true
    },
    age: {
        type: Number,
        requre: true
    },
    post: {
        type: String,
        requre: false
    },
    left: {
        type: Boolean,
        requre: false
    },

})


userSchema.pre("save", async function () {
    var user = this;
    if (!user.isModified("password")) {
        return
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password, salt);

        user.password = hash;
    } catch (err) {
        throw err;
    }
});


//used while signIn decrypt
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        console.log('----------------no password', this.password);
        // @ts-ignore
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (error) {
        throw error;
    }
};



const User = mongoose.model('User', userSchema)
module.exports = User   