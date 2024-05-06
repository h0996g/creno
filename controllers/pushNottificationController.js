var admin = require("firebase-admin");
var fcm = require("fcm-notification");
const FcmToken = require('../models/fcm_token');

var serviceAccount = require("../push-notification-key.json");
const certPath = admin.credential.cert(serviceAccount);
var FCM = new fcm(certPath);
exports.sendNotificationToAdmin = async (req, res, next) => {
    try {
        const id = req.params.id;
        const tokenFcm = await FcmToken.findOne({ admin_id: id });
        const title = req.body.title;
        const body = req.body.body;

        const data = { key1: "value1", key2: "value2" };
        let message = {
            notification: { title: title, body: body },
            data: data,
            token: tokenFcm.token
        };
        FCM.send(message, function (err, response) {
            if (err) {
                console.log("Something has gone wrong!");
                res.status(500).json({
                    message: "Something has gone wrong!"
                });
            } else {
                console.log("Successfully sent with response: ", response);
                res.status(200).json({
                    message: "Successfully sent with response: " + response
                });
            }
        });
    } catch (error) {
        console.log(error);
    }
};


// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
// });