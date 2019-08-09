importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js');


firebase.initializeApp({
  apiKey: "AIzaSyDzm2IP5v6sAOjTe4_Dd7sIuQ32N8BpxAo",
    authDomain: "notifications-a6397.firebaseapp.com",
    databaseURL: "https://notifications-a6397.firebaseio.com",
    projectId: "notifications-a6397",
    storageBucket: "notifications-a6397.appspot.com",
    messagingSenderId: "110835973411",
});

const messaging = firebase.messaging();