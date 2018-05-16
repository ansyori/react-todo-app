import * as firebase from 'firebase';
const firebaseConfig = {  
  apiKey: "AIzaSyDj0Q1Jxcg-tYMb6QZ7XR81TE5-BVmqr4s",
    authDomain: "ansyori.firebaseapp.com",
    databaseURL: "https://ansyori.firebaseio.com",
    projectId: "ansyori",
    storageBucket: "ansyori.appspot.com",
    messagingSenderId: "26782727826"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

export default firebaseApp;