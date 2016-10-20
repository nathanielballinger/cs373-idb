'use strict';   // See note about 'use strict'; below

var myApp = angular.module('myApp', ['ngRoute', 'ngSanitize']);

myApp.config(['$routeProvider',
     function($routeProvider) {
         $routeProvider.
             when('/', {
                 templateUrl: '../static/partials/splash.html',
             }).
             when('/about', {
                 templateUrl: '../static/partials/about.html',
             }).
             when('/games', {
                 templateUrl: '../static/partials/games.html',
                 controller: 'gamesCtrl'
             }).
             when('/platforms', {
                 templateUrl: '../static/partials/platforms.html',
                 controller: 'platformsCtrl',
             }).
             when('/characters', {
                 templateUrl: '../static/partials/characters.html',
                 controller: 'charactersCtrl',
             }).
             when('/game/:id', {
                 templateUrl: '../static/partials/game.html',
                 controller: 'gameCtrl',
             }).
             when('/character/:id', {
                 templateUrl: '../static/partials/character.html',
                 controller: 'characterCtrl',
             }).
             when('/platform/:id', {
                 templateUrl: '../static/partials/platform.html',
                 controller: 'platformCtrl',
             }).
             otherwise({
                 redirectTo: '/'
             });
    }]);

//var scope;
myApp.controller('headerCtrl', function($scope, $http, $location) {
    $scope.navCollapsed = true;
    $scope.refs = [];
    var pageNames = ["Games", "Platforms", "Characters", "About"];
    var pageRefs = ["/#/games", "/#/platforms", "/#/characters", "/#/about"];
    var temp = $scope.refs; 
    for (var i = 0; i < pageNames.length; i++) {   
        temp.push({"name":pageNames[i], "href":pageRefs[i]});
    }

    $scope.isActive = function(viewLocation) {
        return viewLocation == $location.path();
    };

    //debug; remove after
    //scope = $scope;
})

//Controller for all games
myApp.controller('gamesCtrl', function($scope, $http){
    $http.get("/getGameTable")
    .then(function (response) {
        $scope.games = response.data;
        console.log($scope.games)
    })

    $scope.info = {};


    $scope.init = function() {
        console.log("Hello World from games");
    }
})

//Controller for all Platforms
myApp.controller('platformsCtrl', function($scope, $http){

    $http.get("/getPlatformTable")
    .then(function (response) {
        $scope.platforms = response.data;
        console.log($scope.platforms)
    })

    $scope.info = {};


    $scope.init = function() {
        console.log("Hello World from platforms");
    }
})

//Controller for all characters
myApp.controller('charactersCtrl', function($scope, $http){

    $http.get("/getCharacterTable")
    .then(function (response) {
        $scope.games = response.data;
        console.log($scope.games)
    })

    $scope.info = {};


    $scope.init = function() {
        console.log("Hello World from characters");
    }
})


var listVals = ["friends", "enemies", "platforms", "genres", "developers", "characters"];

function fixNullEmpty(obj) {
    var defaultVal;
    // Fix all the null and empty string values 
    for (var key in obj) {
        if(obj.hasOwnProperty(key)) {
            if (listVals.indexOf(key) > -1) 
                defaultVal = [];
            else
                defaultVal = "Unknown";

            var val = obj[key];
            if(val == null)
                obj[key] = defaultVal;  
            if((typeof val === 'string' || val instanceof String) && val.length ==0)
                obj[key] = defaultVal;
        }
    }

    // In case there is no image
    if (obj.image == null || obj.image.super_url == null) 
        obj.image ={"super_url" : "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"};
    return obj;
}

//Controller for one Game
myApp.controller('gameCtrl', ['$scope','$routeParams', '$http', function($scope, $routeParams, $http) {

    var gameId = $routeParams.id

    $http.get("/getGame/?id="+gameId)
    .then(function (response) {
        $scope.game = fixNullEmpty(response.data);
        console.log($scope.game)
    })

    $scope.info = {};


    $scope.init = function() {
        console.log("Hello World from game");
    }

}]);

//Controller for one Character
myApp.controller('characterCtrl', ['$scope','$routeParams', '$http', function($scope, $routeParams, $http) {
    var characterId = $routeParams.id;

    $http.get("/getCharacter/?id="+characterId)
    .then(function (response) {
        $scope.character = fixNullEmpty(response.data);
        console.log($scope.character);
    })

    $scope.init = function() {
        console.log("Hello World from character");
    }

}]);

//Controller for one Platform
myApp.controller('platformCtrl', ['$scope','$routeParams', '$http', function($scope, $routeParams, $http) {
    var platformId = $routeParams.id;

    $http.get("/getPlatform/?id="+platformId)
    .then(function (response) {
        $scope.platform = response.data;
        console.log($scope.platform)
    })

    $scope.info = {};


    $scope.init = function() {
        console.log("Hello World from platform");
    }

}]);

