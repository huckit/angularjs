var uid = 1;
var interceptor = function ($q, $location) {
    return {
        request: function (config) {
            console.log(config);
            return config;
        },

        response: function (result) {
            console.log('Repos:');
        //    result.data.splice(0, 10).forEach(function (repo) {
         //       console.log(repo.name);
        //    })
            return result;
        },

        responseError: function (rejection) {
            console.log('Failed with', rejection.status, 'status');
            if (rejection.status == 403) {
                $location.url('/login');
            }

            return $q.reject(rejection);
        }
    }
};

//angular.module('app', [])
// feature master change

var phonecatAppx = angular.module('phonecatApp1', [])
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push(interceptor);
    });


//var phonecatAppx = angular.module('phonecatApp1', []);

//phonecatAppx.controller('PhoneListCtrl1', ['$scope', '$http', function($scope, $http) {
//  $http.get('http://127.0.0.1:7000/games/').success(function(data) {
//    $scope.phones = data;
//  });

//  $scope.orderProp = 'age';
//}]);



phonecatAppx.controller('ContactController', ['$scope', '$http', '$window', function($scope, $http, $window) {
    
 if($window.sessionStorage.getItem('token') == null) {
      console.log('logged out');
      console.log($window.sessionStorage.getItem('token'));
    $scope.visible = true;
 //   $scope.visible = !$scope.visible;
 }else{
      console.log('logged in');
      console.log($window.sessionStorage.getItem('token'));
    $scope.visible2 = true;
  //  $scope.visible2 = !$scope.visible2;
 }

 $scope.initFirst=function(){
    $http.get('http://127.0.0.1:7000/games/').success(function(data) {
      $scope.contacts = data;
    });
 }

 $scope.login = function() {
    $http({
      method: 'POST',
      url: 'http://127.0.0.1:7000/oauth2/access_token/',
      data: 'username=' + $scope.newcontact.username + '&password=' + $scope.newcontact.password + '&grant_type=password&client_id=' + $scope.newcontact.username,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function(data) {
      console.log( data.access_token );
      
      $window.sessionStorage.setItem('token', data.access_token);
      console.log($window.sessionStorage.getItem('token'));
    //  $scope.initFirst();
      
      $scope.visible2 = true;
      $scope.visible = !$scope.visible;
      $scope.newcontact = {};
    });
 }
        
 $scope.logout = function(){
    $http.get('http://127.0.0.1:7000/api-auth/logout/').success(function(data) {
      //$scope.contacts = data;
      $window.sessionStorage['token'] = null;
      console.log($window.sessionStorage.getItem('token'));
      $scope.visible = true;
      $scope.visible2 = !$scope.visible2;
    });
 }

 $scope.joinGame = function(id) {
    $http({
      method: 'POST',
      url: 'http://127.0.0.1:7000/mygames/',
      data: '{"game":"' + id  +  '"}', 
      headers: {'Content-Type': 'application/json', 'Authorization': 'bearer ' + $window.sessionStorage.getItem('token') }
    }).success(function(data) {
      console.log( data );
      //$window.sessionStorage.setItem('token', data.access_token);
      //$scope.initFirst();
      //$scope.newcontact = {};
    });
 }
        
 $scope.saveContact = function() {
    var dataObj = { description : $scope.newcontact.name };	
    $http.post('http://127.0.0.1:7000/games/', dataObj ).success(function(data) {
      $scope.initFirst();
      $scope.newcontact = {};
    });
 }
        
//        if($scope.newcontact.id == null) {
 //            $scope.newcontact.id = uid++;
//             $scope.contacts.push($scope.newcontact);
 //       } else {
            
//             for(i in $scope.contacts) {
 //                   if($scope.contacts[i].id == $scope.newcontact.id) {
  //                      $scope.contacts[i] = $scope.newcontact;
//                    }
 //            }                
//        }
//        $scope.newcontact = {};

    
    $scope.delete = function(id) {
        
        for(i in $scope.contacts) {
            if($scope.contacts[i].id == id) {
                $scope.contacts.splice(i,1);
                $scope.newcontact = {};
            }
        }
        
    }
    
    
    $scope.edit = function(id) {
        for(i in $scope.contacts) {
            if($scope.contacts[i].id == id) {
                $scope.newcontact = angular.copy($scope.contacts[i]);
            }
        }
    }
//}
}]);
