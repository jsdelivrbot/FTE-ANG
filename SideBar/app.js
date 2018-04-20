// MODULE
var tuggerTracker = angular.module('tuggerTracker',['ngAria','ngMaterial']);

tuggerTracker
  .controller('sidenavDemo2', function ($scope, $timeout, $mdSidenav) {
    $scope.toggleLeft = buildToggler('left');
    $scope.toggleRight = buildToggler('right');

    function buildToggler(componentId) {
      return function() {
        $mdSidenav(componentId).toggle();
      };
    }
  });




