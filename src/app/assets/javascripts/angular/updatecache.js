(function() {
  var app = angular.module('nexbus');

  app.run(['$window', function($window) {
    $window.addEventListener('load', function(e) {
      $window.applicationCache.addEventListener('updateready', function(e) {
        if ($window.applicationCache.status ==
            $window.applicationCache.UPDATEREADY) {
              if (confirm('A new version of nexbus is available! Load now?')) {
                location.reload();
              }
            }
        });
      });
    }]);
})();
