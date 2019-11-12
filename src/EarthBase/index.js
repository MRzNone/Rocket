/**
 * All interaction with firebase happens here.
 * All components are exported
 */

import * as firebase from "firebase";

const db = firebase.initializeApp({
    apiKey: "AIzaSyBj8CmEsvlDHyjbd74-kNfrAVeXDc3ZjfQ",
    authDomain: "cse110project-8d6be.firebaseapp.com",
    databaseURL: "https://cse110project-8d6be.firebaseio.com",
    projectId: "cse110project-8d6be",
    storageBucket: "cse110project-8d6be.appspot.com",
    messagingSenderId: "24482060507",
    appId: "1:24482060507:web:ab018bc0415a3250a854fe",
    measurementId: "G-Q7P86Y5NGR"

});

export default db;
