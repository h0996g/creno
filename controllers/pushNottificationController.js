var admin = require("firebase-admin");
var fcm = require("fcm-notification");
var serviceAccount = require("../push-notification-key.json");
const certPath = admin.credential.cert(serviceAccount);
var FCM = new fcm(certPath);
exports.sendNotification = async (req, res, next) => {
    try {
        let message = {
            notification: {
                title: "equipe",
                body: "hi houssem"
            },
            data: {
                key1: "value1",
                key2: "value2"

            },
            token: req.body.fcm_token
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