import {Config} from './config';

import moment = require('moment');
import business = require("moment-business");

import Calendar = require('nativescript-calendar');

export class CalendarService {

    static fetchWorkingEventsBetween(start, end) {
        return Calendar.findEvents({
            title: Config.calendarTitle,
            notes: Config.calendarNote,
            startDate: start.toDate(),
            endDate: end.toDate()
        });
    }

    static fetchDaysOfLeaveInMonth(month: number) {
        let dateRange = CalendarService.monthDateRange(2016, month);
        return Calendar.findEvents({
            title: 'Urlaub',
            startDate: dateRange.start.toDate(),
            endDate: dateRange.end.toDate()
        });
    }

    static fetchWorkingEventsInMonth(month: number) {
        let dateRange = CalendarService.monthDateRange(2016, month);

        let enrichEvent = event => {

            event.startDate = moment(event.startDate);
            event.endDate = moment(event.endDate);

            let duration = event.endDate.diff(event.startDate);
            event.duration = moment.duration(duration);
            event.tDuration = moment.duration(duration).humanize();

            event.tDuration = Math.floor(event.duration.asHours()) + moment.utc(event.duration.asMilliseconds()).format(":mm")


            return event;
        };

        return CalendarService
            .fetchWorkingEventsBetween(dateRange.start, dateRange.end)
            .then(events => {
                return events.map(enrichEvent)
            })
    }

    static businessDaysInMonth(month: number) {
        let dateRange = CalendarService.monthDateRange(2016, month);
        return business.weekDays(dateRange.start, dateRange.end);
    }

    static workingHoursFromEvents(events): number {
        return events.reduce((hoursWorked, event) => {
            return hoursWorked.add(event.duration);
        }, moment.duration()).asHours();
    }

    static prognosedWorkingHoursIn(month: number) {
        let weekDaysInMonth = CalendarService.businessDaysInMonth(month);
        CalendarService
            .fetchDaysOfLeaveInMonth(month)
            .then(events => events.reduce((sum, event) => {

                if(event.allDay){
                    var duration = moment(event.startDate).diff(moment(event.endDate));

                }
                return sum;
            }, 0));

        return Math.abs(weekDaysInMonth * Config.workingHours);
    }

    static monthDateRange(year: number, month: number) {
        let startDate = moment([year, month]);
        let endDate = moment(startDate).endOf('month');

        return {
            start: startDate,
            end: endDate
        };
    }
}