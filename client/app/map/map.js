angular.module('nomNow.map', ['ui.bootstrap'])


.controller('mapController', function ($scope, $location, $q, Map) {
  $scope.createMap = function() {
    return Map.createMap();
  }

  $scope.findWaitTimes = function() {
    Map.findWaitTimes($scope)
  }

  $scope.createMap()
    .then(function() {
      $scope.findWaitTimes()
    })

})


.controller("modalctrl", ["$scope","$modal","Map",function ($scope,$modal,$log,Map) {
  $scope.items = "rusty bar"
  $scope.reportpage= function(){
    var modalInstance = $modal.open({
      templateUrl: 'Report.html',
      controller: 'ModalInstanceCtrl',
      size: 'lr',
      resolve: {
        items: function () {
          return $scope.itmes;
        }
      }
  })
    modalInstance.result.then(function(selectedItem){
      $scope.selected= selectedItem;
      },function(){
        $log.info('Modal dismissed at: ' + new Date());
    }) 
  }
}])
.controller('ModalInstanceCtrl',["$scope","$modalInstance",'Map',function ($scope, $modalInstance, Map){
  $scope.items="Loading..."
  Map.getClosestRestaurant(function(value){
    console.log('name',value['name'])
    $scope.items = value['name'];
    console.log($scope.items)
  })
  // Map.getRestaurantLocation("ChIJ1XlZ4Qm1RIYR4rpevy6Ybs4",function(coords,place){
  //   console.log(coords,place)

  // })
  //  Map.getPosition().then(function(value){
  //   console.log(value.coords.latitude, value.coords.longitude);
  // }); 
  $scope.ok=function(){
    $modalInstance.close()
  }

}])
