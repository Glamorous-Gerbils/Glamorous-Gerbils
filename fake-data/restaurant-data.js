// goal is to get restaurants using nearby search from google places api to get data for them
// first need a google map for that

var mksCoords = new google.maps.LatLng(30.269989, -97.742670);

var mapOptions = {
  center: mksCoords,
  zoom: 8
};

var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

// then a nearby search is performed to get most of the data from the restaurants closest to MKS
var twentyClosestToMKS;

var request = {
  location: mksCoords,
  types: ['restaurant'],
  rankBy: google.maps.places.RankBy.DISTANCE
};

var service = new google.maps.places.PlacesService(map);
service.nearbySearch(request, function (results, status) {

  if ( status !== google.maps.places.PlacesServiceStatus.OK ) console.log(status);

  var restaurants = [];

  var iterateResults = function (i) {
    // need to stagger calls to the API
    setTimeout(function () {
      var location = results[i].geometry.location;
      var placeid = results[i].place_id;
      var placename = results[i].name;

      // use the places library function getDetails to obtain website info
      // this function contains a lot of other info like reviews or contact info
      // that might be useful later
      service.getDetails({placeId: placeid}, function (placeResults, status) {
        if ( status !== google.maps.places.PlacesServiceStatus.OK ) console.log(status);
        var website = placeResults ? placeResults.website : "";
        restaurants.push([location.lat(), location.lng(), placeid, placename, website]);
      });

      i++;

      if ( i < 20 ) {
        iterateResults(i);
      } else {
        // NOTE TO SELF: might need to use q.defer here because this runs before iterateResults is complete
        twentyClosestToMKS = restaurants;
        console.log(twentyClosestToMKS);
      }

    }, 1000);
  };

  iterateResults(0);

});
