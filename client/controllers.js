myApp.controller("loginController", ['$scope', '$location', 'AuthService', function($scope, $location, AuthService){
   $scope.login = function(){
      $scope.error = false;
      $scope.disabled = false;

      AuthService.login($scope.loginForm.username, $scope.loginForm.password)
      .then(function(){
         $location.path("/");
         $scope.disabled = false;
         $scope.loginForm = {};
      })
      .catch(function(){
         $scope.error = true;
         $scope.errorMessage = "Invalid username and/or password";
         $scope.disabled = false;
         $scope.loginForm = {};
      });
   };
}]);

myApp.controller('logoutController', ['$scope', '$location', 'AuthService', function ($scope, $location, AuthService) {

   $scope.logout = function () {

      // call logout from service
      AuthService.logout()
      .then(function () {
         $location.path('/login');
      });

   };

}]);

myApp.controller('registerController', ['$scope', '$location', 'AuthService', function ($scope, $location, AuthService) {

   $scope.register = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call register from service
      AuthService.register($scope.registerForm.name, $scope.registerForm.username, $scope.registerForm.password)
      // handle success
      .then(function () {
         $location.path('/login');
         $scope.disabled = false;
         $scope.registerForm = {};
      })
      // handle error
      .catch(function () {
         $scope.error = true;
         $scope.errorMessage = "Something went wrong!";
         $scope.disabled = false;
         $scope.registerForm = {};
      });

   };

}]);
