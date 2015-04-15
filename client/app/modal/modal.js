nomNow.controller("modalctrl", ["$scope","$modal","Map",function ($scope,$modal,$log,Map) {
  $scope.reportpage= function(){
    // the modal is a popup below is a tamplate feature of angular.
    var modalInstance = $modal.open({
      templateUrl: 'Report.html',
      controller: 'ModalInstanceCtrl',
      size: 'lr',
      
  })
    //the angular docs required this step. the popup does not work without this
    modalInstance.result.then(function(selectedItem){
      $scope.selected= selectedItem;
      },function(){
        $log.info('Modal dismissed at: ' + new Date());
    }) 
  }
}])

.controller('ModalInstanceCtrl',["$scope","$modalInstance",'Map',"$http",function ($scope, $modalInstance, Map, $http){
  $scope.manual = {'visibility' :"collapse"}
  $scope.buttons = {'visibility' :"collapse"}
  // loading exists till it finds the closest 
  $scope.items="Loading..."
  $scope.waittime={};
  var restaurant;

  var getclose = function(){
    Map.getClosestRestaurant(function(value){
      console.log(value)
      restaurant=value;

      $scope.items = "Are you  at : "+value['name']+"?";
      $scope.buttons = {'visibility' :"visible"}
      $scope.$digest()
    }) 
  }

  getclose()

  $scope.waittime.inputs ='30'
  $scope.yes=function(){
    $scope.items= restaurant['name']
    $scope.buttons = {'visibility' :"collapse", "height":"0px","width":"0px"};
  }

  $scope.no=function(){
    $scope.buttons =  {'visibility' :"collapse", "height":"0px","width":"0px"};
    $scope.manual = {'visibility' :"visible"}
    $scope.items="Enter the place you are at."
  }

  $scope.cancel=function(){
    $modalInstance.close()
  }

  $scope.ok =function(){
   var n = $scope.manualinput
    Map.getClosestRestaurant(function(value){
      $scope.items = "Are you  at : "+value['name']+"?";
      $scope.buttons = {'visibility' :"visible"}
      $scope.$digest()
    },n);      
  }

  $scope.submit= function(){
    var info= {data:{google_id:restaurant.google_id,
      name:restaurant.name,
      longitude: restaurant.location["D"],
      latitude: restaurant.location["k"],
      'wait':$scope.waittime.inputs}}
    console.log(info)
    $http({
      method: 'POST',
      url: '/wait',
      data: info
      
    })
    $modalInstance.close();
  }

}])
