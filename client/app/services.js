angular.module('nomNow.services', [])


.factory('Map', function ($http, $q) {
  var latLong;
  var restaurants;
  var map;
  var mapOptions = {
    zoom: 15,
    center: {}
  };
  var privwindow = false;
  var mapscope;
  //Creates marker for user's location
  var createMarker = function(map, coords, name) {
      return new google.maps.Marker({
        position: coords,
        map: map,
        title: name
      });
  }
  //generates the map
  var createMap = function () {
    var that=this;
    var promise = this.getPosition();
    return promise.then(function (latLong) {
      latLong = new google.maps.LatLng(latLong.coords.latitude, latLong.coords.longitude);
      mapOptions.center = latLong;
      map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
      that.createMarker(map, latLong, "You are here");
      return map;
    });
  }

  //reposition map
  var centerMap = function(place){
    // var place = scope.gPlace.getPlace();
      if (place.geometry) {
        map.panTo(place.geometry.location);
        map.setZoom(15);
        // search();
      } else {
        // document.getElementById('autocomplete').placeholder = 'Not Found, Try Again';
      }
  }
  //Gets users current position
  var getPosition = function () {
    var deferred = $q.defer();
    navigator.geolocation.getCurrentPosition(function(position){
      deferred.resolve(position)
    });
    return deferred.promise;
  }

  var findWaitTimes = function($scope) {
    if($scope){mapscope = $scope;}
    else{$scope = mapscope};
    this.fetchWaitTimes($scope);
  }
  //pulls all the wait times from the reports database
  var fetchWaitTimes = function($scope) {
    return $http({
      method: 'GET',
      url: '/wait'
    })
    .then (function (resp) {
      restaurants = resp.data;
      for (var i = 0; i<resp.data.length; i++) {
        getRestaurantLocation(resp.data[i]);
      }
      return resp.data;
    });
  }
  //generates a marker with correct number and color for each waittime
  var getWaitTimeMarkerUrl = function (wait) {
    var hexColor = wait <= 20 ? '3FA71C' : wait <=40 ? 'E4fE09' : 'E21E1F';
    wait = wait < 60 ? wait : '60+';
    return 'http://www.googlemapsmarkers.com/v1/' + wait + '/' + hexColor + '/';
  }
  //calculates time between right now and the most recent wait time post
  var getElapsedTime = function(timestamp) {
    var now = new Date();
    var then = new Date(timestamp);
    return Math.round((now-then)/60000);
  }
  //takes in a google places restaurant, generates marker at that location
  var getRestaurantLocation = function(restaurant) {
    var wait = restaurant.avg_wait;
    var waitUrl = getWaitTimeMarkerUrl(wait);
    var shape = {
      coords : [1,1,21,1,10,34],
      type: 'poly'
    }
    var coords = new google.maps.LatLng(restaurant.latitude, restaurant.longitude);
    var name = restaurant.name;
      var image = {
        url : waitUrl,
        size: new google.maps.Size(21,34),
        origin: new google.maps.Point(0,0),
        anchor: new google.maps.Point(10,34)
      }
      var marker = new google.maps.Marker({
          position: coords,
          map: map,
          icon: image,
          shape: shape
      });
      var elapsed = getElapsedTime(restaurant.most_recent);
      displayInfo (marker, restaurant, wait, elapsed);
  }
////////////  Modal needed function to pass on restaurant data

  var getClosestRestaurant = function (cb,byname){
    // temp vars to find closest restaurant
    var mylat = null;
    var mylong = null;
    // var choices =[{dis:null, name:null, google_id:null, loc:null},
    //                 {dis:null, name:null, google_id:null, loc:null},
    //                 {dis:null, name:null, google_id:null, loc:null}]
    var choices = []
    getPosition().then(function(value){
      mylat = value.coords.latitude
      mylong = value.coords.longitude
      var myloc = new google.maps.LatLng(mylat, mylong)
      var request = {
          location: myloc,
          // radius: 500,
          rankBy: google.maps.places.RankBy.DISTANCE,
          types: ['restaurant','meal_takeaway']
        };
      // if(byname){
      //   var request = {
      //       location: myloc,
      //       radius: 100,
      //       name:byname
      //     };
      //   }
      // api request that gets closest places.
      var service = new google.maps.places.PlacesService(map);

      service.nearbySearch(request, function(value){
        //looping the result to find closet restaurant
          for(var x =0 ; x<value.length; x++){
            var coords = value[x]['geometry']['location'];
            var place = value[x]['name']
            var key = value[x]['place_id']
            var obj= {location:coords, 'name':place, 'google_id':key}
            getDistanceFromLatLonInKm(mylat, mylong, coords["k"], coords["D"],obj,
            //after calculating distance in helper below this function compares the lowest distance.
              function(dis, obj){
                choices.push(obj);
                console.log(choices)
                // if(choices[0]['dis']===null||choices[0]['dis']>dis){
                //   choices[2]= choices[1];
                //   choices[1]= choices[0];
                //   choices[0]= obj
                //   choices[0]['dis']= dis;
                // }
            })
          }
          //set time out lets us wait till data is processed
          setTimeout(function(){
            choices.length = 3
            var closest = choices
            cb(closest);
          }, 1000)
        });
    })
  }


  ////////////helper functions
  var deg2rad =function (deg) {
    return deg * (Math.PI/180)
  }

  function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2,obj, cb) {
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
    cb(d, obj);
  }


  //creates the info window that pops up when user clicks on a marker
  var displayInfo = function (marker, place, wait, elapsed) {
    var site = place.website === undefined ? '' : place.website;
    var infowindow = new google.maps.InfoWindow({
      content: '<p>' + place.name+'<br />Wait time is ' + wait +
      ' minutes.<br />Information is '+ elapsed+ ' minutes old.</p>' +
      '<a href = "' + place.website + '">' + site + '</a>'
    });
    google.maps.event.addListener(marker, 'click', function() {
      if(privwindow){privwindow.close()}
      privwindow = infowindow;
      infowindow.open(marker.get('map'), marker);
    });
  }

  var getweb = function(id,cb){
    var request = {placeId: id};
      var service = new google.maps.places.PlacesService(map);
      service.getDetails(request,cb);
  }

  return {
    createMap: createMap,
    createMarker: createMarker,
    getPosition: getPosition,
    findWaitTimes: findWaitTimes,
    fetchWaitTimes: fetchWaitTimes,
    getRestaurantLocation: getRestaurantLocation,
    getClosestRestaurant:getClosestRestaurant,
    displayInfo: displayInfo,
    getweb:getweb,
    centerMap: centerMap,
    map: map

  }
})
