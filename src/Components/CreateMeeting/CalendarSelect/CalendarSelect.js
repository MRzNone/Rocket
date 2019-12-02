import React from 'react';
import moment from 'moment';
import './CalendarSelect.css';

function indexOfDate(arr, day) {
    for (let i in arr) {
        if (arr[i].date.isSame(day.date)) {
            return i;
        }
    }
    return -1;
}

class Calendar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            month: moment(),
            selected: []
        };


        this.previous = this.previous.bind(this);
        this.next = this.next.bind(this);
    }

    previous() {
        const {
            month } =
            this.state;

        this.setState({
            month: month.subtract(1, 'month')
        });

    }

    next() {
        const {
            month } =
            this.state;

        this.setState({
            month: month.add(1, 'month')
        });

    }

    select(day) {
        const newSelected = Array.from(this.state.selected);
        const index = indexOfDate(newSelected, day);
        if (index !== - 1) {
            newSelected.splice(index, 1);
        } else {
            newSelected.push(day);
        }

        this.props.updateSelected(newSelected);

        this.setState({
            selected: newSelected,
            month: day.date.clone()
        });

    }

    renderWeeks() {
        let weeks = [];
        let done = false;
        let date = this.state.month.clone().startOf("month").add("w" - 1).day("Sunday");
        let count = 0;
        let monthIndex = date.month();

        const {
            selected,
            month } =
            this.state;

        while (!done) {
            weeks.push(
                React.createElement(Week, {
                    key: date,
                    date: date.clone(),
                    month: month,
                    select: day => this.select(day),
                    selected: selected
                }));


            date.add(1, "w");

            done = count++ > 2 && monthIndex !== date.month();
            monthIndex = date.month();
        }

        return weeks;
    }

    renderMonthLabel() {
        const {
            month } =
            this.state;

        return React.createElement("span", { className: "month-label" }, month.format("MMMM YYYY"));
    }

    render() {
        return (
            React.createElement("section", { className: "calendar" },
                React.createElement("header", { className: "header" },
                    React.createElement("div", { className: "month-display row" },
                        React.createElement("i", { className: "arrow fa fa-angle-left", onClick: this.previous }),
                        this.renderMonthLabel(),
                        React.createElement("i", { className: "arrow fa fa-angle-right", onClick: this.next })),

                    React.createElement(DayNames, null)),


                this.renderWeeks()));


    }
}


class DayNames extends React.Component {
    render() {
        return (
            React.createElement("div", { className: "row day-names" },
                React.createElement("span", { className: "day" }, "Sun"),
                React.createElement("span", { className: "day" }, "Mon"),
                React.createElement("span", { className: "day" }, "Tue"),
                React.createElement("span", { className: "day" }, "Wed"),
                React.createElement("span", { className: "day" }, "Thu"),
                React.createElement("span", { className: "day" }, "Fri"),
                React.createElement("span", { className: "day" }, "Sat")));
    }
}


class Week extends React.Component {
    render() {
        let days = [];
        let {
            date } =
            this.props;

        const {
            month,
            selected,
            select } =
            this.props;

        for (let i = 0; i < 7; i++) {
            let day = {
                name: date.format("dd").substring(0, 1),
                number: date.date(),
                isCurrentMonth: date.month() === month.month(),
                isToday: date.isSame(new Date(), "day"),
                date: date
            };

            days.push(
                React.createElement(Day, {
                    key: 'day-' + i,
                    day: day,
                    selected: selected,
                    select: select
                }));


            date = date.clone();
            date.add(1, "day");
        }

        return (
            React.createElement("div", { className: "row week", key: days[0] },
                days));


    }
}

class Day extends React.Component {
    render() {
        const {
            day,
            day: {
                date,
                isCurrentMonth,
                isToday,
                number },

            select,
            selected } =
            this.props;

        return (
            React.createElement("span", {
                key: date.toString(),
                className: "day" + (isToday ? " today" : "") + (isCurrentMonth ? "" : " different-month") + (indexOfDate(selected, day) !== -1 ? " selected" : ""),
                onClick: () => select(day)
            }, number));

    }
}

export default Calendar;