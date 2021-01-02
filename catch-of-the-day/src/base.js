import Rebase from 're-base';
import firebase from 'firebase'

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyD6ycFqbdF0yl_YOuIgfcYQUGebDiMzCds",
    authDomain: "catch-of-the-day-harry-m.firebaseapp.com",
    databaseURL: "https://catch-of-the-day-harry-m-default-rtdb.firebaseio.com"
})

const base = Rebase.createClass(firebaseApp.database())


//Named export
export { firebaseApp }

export default base;