'use strict';

angular.module('programme', ['ngSanitize', 'hc.marked', 'ngLocale', 'ngAnimate', 'ui.bootstrap', 'ui.calendar'])
    .controller('ProgrammeCtrl', ['$scope', '$http', 'marked', 'dateFilter', '$uibModal', 'uiCalendarConfig', function($scope, $http, marked, dateFilter, $uibModal, uiCalendarConfig) {

        var formatDefinitions = this.formatDefinitions = [
            {format: 'Conf', label: 'Conférence', icon: 'fa-slideshare'},
            {format: 'TiA', label: 'Tool in Action', icon: 'fa-wrench'},
            {format: 'Univ', label: 'Université', icon: 'fa-terminal'},
            {format: 'Quickie', label: 'Quickie', icon: 'fa-clock-o'},
            {format: 'Lab', label: 'Lab', icon: 'fa-flask'},
            {format: 'Keynote', label: 'Keynote', icon: 'fa-user'},
            {format: 'Party', label: 'Party', 'icon': 'fa-glass'}
        ];

        var noDetailFormats = ['Party', 'Keynote'];

        var categoryColors = this.categoryColors = {
            'Objects connectés, IoT, Robotique': '#4B8865',
            'Cloud, DevOps, Outils': '#CA5132',
            'Agilité, Méthodologie et Tests': '#C9880F',
            'BigData et Analytics': '#BB283C',
            'Architecture, Performance et Sécurité': '#6B4162',
            'Java, JVM, Javas SE/EE': '#7F71CE',
            'Langages': '#6AAA3E',
            'Web': '#287F95',
            'Keynote': '#F55E52',
            'Other': '#AAAAAA'
        };

        var formats = _.indexBy(formatDefinitions, 'format');

        function renderTitle(event) {
            return '<span class="fa-stack" title="' + formats[event.format].label + '">' +
                '<i class="fa fa-square fa-stack-2x"></i>' +
                '<i style="color:' + event.color + ';" class="fa fa-stack-1x fa-inverse ' + formats[event.format].icon + '"></i> ' +
                '</span> ' + event.title +
                (event.room ? ' <em>(' + event.room + ')</em>' : '');
        }

        function refresh(calendar) {
            if (uiCalendarConfig.calendars[calendar]) {
                uiCalendarConfig.calendars[calendar].fullCalendar('refetchEvents');
            }
        }

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

        // filters key must match the event property the filter object aim to filter
        var filters = this.filters = {};
        // Category filter
        var categories = _.keys(categoryColors);
        filters.category = _.object(categories, _.map(categories, function() {
            return false;
        }));
        // Format filter
        filters.format = _.mapValues(formats, false);

        // watch filters
        _.each(filters, function(filterObject) {
            $scope.$watchCollection(function() {
                return filterObject;
            }, function() {
                refresh('calendar');
            });
        });

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

            function activeFilters() {
                return _.pick(filters, function(filterObject) {
                    return _.any(filterObject, Boolean);
                });
            }

            this.agenda = {
                events: function(start, end, timezone, callback) {
                    var filters = activeFilters();
                    callback(_.filter(_.map(talks, function(talk) {
                        return {
                            title: talk.name,
                            format: talk.format,
                            category: talk.event_type,
                            description: talk.description,
                            speakers: talk.speakers,
                            start: talk.event_start,
                            end: talk.event_end,
                            color: categoryColors[talk.event_type]
                        };
                    }), function(talk) {
                        return _.all(filters, function(filter, name) {
                            return filter[talk[name]];
                        });
                    }));
                }
            };
        }.bind(this));

        this.details = function(talk) {
            if (_.contains(noDetailFormats, talk.format)) {
                return;
            }
            $uibModal.open({
                templateUrl: 'talk-details.html',
                controller: function() {
                    this.talk = talk;
                    this.formats = formats;
                },
                controllerAs: 'detailsCtrl'
            });
        };

        $http.get('json/2016/speakers.json').then(function(response) {
            this.speakers = response.data;
        }.bind(this));

        this.detailsSpeaker = function(speaker) {
            $uibModal.open({
                templateUrl: 'talk-details-speaker.html',
                controller: function() {
                    this.speaker = speaker;
                },
                controllerAs: 'detailsCtrl'
            });
        };
    }]);
