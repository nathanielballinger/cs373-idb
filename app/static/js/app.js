'use strict';   // See note about 'use strict'; below

var myApp = angular.module('myApp', ['ngRoute', 'ngSanitize']);

myApp.constant('_',
    window._
);

myApp.config(['$routeProvider',
     function($routeProvider) {
         $routeProvider.
             when('/', {
                 templateUrl: '../static/partials/splash.html',
             }).
             when('/about', {
                 templateUrl: '../static/partials/about.html',
                 controller: 'aboutCtrl'
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



var listVals = ["platforms", "games", "character", "first_appeared_in_game"];

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

function getObjectFromId(http, type, id) {
    switch(type) {
        case 0:
            type = "games";
            break;
        case 1:
            type = "platforms";
            break;
        case 2:
            type = "characters"
            break;
        default:
            break;
    }

    http.get("/api/" + type + "/" + id)
    .then(function (response) {
        var data = response.data;
        return {
            name : data.name,
            id : data.id
        }
    });
}

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
    $scope.page = 1
    $scope.pages = [1,2,3,4,5]

    $scope.sortType = "name";
    $scope.sortReverse = false;
    $scope.search = "";

    $http.get("/api/games/offset/1")
    .then(function (response) {
        $scope.games = response.data;
        _.each($scope.games, function(game) {
            if(game.release_date != null) 
                game.release_date = new Date(game.release_date);
        })
        console.log($scope.games)
    })

    $scope.info = {};

    $scope.getPages = function(index) {
        if (index === 0){
            return
        }
        switch(index){
            case 1:
                $scope.pages = _.range(1,6)
                break
            case 2:
                $scope.pages = _.range(1,6)
                break
            case 2078:
                $scope.pages = _.range(2075,2080)
                break
            case 2079:
                $scope.pages = _.range(2075,2080)
                break
            default:
                $scope.pages = _.range(index-2, index+3)
        }
        $scope.page = index
        $http.get("/api/games/offset/"+index)
        .then(function (response) {
            $scope.games = response.data;
            _.each($scope.games, function(game) {
                if(game.release_date != null) 
                    game.release_date = new Date(game.release_date);
            })
            // console.log($scope.games)
        })
        
    }
})

//Controller for all Platforms
myApp.controller('platformsCtrl', function($scope, $http, _){
    $scope.page = 1;
    $scope.pages = [1,2,3,4,5];

    $scope.sortType = "name";
    $scope.sortReverse = false;
    $scope.search = "";

    $http.get("/api/platforms/offset/1")
    .then(function (response) {
        $scope.platforms = response.data;
        _.each($scope.platforms, function(platform) {
            if(platform.release_date != null) 
                platform.release_date = new Date(platform.release_date);
        })
        console.log($scope.platforms)
    })

    $scope.info = {};

    $scope.getPages = function(index) {
        if (index === 0){
            return
        }
        switch(index){
            case 1:
                $scope.pages = _.range(1,6)
                break
            case 2:
                $scope.pages = _.range(1,6)
                break
            case 5:
                $scope.pages = _.range(2,7)
                break
            case 6:
                $scope.pages = _.range(2,7)
                break
            default:
                $scope.pages = _.range(index-2, index+3)
        }
        $scope.page = index
        $http.get("/api/platforms/offset/"+index)
        .then(function (response) {
            $scope.platforms = response.data;
            _.each($scope.platforms, function(platform) {
                if(platform.release_date != null) 
                    platform.release_date = new Date(platform.release_date);
            })
            console.log($scope.platforms)
        })
        
    }
})

//Controller for all characters
myApp.controller('charactersCtrl', function($scope, $http){
    $scope.page = 1
    $scope.pages = [1,2,3,4,5]

    $scope.sortType = "name";
    $scope.sortReverse = false;
    $scope.search = "";

    var names = {};
    $http.get("api/characters/offset/1")
    .then(function (response) {
        $scope.characters = response.data;
        _.each($scope.characters, function(character) {
            if(character.birthday != null){
                character.birthday = new Date(character.birthday);
            }
        })
        console.log($scope.characters);
    })
    $scope.info = {};

    $scope.getPages = function(index) {
        if (index === 0){
            return
        }
        switch(index){
            case 1:
                $scope.pages = _.range(1,6)
                break
            case 2:
                $scope.pages = _.range(1,6)
                break
            case 1322:
                $scope.pages = _.range(1319,1324)
                break
            case 1323:
                $scope.pages = _.range(1319,1324)
                break
            default:
                $scope.pages = _.range(index-2, index+3)
        }
        $scope.page = index
        $http.get("/api/characters/offset/"+index)
        .then(function (response) {
            $scope.characters = response.data;
            _.each($scope.characters, function(character) {
                if(character.birthday != null) {
                    character.birthday = new Date(character.birthday);
                }
            })
        })
            // console.log($scope.games)        
    }
})

//Controller for one Game
myApp.controller('gameCtrl', ['$scope','$routeParams', '$http', function($scope, $routeParams, $http) {

    var gameId = $routeParams.id

    $http.get("/api/games/"+gameId)
    .then(function (response) {
        var data = response.data;
        $scope.game = fixNullEmpty(data);
        console.log($scope.game);
    })

    $scope.info = {};

    $scope.init = function() {
        console.log("Hello World from game");
    }

}]);

//Controller for one Character
myApp.controller('characterCtrl', ['$scope','$routeParams', '$http', '$location', function($scope, $routeParams, $http, $location) {
    var characterId = $routeParams.id;

    $http.get("/api/characters/"+characterId)
    .then(function (response) {
        var data = response.data;
        $scope.character = fixNullEmpty(data);
        console.log($scope.character);
    })

    $scope.init = function() {
        console.log("Hello World from character");
    }

}]);

//Controller for one Platform
myApp.controller('platformCtrl', ['$scope','$routeParams', '$http', function($scope, $routeParams, $http) {
    var platformId = $routeParams.id;

    $http.get("/api/platforms/"+platformId)
    .then(function (response) {
        var data = response.data;
        data.release_date = new Date(data.release_date);
        $scope.platform = fixNullEmpty(data);
        console.log($scope.platform);
    })

    $scope.info = {};


    $scope.init = function() {
        console.log("Hello World from platform");
    }

}]);

//Controller for about page
var scope;
myApp.controller('aboutCtrl', ['$scope','$routeParams', '$http', function($scope, $routeParams, $http) {
    $scope.testOutput = "";

    var usernameToName = {
        "Eitan-Yarmush" : "eitan",
        "Kwong98" : "keith",
        "ctc837" : "chris",
        "abhirathod95" : "abhi",
        "nathanielballinger" : "nathan",
        "total" : "total"
    }

    for (var key in usernameToName) {
        $scope[usernameToName[key]] = {"contributions" : 0, "issues" : 0};
    }
    $http.get("https://api.github.com/repos/nathanielballinger/cs373-idb/contributors")
    .then(function (response) {
        var data = response.data;
        for(var i = 0; i < data.length; i++) {
            var username = data[i].login;
            console.log(username);
            if(username == "EItanya")
                $scope.eitan.contributions += data[i].contributions;
            else 
                $scope[usernameToName[username]].contributions = data[i].contributions;

            $scope.total.contributions += data[i].contributions;
        }
    })

    $http.get("https://api.github.com/repos/nathanielballinger/cs373-idb/issues?per_page=100&state=all")
    .then(function (response) {
        var data = response.data;
        for(var i = 0; i < data.length; i++) {
            var username = data[i].user.login;
            if(username == "EItanya")
                $scope.eitan.issues += 1;
            else
                $scope[usernameToName[username]].issues += 1;
            $scope.total.issues += 1;
        }
    })

    $scope.runTests = function () {
        $http.get("/api/runtests")
        .then(function (response) {
            $scope.testOutput = response.data;
        })
    }

    $scope.info = {};


    $scope.init = function() {
        console.log("Hello World from platform");
    }
    scope = $scope;
}]);


