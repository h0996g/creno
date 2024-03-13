const express = require('express');
const joueurController = require('../controllers/joueurController');
const adminController = require('../controllers/adminController');
const terrainController = require('../controllers/terrainController')
const equipeController = require('../controllers/equipeController')
const creneauController = require('../controllers/creneauController')
const tournoiController = require('../controllers/tournoiController')
const photoController = require('../controllers/photocontroller')
const annonceController = require('../controllers/annonceController')
const { protect, isAdmin } = require('../handler/auth');

const router = express.Router();
router.get('/', async (req, res) => {
    res.json({ message: 'hello' })

})

// ---------------------User---------------------------------------------

router.get('/joueur', joueurController.loginJoueur)
router.get('/joueur/myinformation', protect, joueurController.getMyInformation)

router.post('/loginjoueur', joueurController.loginJoueur)
router.post('/joueur', joueurController.createJoueur)

// Update a joueur
router.put('/joueur', protect, joueurController.updateJoueur);

// Get a joueur by ID
router.get('/joueur/:id', joueurController.getJoueurById);

// Get all joueurs
router.get('/joueurs', joueurController.getAllJoueurs);

// Filter joueurs
router.get('/joueurs/filter', joueurController.filterJoueurs);


router.put('/joueurs/password', protect, joueurController.updatePassword);


router.delete('/joueur/:id', joueurController.deleteJoueur);


//rejoindre une equipe
router.post('/joueur/rejoindre/:equipeId', protect, joueurController.rejoindreEquipe);
//quitter equipe
router.post('/joueur/quitter/:equipeId', protect, joueurController.quitterEquipe);

// demander creno
router.post('/joueur/demandercreno/:creneauId', protect, joueurController.demanderCreneau);



// ---------------------admin---------------------------------------------
router.post('/loginadmin', adminController.loginAdmin)
router.post('/admin', adminController.createAdmin)
router.get('/admin/myinformation', protect, isAdmin, adminController.getMyInformation)

// Update an admin (with token verification)
router.put('/admin', protect, adminController.updateAdmin);

// Get an admin by ID
router.get('/admin/:id', adminController.getAdminById);

// Get all admins
router.get('/admins', adminController.getAllAdmins);

// Filter admins
router.get('/admins/filter', adminController.filterAdmins);

// Update admin password
router.put('/admins/password', protect, adminController.updatePassword);

router.delete('/admin/:id', adminController.deleteAdmin);


router.post('/admin/accepter/:creneauId/:joueurId', protect, adminController.accepterDemande);


// ---------------------Terrain---------------------------------------------

router.post('/terrain', protect, isAdmin, terrainController.addTerrain);
router.put('/terrain/:id', protect, terrainController.updateTerrain);
router.delete('/terrain/:id', protect, terrainController.deleteTerrain);
router.get('/terrain/:id', terrainController.findTerrainById);
router.get('/terrains', terrainController.findAllTerrains);

router.get('/terrains/filter', terrainController.filterTerrains);

// ---------------------Equipe---------------------------------------------
router.post('/equipe', protect, equipeController.createEquipe)
router.put('/equipe/:id', protect, equipeController.modifierEquipe)
router.delete('/equipe/:id', protect, equipeController.supprimerEquipe)
router.get('/equipe/:id', equipeController.findEquipeById)
router.get('/equipe', equipeController.findAllEquipes)
router.get('/equipes/filter', equipeController.filterEquipes);


router.post('/equipe/rejoindre/:equipeId/:tournoiId', protect, equipeController.rejoindreTournoi);

router.post('/equipe/quitter/:equipeId/:tournoiId', protect, equipeController.quitterTournoi);


// ---------------------Creno---------------------------------------------
// Route for adding a new creneau
router.post('/creneau/:idterrain', protect, creneauController.addCreneau);
// Route for updating a creneau
router.put('/creneau/:id', protect, creneauController.updateCreneau);
// Route for deleting a creneau
router.delete('/creneau/:id', protect, creneauController.deleteCreneau);
// Route for finding a creneau by ID
router.get('/creneau/:id', creneauController.findCreneauById);
// Route for finding all creneaus
router.get('/creneaus', creneauController.findAllCreneaus);

router.get('/creneaus/filter', creneauController.filterCreneaus);
// -------------------------tournoi---------------------------------
router.post('/tournoi', protect, tournoiController.addTournoi);
router.put('/tournoi/:id', protect, tournoiController.updateTournoi);
router.delete('/tournoi/:id', protect, tournoiController.deleteTournoi);
router.get('/tournoi/:id', tournoiController.findTournoiById);
router.get('/tournois', tournoiController.findAllTournois);
router.get('/tournois/filter', tournoiController.filterTournois);


//----------------------annonce----------------------------
router.post('/annonce', protect, annonceController.addAnnonce);
router.put('/annonce/:id', protect, annonceController.updateAnnonce);
// Delete Annonce by ID
router.delete('/annonce/:id', protect, annonceController.deleteAnnonce);

router.get('/annonces/user', protect, annonceController.getAnnoncesByUserId);

// Get Annonce by ID
router.get('/annonce/:id', annonceController.getAnnonceById);


// Get all Annonces
router.get('/annonce', annonceController.getAllAnnonces);

// Filter Annonces
router.get('/annonces/filter', annonceController.filterAnnonces);








module.exports = router;
