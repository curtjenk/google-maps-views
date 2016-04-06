 mapsApp.controller('RightCtrl', function($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function() {
      $mdSidenav('right').close()
        .then(function() {
          $log.debug("close RIGHT is done");
        });
    };
    
    $scope.example1model = [];
    $scope.places = normalizedPlaces(); //[ {id: 1, label: "David"}, {id: 2, label: "Jhon"}, {id: 3, label: "Danny"}];
    
    console.log($scope.example1data);
    
    // $scope.example5customTexts = {
    //   buttonDefaultText: 'Place Types'
    // };
    // $scope.example10settings = {
    //   selectionLimit: 1
    // };
    $scope.cities = cities;


  });