// Global variables
var trails; // a variable to hold trails
var places; // a variable to hold places


var weatherAPIkey = "63ad6cfdee5ea624323fed889a2d525d";
 var nationalParksAPIkey = "Myd9CKal7VJIrMYyOYXHKQHZkEKIXZfMT7wT5xds";

$("#results").hide();

//set up national parks api 

// var nationalParksQueryURL = "https://developer.nps.gov/api/v1/parks?stateCode=tx&api_key=" + nationalParksAPIkey;

// // Here we run our AJAX call to the OpenWeatherMap API
// $.ajax({
//   url: nationalParksQueryURL,
//   method: "GET"
// })
//   // We store all of the retrieved data inside of an object called "response"
//   .then(function (response) {
//     console.log(response);
//   });

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
// Note: This example requires that you consent to location sharing when prompted by your browser. If you see the error "The Geolocation service failed.", it means you probably did not give permission for the browser to locate you.
var map, infoWindow;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 32.8448345, lng: -96.7844135 },
    zoom: 10
  });
  infoWindow = new google.maps.InfoWindow;

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      infoWindow.setPosition(pos);
      infoWindow.setContent('Current Location');
      infoWindow.open(map);
      map.setCenter(pos);
      console.log(position.coords.latitude);
      console.log(position.coords.longitude);
      var currentLatitude = position.coords.latitude;
      var currentLongitude = position.coords.longitude
      //set up openweather api based on maps location
      var weatherqueryURL = "http://api.openweathermap.org/data/2.5/find?lat=" + currentLatitude + "&lon=" + currentLongitude + "&cnt=1&appid=" + weatherAPIkey;
      $.ajax({
        url: weatherqueryURL,
        method: "GET"
      }).then(function (response) {
        console.log(response);
        // gets location name, temperature, weather icon and pushes it to html 
        var currentLocationName = response.list[0].name;
        var currentLocationTempKelvin = response.list[0].main.temp;
        console.log(currentLocationTempKelvin);
        var currentLocationTempFahr = Math.floor(((currentLocationTempKelvin - 273.15) * 1.8) + 32)
        console.log(currentLocationTempFahr);
        var currentWeatherDis = response.list[0].weather[0].description;
        var currentWeatherIcon = response.list[0].weather[0].icon;
        var currentWeatherIconURL = "http://openweathermap.org/img/w/" + currentWeatherIcon + ".png";
        $("#results").show()
        $("#location").append("<b>" + currentLocationName + "</b>");
        $("#weather").append("<img id='current-weather-icon' src='" + currentWeatherIconURL + "'>");
        $("#weather").append("<div>" + currentWeatherDis + " </div>");
        $("#weather").append("<div>Temperature: " + currentLocationTempFahr + "°</div>");
        // set up trails api
        var trailsqueryURL = 'https://trailapi-trailapi.p.mashape.com/trails/explore/' + '?lat=' + currentLatitude + '%2C&lon=' + currentLongitude + '&per_page=50';

        $.ajax({
          url: trailsqueryURL,
          method: "GET",
          headers: {
            "X-Mashape-Key": "dZJGfLx5hNmshNppywXnsDamxgDPp1RzSf2jsnYe48JNSRCtXc",
            "Accept": "application/json"

          }
        }).then(function (response) {
          console.log(response);
          //plots trail points on map 
          for (var i = 0; i < response.data.length; i++) {
            var trailName = response.data[i].name;
            var trailDescription = response.data[i].description;
            var trailPositionLat = parseFloat(response.data[i].lat);
            var trailPositionLon = parseFloat(response.data[i].lon);
            var trailRating = response.data[i].rating;
            var trailDifficulty = response.data[i].difficulty;
            var trailURL = response.data[i].url;
            //console.log(trailName, trailPositionLat, trailPositionLon)
            var trailPosition = { lat: trailPositionLat, lng: trailPositionLon };
            var contentString = '<div id="content">' +
              '<div id="' + trailName + '">' +
              '</div>' +
              '<p id="firstHeading" class="firstHeading">' + trailName + '</p>' +
              '<div id="bodyContent">' +
              '<p> Rating: ' + trailRating + '</p>' +
              '<p> Difficulty: ' + trailDifficulty + '</p>' +
              '<p Description: ' + trailDescription + '</p>' +
              '<p><a href="' + trailURL + '">Click Here for More Information</a> ' +
              '</p>' +
              '</div>' +
              '</div>';
              createMarker(trailPosition,trailName,contentString);
            //({
            //   content: contentString
            // });

            // var marker = new google.maps.Marker({
            //   position: trailPosition,
            //   map: map,
            //   title: trailName,
            // });
            // marker.addListener('click', function () {
            //   infowindow.open(map, marker);
            // });


          }
        });
      });
    }, function () {
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
};

function createMarker(trailPosition,trailName,contentString) {
  var marker = new google.maps.Marker({
    position: trailPosition,
    title: trailName,
    map: map
  });
  var infowindow = new google.maps.InfoWindow
  google.maps.event.addListener(marker, 'click', function () {
    infowindow.setContent(contentString);
    infowindow.open(map, marker);
  });

}
