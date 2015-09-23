(function() {
  angular
  .module('nexbus')
  .controller('TimingsController', ["$scope", "$http", "$route", "$location",
  "$timeout", TimingsController]);

function TimingsController($scope, $http, $route, $location, $timeout) {

  var params = $route.current.params;

  $scope.loading = true;
  $scope.hasError = false;

  // Returns the selected Stop name given the stop_id
  $scope.getStopName = function(stop_id) {
    $http.get('/api/v1/stops/' + stop_id, { cache: true }).
      then(function(res) {
        $scope.currentStopName = res.data.name;
      }, function(err) {
        $scope.currentStopName = '';
        $scope.handleError(err);
      })
  };

  // Returns all the Services available at a particular Stop
  $scope.getServicesAt = function(stop_id) {
    $http.get('/api/v1/stops/' + stop_id + '/services', { cache: true }).
      then(function(res) {
        $scope.serviceData = res.data;
        getSightingsForServices(stop_id, $scope.serviceData);
      }, function(err) {
        $scope.serviceData = {};
        $scope.handleError(err);
      });
  };

  // Retrieves the Sighting data for the Services specified
  function getSightingsForServices(stop_id, services) {
    $scope.sightingsData = [];
    for (var i=0; i<services.length; i++) {
      var svc = services[i];
      getSighting(stop_id, svc.id, svc.name);
    }
    $timeout(function() { $scope.loading = false; }, 500);
  };

  // Returns the Sighting data for a particular Service
  function getSighting(stop_id, service_id, service_name) {
    $http.get('/api/v1/sightings?service_id=' + service_id + '&stop_id=' +
    stop_id).
      then(function(res) {
      var busData = {};
      var detail = res.data.prev_stops.status;
      var lastSeen;
      var thisStopMinutes = res.data.this_stop === 'No data' ? '' : ' m ago';

      if (res.data.prev_stops.last_seen) {
        lastSeen = res.data.prev_stops.stop.name + ' | ' + res.data.prev_stops.last_seen + ' m ago';
      } else {
        lastSeen = 'No data';
      }

      // This is quite messy and should be refactored in the future
      busData["name"] = service_name;
      busData["thisLastSeen"] = res.data.this_stop + thisStopMinutes;
      busData["otherLastSeen"] = lastSeen;
      busData["detail"] = detail === "" ? false : true;
      busData["capacity"] = detail;
      $scope.sightingsData.push(busData);
    }, function(err) {
      $scope.handleError(err);
    });
  };

  $scope.handleError = function(err) {
    $scope.hasError = true;
    $scope.error = err;
  }

  // Hack due to some push.js and angularjs compatibility issue
  $scope.goTo = function(path) {
    $location.path(path);
    $location.search({});
  }
  console.log($location.path().split('/'));
  if ($location.path().split('/')[1] === 'main' && $location.path().split('/')[2] === 'stop') {
    var stopId = $location.path().split('/')[3];
    console.log('stop id: ' + stopId);
    $scope.getStopName(stopId);
    $scope.getServicesAt(stopId);
  }

  $scope.closeModal = function() {
    $('#contributeModal').removeClass('active');
  }
}
})();
