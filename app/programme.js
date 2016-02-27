'use strict';

angular.module('programme', ['ngSanitize', 'hc.marked', 'ngLocale', 'ngAnimate', 'ui.bootstrap', 'ui.calendar'])
    .controller('ProgrammeCtrl', ['$scope', '$http', 'marked', 'dateFilter', '$uibModal', function($scope, $http, marked, dateFilter, $uibModal) {

        var formatDefinitions = this.formatDefinitions = [{format: 'Conf', label: 'Conférence', icon: 'fa-slideshare'},
            {format: 'TiA', label: 'Tool in Action', icon: 'fa-wrench'},
            {format: 'Univ', label: 'Université', icon: 'fa-terminal'},
            {format: 'Quickie', label: 'Quickie', icon: 'fa-clock-o'},
            {format: 'Lab', label: 'Lab', icon: 'fa-flask'}];

        var categoryColors = this.categoryColors = {
            'Objects connectés, IoT, Robotique': '#4B8865',
            'Cloud, DevOps, Outils': '#CA5132',
            'Agilité, Méthodologie et Tests': '#C9880F',
            'BigData et Analytics': '#BB283C',
            'Architecture, Performance et Sécurité': '#6B4162',
            'Java, JVM, Javas SE/EE': '#7F71CE',
            'Langages': '#6AAA3E',
            'Web': '#287F95',
            'Keynote': '#F55E52'
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

            console.log(_.uniq(_.map(talks, 'event_type')));

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
                        category: talk.event_type,
                        description: talk.description,
                        speakers: talk.speakers,
                        start: talk.event_start,
                        end: talk.event_end,
                        color: categoryColors[talk.event_type]
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

