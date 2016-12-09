import observable = require("data/observable");
import pages = require("ui/page");
import moment = require("moment");

import {CalendarService} from '../../shared/calendar.service';

// Event handler for Page "loaded" event attached in main-page.xml
export function pageLoaded(args: observable.EventData) {

    let page = <pages.Page>args.object;

    let source = new observable.Observable({
        months: {
            current: {
                events: [],
                hoursWorked: 0,
            },
            last: {
                events: [],
                hoursWorked: 0,
            }
        }
    });

    Promise
        .all([
            getWorkEvents(moment().month() - 1),
            getWorkEvents(moment().month())
        ])
        .then(function (data) {
            let last = data[0];
            let current = data[1];

            source.set("months", {
                last: last,
                current: current
            });
        });

    page.bindingContext = source;
}

export function getWorkEvents(month) {

    return CalendarService
        .fetchWorkingEventsInMonth(month)
        .then(events => {

            let workedHours = CalendarService.workingHoursFromEvents(events);
            let projectedWorkingHours = CalendarService.prognosedWorkingHoursIn(month);

            return {
                events,
                summary: Math.round(workedHours) + " von " + projectedWorkingHours + " Stunden",
            }
        })
        .catch((error) => {
            console.log("Calendar permission denied. ", error);
        });
}