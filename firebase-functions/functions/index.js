const functions = require('firebase-functions');
const gcs = require('@google-cloud/storage')();
const sharp = require('sharp')
const _ = require('lodash');
const path = require('path');
const os = require('os');
const admin = require('firebase-admin');
admin.initializeApp();
const firestore = admin.firestore();

exports.generateThumbnail = functions.storage.object().onFinalize(event => {
    console.log(event);
    const object = event; // The Storage object.

    console.log(object)

    const fileBucket = object.bucket; // The Storage bucket that contains the file.
    const filePath = object.name; // File path in the bucket.
    const contentType = object.contentType; // File content type.
    const resourceState = object.resourceState; // The resourceState is 'exists' or 'not_exists' (for file/folder deletions).
    const metageneration = object.metageneration; // Number of times metadata has been generated. New objects have a value of 1.

    const SIZES = [64, 256, 512]; // Resize target width in pixels

    if (!contentType.startsWith('image/') || resourceState == 'not_exists') {
        console.log('This is not an image.');
        return;
    }

    if (_.includes(filePath, '_thumb')) {
        console.log('already processed image');
        return;
    }


    const fileName = filePath.split('/').pop();
    const bucket = gcs.bucket(fileBucket);
    const tempFilePath = path.join(os.tmpdir(), fileName);

    return bucket.file(filePath).download({
        destination: tempFilePath
    }).then(() => {

        _.each(SIZES, (size) => {
            console.log("Generando: ", size);
            let newFileName = `${fileName}_${size}_thumb.png`
            let newFileTemp = path.join(os.tmpdir(), newFileName);
            let newFilePath = `thumbs/${newFileName}`

            sharp(tempFilePath)
                    .resize(size, null)
                    .toFile(newFileTemp, (err, info) => {

                        bucket.upload(newFileTemp, {
                            destination: newFilePath
                        });

                    });

        })
    })
})
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
exports.sendFollowerNotification = functions.firestore.document('/salidas/{salidaId}')
        .onWrite((salida, context) => {
            if (salida.after) {
                const data = salida.after.data();
                const userData = firestore.doc(`/users/${data.user}`);
                return userData.get().then(doc => {
                    const user = doc.data();
                    const matData = firestore.doc(`/material/${data.material}`);
                    return matData.get().then(doc => {
                        const material = doc.data();
                        const payload = {
                            notification: {
                                title: 'Cambios en material',
                            }
                        };
                        const action = data.fechaEntrada ? "devuelto" : "sacado";
                        payload.notification.body = `${user.displayName} ha ${action} el material: ${material.nombre}. Comentarios: ${data.comentarios}`;
                        return firestore.collection('/users').get().then(querySnapshot => {
                            const tokens = []
                            querySnapshot.forEach(documentSnapshot => {
                                let dataDoc = documentSnapshot.data();
                                if(dataDoc.token){
                                tokens.push(documentSnapshot.data().token)
                                }
                            });
                            return admin.messaging().sendToDevice(tokens, payload);
                        });
//                        return null
                    })
                });
            } else {
                return null
            }
        })