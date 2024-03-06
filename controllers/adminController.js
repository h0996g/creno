const Admin = require('../models/admin')
const AdminServices = require('../services/admin.service')



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