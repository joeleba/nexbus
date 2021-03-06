(function() {
  'use strict';

  var app = angular
        .module('nexbus', ['ngRoute', 'ngAnimate', 'ngTouch',
                           'templates', 'ngStorage', 'ipCookie']);

  app.config(['$routeProvider', function($routeProvider){
    $routeProvider
      .when('/', {
        templateUrl: 'location.html',
        controller: 'MainController'
        //resolve: {
        //  authenticated: ['checkLoggedIn', function(checkLoggedIn) {
        //    return checkLoggedIn();
        //  }]
        //}
      })
      .when('/login', {
        templateUrl: 'ng-index.html',
        controller: 'LoginController'
      })
      .when('/stop/:stopId', {
        templateUrl: 'timings.html',
        resolve: {
          authenticated: ['checkLoggedIn', function(checkLoggedIn) {
            return checkLoggedIn();
          }]
        }
      })
      .when('/location', {
        templateUrl: 'location.html',
        resolve: {
          authenticated: ['checkLoggedIn', function(checkLoggedIn) {
            return checkLoggedIn();
          }]
        }
      })
      .when('/all', {
        templateUrl: 'all.html',
        resolve: {
          authenticated: ['checkLoggedIn', function(checkLoggedIn) {
            return checkLoggedIn();
          }]
        }
      })
      .when('/leaderboards', {
        templateUrl: 'leaderboards.html',
        resolve: {
          authenticated: ['checkLoggedIn', function(checkLoggedIn) {
            return checkLoggedIn();
          }]
        }
      })
      .otherwise({
        templateUrl: '404.html'
      });
  }]);

  app.run(['$rootScope', '$location', function ($rootScope, $location) {
    $rootScope.$on("$routeChangeError", function(event, current, previous, rejection) {
      $location.path('/login');
    });

    // Hack due to some push.js and angularjs compatibility issue
    // Since it is function to be shared across controllers and is rather
    // small, it's placed in the $rootScope.
    $rootScope.goTo = function(path) {
      $location.path(path);
      $location.search({});
    }
  }]);
})();
