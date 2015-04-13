angular.module('nomNow.services', [])


.factory('Map', function ($http, $q) {
  var latLong;
  var restaurants;
  var map;
  var mapOptions = {
    zoom: 15,
    center: {}
  };
  var locations={};

  var createMarker = function(map, coords, name) {
      return new google.maps.Marker({
        position: coords,
        map: map,
        title: name
      })
  }
  var createMap = function () {
      var that=this;
  var promise = this.getPosition();
    return promise.then(function (latLong) {
      latLong = new google.maps.LatLng(latLong.coords.latitude, latLong.coords.longitude)
      mapOptions.center = latLong;
         map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
      that.createMarker(map, latLong, "You are here")
      });
  }



  var getPosition = function () {
    var deferred = $q.defer();
    navigator.geolocation.getCurrentPosition(function(position){
      deferred.resolve(position)
    });
    return deferred.promise;
  }

  var findWaitTimes = function($scope) {
    this.fetchWaitTimes($scope);
  }

  var fetchWaitTimes = function($scope) {
    return $http({
      method: 'GET',
      url: '/wait'
    })
    .then (function (resp) {
      console.log('inside', resp.data)
      restaurants = resp.data;
      for (var i = 0; i<resp.data.length; i++) {
        getRestaurantLocation(resp.data[i].google_id);
      }
      return resp.data;
    })
  }

  var getRestaurantLocation = function(id,cb) {
    var request = {placeId : id};
    var service = new google.maps.places.PlacesService(map);
    service.getDetails(request, function (place, status) {
      /// edited for callback
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        var coords = new google.maps.LatLng(place.geometry.location.k, place.geometry.location.D)
        var name = place.name
        if(cb){
          cb(coords,place.name);
        }else{
        createMarker(map, coords, name);
        locations[id]=[coords,place.name]
        }
      }
    })
  }
////////////  Modal needed function to pass on restraunt data

  var getClosestRestaurant = function (cb){

    var mylat = null;
    var mylong = null;
    var currentLowest = null;
    var currentRestraunt = null;
    var currentid=null
    getPosition().then(function(value){
      mylat = value.coords.latitude
      mylong = value.coords.longitude
      
      for(var key in locations){
          coords = locations[key][0]
          place = locations[key][1]
            getDistanceFromLatLonInKm(mylat, mylong, coords["k"], coords["D"],
            function(dis){
              if(currentLowest===null||currentLowest<dis){
                currentLowest = dis;
                currentRestraunt = place;
                currentid = key;
              }
        })
      } 
    })
        setTimeout(function(){
        var closest = {name:currentRestraunt , google_id:currentid}
        cb(closest);
        }, 1000)
  }

  ////////////helper functions
  var deg2rad =function (deg) {
    return deg * (Math.PI/180)
  }

  function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2, cb) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
    cb(d);
  }


///////////////////////////////////////////////////
  return {
    createMap: createMap,
    createMarker: createMarker,
    getPosition: getPosition,
    findWaitTimes: findWaitTimes,
    fetchWaitTimes: fetchWaitTimes,
    getRestaurantLocation: getRestaurantLocation,
    getClosestRestaurant:getClosestRestaurant
  }
})