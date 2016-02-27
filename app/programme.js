'use strict';

angular.module('programme', ['ngSanitize', 'hc.marked', 'ngLocale', 'ngAnimate', 'ui.bootstrap', 'ui.calendar'])
    .controller('ProgrammeCtrl', ['$scope', '$http', 'marked', 'dateFilter', '$uibModal', function($scope, $http, marked, dateFilter, $uibModal) {

        var formatDefinitions = [{format: 'Conf', label: 'Conférences', icon: 'fa-slideshare'},
            {format: 'TiA', label: 'Tools in Action', icon: 'fa-wrench'},
            {format: 'Univ', label: 'Universités', icon: 'fa-terminal'},
            {format: 'Quickie', label: 'Quickies', icon: 'fa-clock-o'},
            {format: 'Lab', label: 'Labs', icon: 'fa-flask'}];

        var trackColors = {
            'Track1': '#C9880F',
            'Track2': '#BB283C',
            'Track3': '#287F95',
            'Track4': '#F55E52',
            'Track5 (labs)': '#6B4162',
            'Keynote': '#FFFFFF',
            'Pause': '#FFFFFF'
        };

        var formats = this.formats = _.indexBy(formatDefinitions, 'format');
        this.formatOrder = _.map(formatDefinitions, 'format');

        this.calendarConfig = {
            defaultDate: '2016-03-23',
            defaultView: 'agendaDay',
            slotEventOverlap: false,
            slotDuration: '00:15:00',
            editable: false,
            header: {
                left: '',
                center: '',
                right: 'prev,next'
            },
            titleFormat: {
                day: ''
            },
            columnFormat: {
                day: ''
            },
            allDaySlot: false,
            minTime: '08:30:00',
            maxTime: '21:00:00',
            axisFormat: 'HH:mm',
            contentHeight: 1125,
            height: 1125,
            timeFormat: {
                agenda: 'HH:mm'
            },
            eventClick: function(calEvent) {
                this.details(calEvent);
            }.bind(this)
        };

        $http.get('json/2016/schedule.json').then(function(response) {

            var talks = response.data;

            this.days = _.transform(_.groupBy(talks, function(talk) {
                return _.capitalize(dateFilter(new Date(talk.event_start), 'EEEE'));
            }), function(result, talks, day) {
                result[day] = {
                    talks: _.groupBy(talks, 'format')
                };
                return result;
            });

            this.agenda = {
                events: _.map(talks, function(talk) {
                    return {
                        title: talk.name,
                        format: talk.format,
                        description: talk.description,
                        speakers: talk.speakers,
                        start: talk.event_start,
                        end: talk.event_end,
                        color: trackColors[talk.venue]
                    };
                })
            };
        }.bind(this));

        this.details = function(talk) {
            $uibModal.open({
                templateUrl: 'talk-details.html',
                controller: function() {
                    this.talk = talk;
                    this.formats = formats;
                },
                controllerAs: 'detailsCtrl'
            });
        };
    }]);

