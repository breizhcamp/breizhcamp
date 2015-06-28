'use strict';

module.exports = {
    init: function () {
        angular.module('replay', []);
        angular.module('replay').controller('ReplayCtrl', ['$scope', '$http', function ($scope, $http) {

            $scope.speakers = function (talk) {
                return _.map(talk.speakers,function (speaker) {
                    return speaker.fullname;
                }).join(', ');
            };

            $http.get('./json/talks.json').then(function (response) {
                $scope.talks = response.data;
            });
        }]);
    }
};