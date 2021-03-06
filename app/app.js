'use strict';
//var angular = require('angular');

console.log('app init called');
angular.module('replay', []);
angular.module('replay').controller('ReplayCtrl', ['$scope', '$http', function ($scope, $http) {

    $scope.speakers = function (talk) {
        return _.map(talk.speakers,function (speaker) {
            return speaker.fullname;
        }).join(', ');
    };

    $http.get('./json/2015/talks.json').then(function (response) {
        $scope.talks = response.data;
    });
}]);
