angular.module('logbooked', ['ionic'])

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
  .state('index', {
    url: '/',
    templateUrl: 'main-screen.html'
  })
  .state('entries', {
    url: '/entries',
    templateUrl: 'entryviewer.html'
  });
$urlRouterProvider.otherwise('/');

})



.factory('Cars', function () {
    return {
        all: function () {
            var carString = window.localStorage['cars'];
            if (carString) {
                return angular.fromJson(carString);
            }
            return [];
        },
        save: function (cars) {
            window.localStorage['cars'] = angular.toJson(cars);
        },
        newCar: function (carName) {
            return {
                name: carName,
                fahrten: []
            };
        },
        getLastActiveIndex: function () {
            return parseInt(window.localStorage['lastActiveCar']) || 0;
        },
        setLastActiveIndex: function (index) {
            window.localStorage['lastActiveCar'] = index;
        }
    }
})


.controller('FahrtenCtrl', function ($scope, $timeout, $ionicModal, Cars, $ionicSideMenuDelegate, $state) {

    var createCar = function (carName) {
        var newCar = Cars.newCar(carName);
        $scope.cars.push(newCar);
        Cars.save($scope.cars);
        $scope.selectCar(newCar, $scope.cars.length - 1);
    }

    $scope.resetStorage = function(){
    window.localStorage.clear();
    }

    $scope.cars = Cars.all();

    $scope.activeCar = $scope.cars[Cars.getLastActiveIndex()];

    $scope.newCar = function () {
        var carName = prompt('Vehicle Name');
        if (carName) {
            createCar(carName);
        }
    };

    $scope.selectCar = function (car, index) {
        $scope.activeCar = car;
        Cars.setLastActiveIndex(index);
        $state.go('entries');
    }

    $ionicModal.fromTemplateUrl("templates/new-entry.html", function (modal) {
        $scope.entryModal = modal;
    }, {
        scope: $scope,
        animation: 'slide-in-up'
    });

    $scope.showEditor = function(index) {
    }

    $scope.backtomain = function() {
        $state.go('index');
    }
    $scope.createEntry = function (entry) {
        if (!$scope.activeCar || !entry) {
            return;
        }
        $scope.activeCar.fahrten.push({
            date: entry.date,
            km: entry.km,
            notes: entry.notes,
            destination: entry.destination,
            starttime: entry.starttime,
            endtime: entry.endtime
        });
        $scope.entryModal.hide();
        Cars.save($scope.cars);
        entry.title = "";
    };

    $scope.newEntry = function () {
        $scope.entryModal.show();
    };

    $scope.closeNewEntry = function () {
        $scope.entryModal.hide();
    };


    $timeout(function() {
        if($scope.cars.length == 0) {
            while(true) {
                var carName = prompt('Bitte einen Fahrzeugnamen eingeben:');
                if(carName) {
                    createCar(carName);
                    break;
                }
            }
        }
    });



});