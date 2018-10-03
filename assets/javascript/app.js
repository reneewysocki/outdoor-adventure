// Global variables
var trails; // a variable to hold trails
var places; // a variable to hold places


//set up google maps api 

//set up openweather api 
var weatherAPIkey = "63ad6cfdee5ea624323fed889a2d525d";
var currentLocation = "Dallas,Texas";
var weatherqueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + currentLocation + "&units=imperial&appid=" + weatherAPIkey;


$.ajax({
  url: weatherqueryURL,
  method: "GET"
}).then(function(response) {
    console.log(response);
});

// set up trails api
var trailsqueryURL = 'https://trailapi-trailapi.p.mashape.com/trails/explore/' + '?lat=37.28225%2C&lon=-107.877762&per_page=10&radius=25';
     
      $.ajax({
        url: trailsqueryURL,
        method: "GET",
        headers: {
          "X-Mashape-Key" :"dZJGfLx5hNmshNppywXnsDamxgDPp1RzSf2jsnYe48JNSRCtXc",
          "Accept": "application/json"
        
      } 
      }).then(function(response) {
          console.log(response);
      });

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
