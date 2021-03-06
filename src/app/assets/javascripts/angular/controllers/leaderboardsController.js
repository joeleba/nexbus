(function() {
  angular
  .module('nexbus')
  .controller('LeaderboardsController',

  ["$scope", "$http", "$location", "$window", "$sessionStorage", "$timeout", "ipCookie", LeaderboardsController]);

  function LeaderboardsController($scope, $http, $location, $window, $sessionStorage, $timeout, ipCookie) {
    $scope.page = $location.path();
    $scope.leaderboard = [];
    $scope.clientLoading = false;

    function getLeaderboard() {
      $http.get('/api/v1/users').
      then(function(res) {
        $timeout(function() { $scope.clientLoading = false; }, 1000);
        $scope.leaderboard = res.data;
        $sessionStorage.leaderboardUsers = $scope.leaderboard;
      }, function (err) {
        $scope.error = err;
      });
    }

    $scope.clientGetLeaderboard = function () {
      $scope.clientLoading = true;
      getLeaderboard();
    }

    // Workaround because push.js doesn't seem to work well with the fragment identifier
    $scope.logOut = function() {
      // When caching is merged in: $sessionStorage.$reset();
      ipCookie.remove('user');
      $window.location.href = '/auth/logout';
    }

    if ($sessionStorage.leaderboardUsers) {
      $scope.leaderboard = $sessionStorage.leaderboardUsers;
    } else {
      getLeaderboard();
    }
  }
})();
