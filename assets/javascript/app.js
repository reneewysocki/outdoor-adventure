//set up google maps api 

//set up openweather api 
var weatherAPIkey = "63ad6cfdee5ea624323fed889a2d525d";
var currentLocation = "Dallas,Texas"
var weatherqueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + currentLocation + "&units=imperial&appid=" + weatherAPIkey;


$.ajax({
  url: weatherqueryURL,
  method: "GET"
}).then(function(response) {
    console.log(response);
});

//set up trails api 

//initialize firebase
var config = {
    apiKey: "AIzaSyBORNjA5-m2BsCc9HESu5po2VRfx30lUx4",
    authDomain: "outdoor-adventure-dc61e.firebaseapp.com",
    databaseURL: "https://outdoor-adventure-dc61e.firebaseio.com",
    projectId: "outdoor-adventure-dc61e",
    storageBucket: "",
    messagingSenderId: "1061119694550"
  };

  firebase.initializeApp(config);

  var database = firebase.database();
