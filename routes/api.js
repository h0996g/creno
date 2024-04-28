const express = require('express');
const joueurController = require('../controllers/joueurController');
const adminController = require('../controllers/adminController');
const terrainController = require('../controllers/terrainController')
const equipeController = require('../controllers/equipeController')
const reservationController = require('../controllers/reservationController')
const tournoiController = require('../controllers/tournoiController')
const annonceController = require('../controllers/annonceController')
const tokenController = require('../controllers/tokenController')
const pushNottificationController = require('../controllers/pushNottificationController')

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
router.put('/joueur', protect, joueurController.updateJoueur);
router.get('/joueur/:id', joueurController.getJoueurById);
router.get('/joueur/username/:username', joueurController.getJoueurByUsername);
router.get('/joueurs', joueurController.getAllJoueurs);
router.get('/joueurs/filter', joueurController.filterJoueurs);
router.put('/joueurs/password', protect, joueurController.updatePassword);
router.delete('/joueur/:id', joueurController.deleteJoueur);
router.post('/joueur/rejoindre/:equipeId', protect, joueurController.demendeRejoindreEquipe);
router.post('/joueur/annuler/:equipeId', protect, joueurController.annulerDemandeEquipe);
router.post('/joueur/accepter/:equipeId/:joueurId', protect, joueurController.accepterRejoindreEquipe);
router.post('/joueur/supprimer/:equipeId/:joueurId', protect, joueurController.supprimerRejoindreEquipe);
router.post('/joueur/recoverpassword', joueurController.recoverPassword);
router.post('/joueurs/verifytoken', joueurController.verifyToken);
router.post('/joueur/resetpassword', joueurController.resetPassword);

// ---------------------admin---------------------------------------------

router.post('/loginadmin', adminController.loginAdmin)
router.post('/admin', adminController.createAdmin)
router.get('/admin/myinformation', protect, isAdmin, adminController.getMyInformation)
router.put('/admin', protect, adminController.updateAdmin);
router.get('/admin/:id', adminController.getAdminById);
router.get('/admins', adminController.getAllAdmins);
router.get('/admins/filter', adminController.filterAdmins);
router.put('/admins/password', protect, adminController.updatePassword);
router.delete('/admin/:id', adminController.deleteAdmin);
router.post('/admin/accepter/:reservationId', protect, adminController.accepterReservation);
router.post('/admin/refuser/:reservationId', protect, adminController.refuserReservation);
router.post('/admin/payereservation/:reservationId', protect, adminController.payReservation);
router.post('/admin/nonpayereservation/:reservationId', protect, adminController.nonpayReservation);
router.post('/admin/recoverpassword', adminController.recoverPassword);
router.post('/admins/verifytoken', adminController.verifyToken);
router.post('/admin/resetpassword', adminController.resetPassword);

// ---------------------Terrain---------------------------------------------

router.post('/terrain', protect, isAdmin, terrainController.addTerrain);
router.put('/terrain/:id', protect, terrainController.updateTerrain);
router.delete('/terrain/:id', protect, terrainController.deleteTerrain);
router.get('/terrain/:id', terrainController.findTerrainById);
router.get('/terrains', terrainController.findAllTerrains);
router.get('/myterrains/', protect, terrainController.findMyTerrains);
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


// ---------------------Reservation---------------------------------------------

router.post('/reservation/:idterrain', protect, reservationController.addReservation);
router.post('/reservationadmin/:idterrain', protect, isAdmin, reservationController.adminAddReservation);
router.put('/reservation/:id', protect, reservationController.updateReservation);
router.delete('/reservation/:id', protect, reservationController.deleteReservation);
router.get('/reservation/:id', reservationController.findReservationById);
router.get('/myreservations/', protect, reservationController.getMyReservationJoueur);
router.get('/myreservationswithother/:idterrain/:jour', protect, reservationController.getReservationsWithConditions);
router.get('/reservations', reservationController.findAllReservations);

router.get('/reservations/filter', reservationController.filterReservations);
router.get('/reservationspagination/filter', reservationController.filterReservationsPagination);

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
router.delete('/annonce/:id', protect, annonceController.deleteAnnonce);
router.get('/myannonces/joueur', protect, annonceController.getMyAnnoncesJoueur);
router.get('/myannonces/admin', protect, annonceController.getMyAnnoncesAdmin);
router.get('/annonce/:id', annonceController.getAnnonceById);
router.get('/annonce', annonceController.getAllAnnonces);
router.get('/annonces/filter', annonceController.filterAnnonces);

// -------------------------notification---------------------------------
router.post('/notification', pushNottificationController.sendNotification);

module.exports = router;
