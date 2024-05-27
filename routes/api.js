const express = require('express');
const joueurController = require('../controllers/joueurController');
const adminController = require('../controllers/adminController');
const terrainController = require('../controllers/terrainController')
const equipeController = require('../controllers/equipeController.js')
const reservationController = require('../controllers/reservationController')
const tournoiController = require('../controllers/tournoiController')
const annonceController = require('../controllers/annonceController')
const tokenController = require('../controllers/tokenController')
const pushNottificationController = require('../controllers/pushNottificationController')
const fcmTokenController = require('../controllers/fcmTokenController')

const { protect, isAdmin } = require('../handler/auth');

const router = express.Router();
router.get('/', async (req, res) => {
    res.json({ message: 'hello' })

})

// ---------------------User---------------------------------------------



// router.get('/joueur', joueurController.loginJoueur)
router.get('/joueur/information', protect, joueurController.getMyInformation)
router.post('/joueur/login', joueurController.loginJoueur)
router.post('/joueur', joueurController.createJoueur)
router.put('/joueur', protect, joueurController.updateJoueur);
router.get('/joueur/:id', joueurController.getJoueurById);
router.get('/joueur/username/:username', joueurController.getJoueurByUsername);
router.get('/joueurs', joueurController.getAllJoueurs);
// router.get('/joueurs/filter', joueurController.filterJoueurs);
router.put('/joueurs/password', protect, joueurController.updatePassword);
router.delete('/joueur/:id', joueurController.deleteJoueur);
//--equipe joueur ydemandi 
router.post('/joueur/rejoindre/:equipeId', protect, joueurController.demendeRejoindreEquipe);
router.post('/joueur/annuler/:equipeId', protect, joueurController.annulerDemandeEquipe);
//--- capitaine yaccepti yanuli damande te3 joueur
router.post('/joueur/capitaine/accept/:equipeId/:joueurId', protect, joueurController.capitaineAcceptJoueur);
router.post('/joueur/capitaine/refuser/:equipeId/:joueurId', protect, joueurController.capitainerefuserjoueur);
//-- capitaine yinviti joueur w ynehi invitation 
router.post('/joueur/capitaine/demande/:equipeId/:joueurId', protect, joueurController.capitainedemandeJoueur);
router.post('/joueur/capitaine/annuler/:equipeId/:joueurId', protect, joueurController.capitaineannulerJoueur);
//---ki yb3tuli naccepti wla refuser 
router.post('/joueur/accepter/:equipeId', protect, joueurController.accepterRejoindreEquipe);
router.post('/joueur/refuser/:equipeId', protect, joueurController.refuserRejoindreEquipe);
//--- ki nquiti equipe wla capitaine ynhi joueur 
router.post('/joueur/supprimer/:equipeId/:joueurId', protect, joueurController.supprimerRejoindreEquipe);

router.get('/joueur/search', joueurController.searchJoueursByUsername)
router.get('/joueur/demandes', protect, joueurController.getAllMyDemandes)

router.post('/joueur/recoverpassword', joueurController.recoverPassword);
router.post('/joueurs/verifytoken', joueurController.verifyToken);
router.post('/joueur/resetpassword', joueurController.resetPassword);

// ---------------------admin---------------------------------------------


router.post('/admin/login', adminController.loginAdmin)
router.post('/admin', adminController.createAdmin)
router.get('/admin/information', protect, isAdmin, adminController.getMyInformation)
router.put('/admin', protect, adminController.updateAdmin);
router.get('/admin/:id', adminController.getAdminById);
// router.get('/admins', adminController.getAllAdmins);
// router.get('/admins/filter', adminController.filterAdmins);
router.put('/admins/password', protect, adminController.updatePassword);
router.delete('/admin/:id', adminController.deleteAdmin);
// router.post('/admin/accepter/:reservationId', protect, adminController.accepterReservation);
// router.post('/admin/refuser/:reservationId', protect, adminController.refuserReservation);
// router.post('/admin/payereservation/:reservationId', protect, adminController.payReservation);
// router.post('/admin/nonpayereservation/:reservationId', protect, adminController.nonpayReservation);

router.post('/admin/recoverpassword', adminController.recoverPassword);
router.post('/admins/verifytoken', adminController.verifyToken);
router.post('/admin/resetpassword', adminController.resetPassword);

// ---------------------Terrain---------------------------------------------

router.post('/terrain', protect, isAdmin, terrainController.addTerrain);
router.put('/terrain/:id', protect, terrainController.updateTerrain);
router.delete('/terrain/:id', protect, terrainController.deleteTerrain);
router.post('/terrain/:id/photo', protect, terrainController.removePhoto);
router.get('/terrain/:id', terrainController.findTerrainById);
router.get('/terrains', terrainController.findAllTerrains);
router.get('/terrains/my', protect, terrainController.findMyTerrains);
router.get('/terrains/filter', terrainController.filterTerrains);
router.get('/search/terrain', protect, terrainController.searchTerrains);
router.get('/search/myterrain', protect, terrainController.searchMyTerrains);



// ---------------------Equipe---------------------------------------------
router.post('/equipe', protect, equipeController.createEquipe)
router.post('/equipe/vertial', protect, equipeController.createEquipeCopyVertial)
router.put('/equipe/:id', protect, equipeController.modifierEquipe)
router.delete('/equipe/:id', protect, equipeController.supprimerEquipe)
router.get('/equipe/:id', equipeController.findEquipeById)
router.get('/equipe', equipeController.findAllEquipes)
router.get('/equipe/my', protect, equipeController.searchMyEquipes)
router.get('/equipe/search', protect, equipeController.searchEquipes)

router.get('/equipe/imin', protect, equipeController.getEquipesImIn)
router.get('/equipes/invite', protect, equipeController.getEquipesInvitedMe)
// router.get('/equipes/demande', protect, equipeController.getEquipesDemandedMe)
router.get('/equipes/filter', equipeController.filterEquipes);
router.post('/equipe/rejoindre/:equipeId/:tournoiId', protect, equipeController.rejoindreTournoi);
router.post('/equipe/quitter/:equipeId/:tournoiId', protect, equipeController.quitterTournoi);


// ---------------------Reservation---------------------------------------------

router.get('/reservation/my', protect, reservationController.getMyReservationJoueur);
router.put('/reservation/connected/equipe', protect, reservationController.connectReservationsWithEquipe);
router.post('/reservation/:idterrain', protect, reservationController.addReservation);
router.post('/reservation/set/admin/:id', protect, isAdmin, reservationController.setReserveWithAdmin);
router.post('/reservation/admin/:idterrain', protect, isAdmin, reservationController.adminAddReservation);
router.put('/reservation/:id', protect, reservationController.updateReservation);
router.delete('/reservation/:id', protect, reservationController.deleteReservation);
router.delete('/Reservation/groupe/:groupId', protect, reservationController.deleteReservationGroup);
router.get('/reservation/:id', reservationController.findReservationById);
// router.get('/myreservations/', protect, reservationController.getMyReservationJoueur); 
router.get('/reservations/with/other/:idterrain/:jour', protect, reservationController.getReservationsWithConditions);
router.get('/reservations', reservationController.findAllReservations);

router.get('/reservations/filter', reservationController.filterReservations);
router.get('/reservations/pagination/filter', protect, isAdmin, reservationController.filterReservationsPagination);

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
router.get('/annonces/my/joueur', protect, annonceController.getMyAnnoncesJoueur);
router.get('/annonces/my/admin', protect, annonceController.getMyAnnoncesAdmin);
router.get('/annonce/:id', annonceController.getAnnonceById);
router.get('/annonce', annonceController.getAllAnnonces);
router.get('/annonces/filter', annonceController.filterAnnonces);

// -------------------------notification---------------------------------
router.post('/notification/admin/:id', pushNottificationController.sendNotificationToAdmin);
router.post('/notification/joueur/:id', pushNottificationController.sendNotificationToJoueur);

//-------------------------fcmToken-------------------------------------
router.post('/addOrUpdateTokenJoueur', protect, fcmTokenController.addOrUpdateTokenJoueur)
router.post('/removeTokenFcmJoueur', protect, fcmTokenController.removeTokenFcmJoueur)
router.post('/addOrUpdateTokenAdmin', protect, isAdmin, fcmTokenController.addOrUpdateTokenAdmin)
router.post('/removeTokenFcmAdmin', protect, isAdmin, fcmTokenController.removeTokenFcmAdmin)


module.exports = router;
