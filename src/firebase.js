const firebase = require("firebase");
require("firebase/firestore");
let db = null

const init = () => {
    firebase.initializeApp({
        apiKey: "AIzaSyCS4kUztjh1FlbmCew8uHfgTPt2ZCakAL0",
        authDomain: "momoncafe-6c707.firebaseapp.com",
        databaseURL: "https://momoncafe-6c707.firebaseio.com",
        projectId: "momoncafe-6c707",
        storageBucket: "momoncafe-6c707.appspot.com",
        messagingSenderId: "969792484260",
        appId: "1:969792484260:web:d1a2edcabb6580c8330731",
        measurementId: "G-2EGQR3PBJG"
    });

    db = firebase.firestore();
}

init()
export default () => ({
    db: db
})