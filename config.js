import * as firebase from 'firebase';
import firestore from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBAeqyC3ZTiql9_lX-FZwL9Qc2TS86Npbg",
    authDomain: "finder-user-16b56.firebaseapp.com",
    databaseURL: "https://finder-user-16b56.firebaseio.com",
    projectId: "finder-user-16b56",
    storageBucket: "finder-user-16b56.appspot.com",
    messagingSenderId: "129967742769",
    appId: "1:129967742769:web:a12bc7190d04850b3c5a10",
    measurementId: "G-2CWWXN8FPT"
};

firebase.initializeApp(firebaseConfig)
firebase.firestore()
export default firebase
