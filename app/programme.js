'use strict';

angular.module('programme', ['ngSanitize', 'hc.marked', 'ngLocale', 'ngAnimate', 'ui.bootstrap', 'ui.calendar'])
    .controller('ProgrammeCtrl', ['$scope', '$http', 'marked', 'dateFilter', '$uibModal', function($scope, $http, marked, dateFilter, $uibModal) {

        var formatDefinitions = this.formatDefinitions = [{format: 'Conf', label: 'Conférence', icon: 'fa-slideshare'},
            {format: 'TiA', label: 'Tool in Action', icon: 'fa-wrench'},
            {format: 'Univ', label: 'Université', icon: 'fa-terminal'},
            {format: 'Quickie', label: 'Quickie', icon: 'fa-clock-o'},
            {format: 'Lab', label: 'Lab', icon: 'fa-flask'}];

        var trackDefinitions = {
            'Track1': {color: '#C9880F'},
            'Track2': {color: '#BB283C'},
            'Track3': {color: '#287F95'},
            'Track4': {color: '#F55E52'},
            'Track5 (labs)': {color: '#6B4162'},
            'Keynote': {color: '#FFFFFF'},
            'Pause': {color: '#FFFFFF'}
        };

        var formats = this.formats = _.indexBy(formatDefinitions, 'format');

        function renderTitle(event) {
            return '<span class="fa-stack" title="' + formats[event.format].label + '">' +
                '<i class="fa fa-square fa-stack-2x"></i>' +
                '<i style="color:' + event.color + ';" class="fa fa-stack-1x fa-inverse ' + formats[event.format].icon + '"></i> ' +
                '</span> ' + event.title +
                (event.room ? ' <em>(' + event.room + ')</em>' : '');
        }

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
            }.bind(this),
            eventRender: function(event, element) {
                element.find('.fc-title').html(renderTitle(event));
                element.attr('title', event.title); // pour voir le titre en tooltip
            }
        };

        $http.get('json/2016/schedule.json').then(function(response) {

            var talks = response.data;

            /*
            this.days = _.transform(_.groupBy(talks, function(talk) {
                return _.capitalize(dateFilter(new Date(talk.event_start), 'EEEE'));
            }), function(result, talks, day) {
                result[day] = {
                    talks: _.groupBy(talks, 'format')
                };
                return result;
            });
            */

            this.agenda = {
                events: _.map(talks, function(talk) {
                    return {
                        title: talk.name,
                        format: talk.format,
                        description: talk.description,
                        speakers: talk.speakers,
                        start: talk.event_start,
                        end: talk.event_end,
                        color: trackDefinitions[talk.venue].color
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

