var nomNow = angular.module('nomNow.map', ['ui.bootstrap'])

nomNow.directive('googleplace', function(Map) {
  return {
    require: 'ngModel',
    scope: {
      ngModel: '=',
      details: '=?',
      location: '=?'
  },
  link: function(scope, element, attrs, model) {
    var options = {
      types: [],
      componentRestrictions: {}
    };
    scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

    google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
      var place = scope.gPlace.getPlace();
      scope.details = place;
      Map.centerMap(place);
      scope.$apply(function() {
        scope.location = scope.details.geometry.location;
        model.$setViewValue(element.val());
      });
    });
  }  
  };
});

nomNow.controller('mapController', function ($scope, $location, $q, Map) {
  $scope.createMap = function() {
    return Map.createMap();
  }

  $scope.findWaitTimes = function() {
    Map.findWaitTimes($scope)
  }

  $scope.createMap()
    .then(function(map) {
      $scope.findWaitTimes()
      $scope.gPlace;
      $scope.map = map
    });

});

