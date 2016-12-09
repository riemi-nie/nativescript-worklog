// import fetchModule = require("fetch");
import observable = require("data/observable");
import observableArray = require("data/observable-array");

export class CalendarEventsViewModel {

    viewModel

    constructor() {
        this.viewModel = new observable.Observable({
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
    }
}