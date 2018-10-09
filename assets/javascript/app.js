// Global variables
var map, infoWindow, trails, places, geocoder;

var weatherAPIkey = "63ad6cfdee5ea624323fed889a2d525d";
var nationalParksAPIkey = "Myd9CKal7VJIrMYyOYXHKQHZkEKIXZfMT7wT5xds";
var googleAPIKey = "AIzaSyCGcE5jmaNXlSOnkF9hz6oYTFhQl3qPFaU";

//set up national parks api 
// var nationalParksQueryURL = "https://developer.nps.gov/api/v1/parks?stateCode=tx&api_key=" + nationalParksAPIkey;
// $.ajax({
//   url: nationalParksQueryURL,
//   method: "GET"
// })
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


  $("#results-page").hide();
  $("#front-page").show();
  

  // If user chooses geolocation 
  function initMap() {
    $("#results-page").show();
    $("#front-page").hide();

    map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: 32.8448345, lng: -96.7844135 },
      zoom: 11,
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
        currentLocationWeather (currentLatitude, currentLongitude);
        getTrailInfo (currentLatitude, currentLongitude);
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


  function createMarker(trailPosition, trailName, contentString) {
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


  //If user chooses to input location manually
  function manualLocation ( ) {
    var address = document.getElementById('address').value;
    console.log(address);

    if (address === "City, State" || address === null || address === undefined || address === "") {
      $('#modal').modal('show');
    } else {
      $("#results-page").show();
      $("#front-page").hide();
      map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 32.8448345, lng: -96.7844135 },
        zoom: 11,
      });
      infoWindow = new google.maps.InfoWindow;
  
      var geolocationURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=" + googleAPIKey; 
      $.ajax({
        url: geolocationURL,
        method: "GET",
      }).then(function (response) {
        console.log(response);
        var currentLatitude = response.results[0].geometry.location.lat
        var currentLongitude = response.results[0].geometry.location.lng
        var currentLocationName = response.results[0].address_components[0].long_name
        console.log(currentLatitude);
        console.log(currentLongitude);
        var pos = {
          lat: currentLatitude,
          lng: currentLongitude
        };
        infoWindow.setPosition(pos);
        infoWindow.setContent(currentLocationName);
        infoWindow.open(map);
        map.setCenter(pos);
        currentLocationWeather (currentLatitude, currentLongitude);
        getTrailInfo (currentLatitude, currentLongitude);
      });
    }
  };




  function trailWeather(trailName, trailRating, trailDifficulty, trailLength, trailThumb, trailPositionLat, trailPositionLon, trailURL, trailRatingPercent) {
    //gets weather for trails
    var weatherqueryURL = "http://api.openweathermap.org/data/2.5/find?lat=" + trailPositionLat + "&lon=" + trailPositionLon + "&cnt=1&appid=" + weatherAPIkey;
    
    $.ajax({
      url: weatherqueryURL,
      method: "GET"
    }).then(function (response) {
          var trailTempKelvin = response.list[0].main.temp;
          var trailTempFahr = Math.floor(((trailTempKelvin - 273.15) * 1.8) + 32)
          var trailWeatherDis = response.list[0].weather[0].description;
          var trailWeatherIcon = response.list[0].weather[0].icon;
          var trailWeatherIconURL = "http://openweathermap.org/img/w/" + trailWeatherIcon + ".png";
          var trailWeather = "<img src='" + trailWeatherIconURL + "'>" 
          + "<div>" + trailTempFahr + "°</div>" 
          + "<div class='trail-weather'>" + trailWeatherDis + " </div>";

          //$(".stars-fill").css( "width", trailRatingPercent + "%");

        if (trailThumb === "") {
          var resultsString =
          "<div class='row trailResultsList'>" +
          "<div class='col'>" +
          "<a target='_blank' href='" + trailURL + "'>" + "<i class='fas fa-bicycle'></i>" +
          "<h5><b>" + trailName + "</b></h5></a>" +
          "Rating: " + trailRating + "<br>" +
          trailDifficulty + "<br>" +
          "Length: " + trailLength + "</p>" +
          "</div>" +
          "<div class='col-4 justify-content-center'>" + trailWeather + 
        "</div>"
        "</div>"
        } else {
          var resultsString =
          "<div class='row trailResultsList'>" +
          "<div class='col-3'>" +
          "<img class='trailImage' src='" + trailThumb + "'>" +
          "</div>" +
          "<div class='col'>" +
          "<a target='_blank' href='" + trailURL + "'>" + "<i class='fas fa-bicycle'></i>" +
          "<h5><b>" + trailName + "</b></h5></a>" +
          // "Rating: " + trailRating + "<br>" +
          "<div class='stars-empty'>" + 
          "<div class='stars-fill' style='width:" + trailRatingPercent + "'> </div>" + 
          "</div>" + 
          "<p>" + trailDifficulty + "<br>" +
          "Length: " + trailLength + "</p>" +
          "</div>" +
          "<div class='col-4 justify-content-center'>" + trailWeather + 
        "</div>"
        "</div>"
        }

        
        //pushes trail information to results panel   
        $("#trails").append(resultsString);
      }
    
    )};

    function currentLocationWeather (currentLatitude, currentLongitude) {
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
          $("#location").append("<b>" + currentLocationName + "</b>");
          $("#weather").append("<img id='current-weather-icon' src='" + currentWeatherIconURL + "'>");
          $("#weather").append("<div>" + currentWeatherDis + " </div>");
          $("#weather").append("<div>Temperature: " + currentLocationTempFahr + "°</div>");
          
        });
    }

    function getTrailInfo (currentLatitude, currentLongitude) {
      var trailsqueryURL = 'https://trailapi-trailapi.p.mashape.com/trails/explore/' + '?lat=' + currentLatitude + '%2C&lon=' + currentLongitude + '&per_page=100';

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
          var trailPosition = { lat: trailPositionLat, lng: trailPositionLon };
          var trailRating = response.data[i].rating;
          var trailLength = response.data[i].length;
          var trailDifficulty = response.data[i].difficulty;
          var trailThumb = response.data[i].thumbnail;
          var trailURL = response.data[i].url;
          var trailRatingPercent = ((trailRating/5) * 100) + "%";
          var markerString = '<div id="content">' +
            '<div id="' + trailName + '">' +
            '</div>' +
            '<p id="firstHeading" class="firstHeading">' + trailName + '</p>' +
            '<div id="bodyContent">' +
            '<p> Rating: ' + trailRating + '</p>' +
            '<p> Difficulty: ' + trailDifficulty + '</p>' +
            '<p> Length: ' + trailLength + '</p>' +
            '<p Description: ' + trailDescription + '</p>' +
            '<p><a target="_blank" href="' + trailURL + '">Click Here for More Information</a> ' +
            '</p>' +
            '</div>' +
            '</div>';
          createMarker(trailPosition, trailName, markerString);
          trailWeather(trailName, trailRating, trailDifficulty, trailLength, trailThumb, trailPositionLat, trailPositionLon, trailURL, trailRatingPercent);
        }
      });
    }

function refresh () {
  $("#results-page").hide();
  $("#front-page").show();
  currentLatitude = ""
  currentLongitude = ""
  $("#trails").empty();
  $("#location").empty();
  $("#weather").empty();
}
