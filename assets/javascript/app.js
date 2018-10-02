var longitute = -96.7844135; 
var lattitude = 32.8448345;

//set up openweather api 
var weatherAPIkey = "63ad6cfdee5ea624323fed889a2d525d";
//var currentLocation = "Dallas,Texas"
var weatherqueryURL = "http://api.openweathermap.org/data/2.5/find?lat=" + lattitude + "&lon=" + longitute +"&cnt=1&appid=" + weatherAPIkey;


$.ajax({
  url: weatherqueryURL,
  method: "GET"
}).then(function(response) {

    console.log(response);
});

//set up trails api 

//initialize firebase
var config = {
    apiKey: "AIzaSyCGcE5jmaNXlSOnkF9hz6oYTFhQl3qPFaU",
    authDomain: "outdoor-adventure-dc61e.firebaseapp.com",
    databaseURL: "https://outdoor-adventure-dc61e.firebaseio.com",
    projectId: "outdoor-adventure-dc61e",
    storageBucket: "",
    messagingSenderId: "1061119694550"
  };

  firebase.initializeApp(config);

  var database = firebase.database();

  //set up google maps api 
  function initMap() {
    var myLatLng = {lat: lattitude, lng: longitute};

    // Create a map object and specify the DOM element
    // for display.
    var map = new google.maps.Map(document.getElementById('map'), {
      center: myLatLng,
      zoom: 4
    });

    // Create a marker and set its position.
     var marker = new google.maps.Marker({
       map: map,
       position: myLatLng,
       title: 'Activities Are Here!'
     });
  }
 
