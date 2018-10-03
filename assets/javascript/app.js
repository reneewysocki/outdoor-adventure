var latitude = "";
//-96.7844135; 
var longitude = "";
//32.8448345;

var weatherAPIkey = "63ad6cfdee5ea624323fed889a2d525d";

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
   // Note: This example requires that you consent to location sharing when
      // prompted by your browser. If you see the error "The Geolocation service
      // failed.", it means you probably did not give permission for the browser to
      // locate you.
      var map, infoWindow;
      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat:  32.8448345, lng: -96.7844135},
          zoom: 6
        });
        infoWindow = new google.maps.InfoWindow;

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            infoWindow.open(map);
            map.setCenter(pos);
            console.log(position.coords.latitude);
            console.log(position.coords.longitude);
            //set up openweather api 
            var weatherqueryURL = "http://api.openweathermap.org/data/2.5/find?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude +"&cnt=1&appid=" + weatherAPIkey;
            $.ajax({
              url: weatherqueryURL,
              method: "GET"
            }).then(function(response) {
                console.log(response);
            });
          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }

      }

      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
      }




// $.ajax({
//   url: weatherqueryURL,
//   method: "GET"
// }).then(function(response) {
//     console.log("Weather: " + response);
// });
