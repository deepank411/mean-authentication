var myApp = angular.module('myApp', ['ngRoute']);

myApp.config(function ($routeProvider) {
   $routeProvider
   .when('/', {
      templateUrl: 'partials/home.html',
      access: {restricted: true}
   })
   .when('/login', {
      templateUrl: 'partials/login.html',
      controller: 'loginController',
      access: {restricted: false}
   })
   .when('/logout', {
      controller: 'logoutController',
      access: {restricted: true}
   })
   .when('/register', {
      templateUrl: 'partials/register.html',
      controller: 'registerController',
      access: {restricted: false}
   })
   .when('/one', {
      template: '<h1>This is page one!</h1>',
      access: {restricted: true}
   })
   .when('/two', {
      template: '<h1>This is page two!</h1>',
      access: {restricted: false}
   })
   .otherwise({
      redirectTo: '/'
   });
});

myApp.run(function ($rootScope, $location, $route, AuthService) {
   $rootScope.$on('$routeChangeStart',
   function (event, next, current) {
      AuthService.getUserStatus()
      .then(function(){
         if (next.access.restricted && !AuthService.isLoggedIn()){
            $location.path('/login');
            $route.reload();
         }
      });
   });
});

angular.module('myApp').factory('AuthService',
['$q', '$timeout', '$http',
function ($q, $timeout, $http) {

   // create user variable
   var user = null;

   // return available functions for use in the controllers
   return ({
      isLoggedIn: isLoggedIn,
      getUserStatus: getUserStatus,
      login: login,
      logout: logout,
      register: register
   });

   function isLoggedIn() {
      if(user) {
         return true;
      } else {
         return false;
      }
   }

   function getUserStatus() {
      return $http.get('/user/status')
      // handle success
      .success(function (data) {
         if(data.status){
            user = true;
         } else {
            user = false;
         }
      })
      // handle error
      .error(function (data) {
         user = false;
      });
   }

   function login(username, password) {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/user/login',
      {username: username, password: password})
      // handle success
      .success(function (data, status) {
         if(status === 200 && data.status){
            user = true;
            deferred.resolve();
         } else {
            user = false;
            deferred.reject();
         }
      })
      // handle error
      .error(function (data) {
         user = false;
         deferred.reject();
      });

      // return promise object
      return deferred.promise;

   }

   function logout() {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a get request to the server
      $http.get('/user/logout')
      // handle success
      .success(function (data) {
         user = false;
         deferred.resolve();
      })
      // handle error
      .error(function (data) {
         user = false;
         deferred.reject();
      });

      // return promise object
      return deferred.promise;

   }

   function register(username, password) {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/user/register',
      {username: username, password: password})
      // handle success
      .success(function (data, status) {
         if(status === 200 && data.status){
            deferred.resolve();
         } else {
            deferred.reject();
         }
      })
      // handle error
      .error(function (data) {
         deferred.reject();
      });

      // return promise object
      return deferred.promise;

   }

}]);
