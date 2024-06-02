var admin = require("firebase-admin");
var fcm = require("fcm-notification");
const FcmToken = require('../models/fcm_token');

var serviceAccount = require("../push-notification-key.json");
const certPath = admin.credential.cert(serviceAccount);
var FCM = new fcm(certPath);
exports.sendNotificationToAdmin = async (req, res, next) => {
    try {
        const adminId = req.params.id;
        const { title, body } = req.body;
        const data = { key1: "value1", key2: "value2" };

        // Find all FCM tokens associated with the admin ID
        const fcmTokens = await FcmToken.find({ admin_id: adminId });

        // Create a list of promises to send notifications to each device
        const sendNotificationPromises = fcmTokens.map(token => {
            const message = {
                notification: { title, body },
                data,
                token: token.token,
            };

            return new Promise((resolve, reject) => {
                FCM.send(message, (err, response) => {
                    if (err) {
                        console.error("Error sending notification:", err);
                        reject(err);
                    } else {
                        console.log("Successfully sent notification:", response);
                        resolve(response);
                    }
                });
            });
        });

        // Wait for all notifications to be sent
        const responses = await Promise.all(sendNotificationPromises);

        res.status(200).json({
            message: "Notifications sent successfully",
            responses
        });
    } catch (error) {
        console.error("Error in sendNotificationToAdmin:", error);
        next(error);
    }
};

exports.sendNotificationToJoueur = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const { title, body } = req.body;

        const data = { screen: "test" };

        // Find all FCM tokens associated with the user ID
        const fcmTokens = await FcmToken.find({ joueur_id: userId });
        console.log(fcmTokens.length);
        // Create a list of promises to send notifications to each device
        const sendNotificationPromises = fcmTokens.map(token => {
            const message = {
                notification: { title, body },
                data,
                token: token.token,

            };

            return new Promise((resolve, reject) => {
                FCM.send(message, (err, response) => {
                    if (err) {
                        console.error("Error sending notification:", err);
                        reject(err);
                    } else {
                        console.log("Successfully sent notification:", response);
                        resolve(response);
                    }
                });
            });
        });

        // Wait for all notifications to be sent
        const responses = await Promise.all(sendNotificationPromises);

        res.status(200).json({
            message: "Notifications sent successfully",
            responses
        });
    } catch (error) {
        console.error("Error in sendNotificationToJoueur:", error);
        next(error);
    }
};



// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
// });