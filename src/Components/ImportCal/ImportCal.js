import React, {Component} from "react";
import {GoogleLogin} from 'react-google-login';
import queryString from 'query-string';
import moment from "moment";
import connect from "react-redux/es/connect/connect";

import "./ImportCal.css";
import {Member} from "../../EarthBase/Member.js";
import {Meeting} from "../../EarthBase/Meeting.js";
import {fetchMeetingData, updateAllOtherCal, updateSelectCal} from "../../action";

import {Button, Checkbox, FormControlLabel, TextField, Typography} from "@material-ui/core";
import {Dialog, DialogTitle, DialogContent} from "@material-ui/core";
import {createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

/* global gapi */

const theme = createMuiTheme({
    typography: {
        fontSize: 16,
    },
});

export class ImportCal extends Component {

    constructor(props) {
        super(props);

        this.meetingDB = new Meeting();
        this.memberDB = new Member();

        this.state = {
            isLoaded: false,
            userId: undefined,
            meetingID: undefined,
            timeWindow: [],
            firstDate: undefined,
            lastDate: undefined,
            minTime: undefined,
            maxTime: undefined,
            rowNum: undefined,
            columnNum: undefined,
            offset: 30,
            mode: "none",
            auth: undefined,
            uploadFile: "n/a",
            eventMap: undefined
        };

        this.close = props.close.bind(this);
    }

    /****************** Initialization *******************/

    loadClient () {
        return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/calendar/v3/rest")
            .then(function () {
                    console.log("GAPI client loaded");
                },
                function (err) {
                    console.error("Error loading GAPI client", err);
                });
    }

    loadGapi (script) {
        if (!script.getAttribute('gapi_processed')) {
            setTimeout(() => {
                this.loadGapi(script)
            }, 100);
        }
    }

    fetchData() {       // From ViewMeeting.js

        const params = queryString.parse(this.props.location.search);
        const meetingID = params.meetingId;
        const userId = params.userId;

        if (meetingID === undefined || userId === undefined) {
            console.error("Invalid parameters");
            this.props.history.push("/");
            return;
        }

        this.meetingDB.fetchMeetingData(meetingID).then(data => {

            const timeWindow = data.timeWindow;
            const dates = data.dates;
            const rowNum = data.rowNum;

            if (dates.length === 0) {
                console.error("No meeting dates");
                this.close();
            }

            let latest=new Date(Math.max.apply(null, dates));
            let earliest=new Date(Math.min.apply(null, dates));

            latest.setDate(latest.getDate() + 1);
            const lastDate =latest.toISOString().split('.')[0]+"Z";
            const firstDate = earliest.toISOString().split('.')[0]+"Z";
            const minTime = new Date(timeWindow[0] * 60000).toISOString().substr(11, 5);
            const maxTime = new Date(timeWindow[1] * 60000).toISOString().substr(11, 5);

            let eventMap = new Map();
            let key;
            for (let i = 0; i < dates.length; ++i) {
                key = new Date(dates[i]).toISOString().substr(0, 10);
                eventMap.set(key, []);
            }

            this.setState({
                isLoaded: true,
                meetingID: meetingID,
                userId: userId,
                timeWindow: timeWindow,
                rowNum: rowNum,
                columnNum: dates.length,
                firstDate: firstDate,
                lastDate: lastDate,
                minTime: minTime,
                maxTime: maxTime,
                eventMap: eventMap
            });
        });
    }

    updateSelectCalData(data) {     // From ViewMeeting.js
        const userId = this.state.userId;
        if (userId !== undefined) {
            this.memberDB.updateMemberSelection(userId, data);
        }
    }

    componentDidMount() {

        this.fetchData();

        // Prepare Google API
        const script = document.createElement("script");
        script.src = "https://apis.google.com/js/api:client.js";
        document.body.appendChild(script);
        script.onload = () => {
            this.loadGapi(script);
        };
    }

    /********** Functions to import from Google **********/

    loginSuccess = (response) => {
        this.setState({
            auth : response.getAuthResponse(),
            mode : "google"
        });

        // Change Page
        document.getElementById("import_submit").disabled = false;

        let out = document.getElementById("out");
        out.innerHTML = "Import from Account: " + response.getBasicProfile().getEmail();
        out.style.color = "green";
    }

    loginFailure = (response) => {

        if (this.state.mode === "google") {
            this.setState({mode : "none"});
        }
        if (this.state.mode !== "file") {
            document.getElementById("import_submit").disabled = true;
        }

        let out = document.getElementById("out");
        out.innerHTML = "Unable to connect to Google Account";
        out.style.color = "red";

        // let code = response.error;
        // "idpiframe_initialization_failed"    Do nothing
        // "popup_closed_by_user"               Do nothing
        // "access_denied" 	                    Do nothing
        // "immediate_failed"                   Do nothing
    }

    logoutSuccess = (response) => {
        console.log("Log out successful");
    }

    handleGoogle = (callback) => {

        let out = document.getElementById("out");
        let allowAllDay = document.getElementById("all_day").checked;

        let timeMax = this.state.lastDate;
        let timeMin = this.state.firstDate;

        // Google Calendar API query
        gapi.client.calendar.events.list({
            "calendarId": "primary",
            "orderBy": "startTime",
            "showDeleted": false,
            "singleEvents": true,
            "timeMin": timeMin,
            "timeMax": timeMax,
            "maxResults": 9999,
            "alt": "json",
            "prettyPrint": true
        }).then((data) => {

            let start, end, block;
            let events = [];
            let results = data.result.items;

            for (let i = 0; i < results.length; i++) {
                block = results[i];
                start = block.start.dateTime;
                end = block.end.dateTime;

                // If dateTime field is missing, use date field
                if (!start) {
                    start = block.start.date;
                    end = block.end.date;
                }
                events = [...events, ...this.getEvents(start, end, allowAllDay)];
            }
            callback(events);

        }, function (err) {
            console.error("Execute error", err);
            out.innerHTML = "Error retrieving events from Google Calendar";
            out.style.color = "red";
        });
    }

    /********** Functions to import from ics File **********/

    selectUpload = (event) => {
        event.preventDefault();

        let file = event.target.files[0];

        // Cancel upload action
        if (!file) {
            return;
        }

        // Reset background color
        let out = document.getElementById("out");
        let submit_btn = document.getElementById("import_submit");

        // Validate File (using Magic Number)
        let fr = new FileReader();
        fr.onload = (e) => {
            try {
                let content = fr.result;
                const uInts = (new Uint8Array(content)).subarray(0,8);
                let signature = [];
                uInts.forEach((byte) => {
                    signature.push(byte.toString(16))
                });
                signature = signature.join('').toUpperCase();

                if (signature === "424547494E3A5643") {     // ics
                    this.setState({
                        uploadFile : file,
                        mode : "file"
                    });

                    submit_btn.disabled = false;
                    out.innerHTML = "Import from File: " + file.name;
                    out.style.color = "green";

                } else {
                    if (this.state.mode === "file")
                        this.setState({mode : "none"});

                    if (this.state.mode !== "google")
                        submit_btn.disabled = true;

                    out.innerHTML = "Invalid iCalendar file: " + file.name;
                    out.style.color = "red";
                }
            } catch (err) {
                console.log(err);
            }
        };
        fr.onerror = (e) => {
            console.log(e);
        };
        fr.readAsArrayBuffer(file);
    }

    handleUpload = (callback) => {

        let out = document.getElementById("out");
        let submit_btn = document.getElementById("import_submit");
        let allowAllDay = document.getElementById("all_day").checked;

        let events = [];
        let fr = new FileReader();

        fr.onload = (e) => {
            try {
                let content = fr.result;
                const ical = require('ical.js');
                let data_parsed = ical.parse(content);
                let start, end;
                let earliest = new Date(this.state.firstDate).getTime();    // Inclusive
                let latest = new Date(this.state.lastDate).getTime();       // Exclusive

                let comp = new ical.Component(data_parsed);
                const vEvents = comp.getAllSubcomponents("vevent");

                vEvents.forEach((vevent) => {
                    const event = new ical.Event(vevent);

                    if (!event.isRecurring()) {
                        start = event.startDate.toJSDate();
                        end = event.endDate.toJSDate();

                        events = [...events, ...this.getEvents(start, end, allowAllDay)];

                    } else {
                        let recur = vevent.getFirstPropertyValue("rrule");
                        let dtstart = vevent.getFirstPropertyValue("dtstart");
                        let iter = recur.iterator(dtstart);
                        let next = iter.next();
                        let recLimit = 1095;                      // Max 3 year
                        let n = 1;

                        while (next && n < recLimit) {
                            let rstart = event.getOccurrenceDetails(next).startDate.toJSDate();
                            let estart = event.getOccurrenceDetails(next).endDate.toJSDate();
                            next = iter.next();

                            // Ignore everything before first day, End after last day
                            if (rstart.getTime() < earliest) {
                                continue;
                            } else if (rstart.getTime() >= latest) {
                                break;
                            }
                            events = [...events, ...this.getEvents(rstart, estart, allowAllDay)];
                            ++n;
                        }
                    }
                }, this);
                callback(events);
            } catch (err) {
                console.log(err);
                this.setState({mode : "none"});
                submit_btn.disabled = true;
                out.innerHTML = "Failed to process file: " + this.state.uploadFile.name;
                out.style.color = "red";
            }
        };
        fr.onerror = (e) => {
            console.log(e);
            this.setState({mode : "none"});
            submit_btn.disabled = true;
            out.innerHTML = "Failed to process file: " + this.state.uploadFile.name;
            out.style.color = "red";
        };
        fr.readAsText(this.state.uploadFile);
    }

    getEvents = (start, end, allowAllDay) => {
        let startMoment = moment(start, ['YYYY-MM-DDTHH:mm:ss', 'YYYY-MM-DDTHH:mm:ssZ', 'YYYY-MM-DDTHH:mm:ss+-HH:mm', 'YYYY-MM-DD'], true);
        let endMoment = moment(end, ['YYYY-MM-DDTHH:mm:ss', 'YYYY-MM-DDTHH:mm:ssZ', 'YYYY-MM-DDTHH:mm:ss+-HH:mm', 'YYYY-MM-DD'], true);

        // If invalid format, skip
        if (!startMoment.isValid() || !endMoment.isValid()) {
            return [];
        }

        // General all day event spanning more than 12hr
        else if (!allowAllDay && (endMoment.diff(startMoment, "hours") >= 12 || startMoment.isSame(endMoment))) {
            return [];
        }

        return this.splitDates(startMoment, endMoment);

    }

    /********** Functions to process data **********/

    splitDates = (s, e) => {
        // Split event into dates and process them

        let dates = [];
        let obj = {};
        let start = s;
        let end = e;
        let key = start.format("YYYY-MM-DD");

        if (start.isSame(end) && this.state.eventMap.has(key)) {
            obj.startMoment = start;
            obj.endMoment = moment(start).endOf("day");
            dates.push(obj);

            return dates;
        }

        while (start.isBefore(end, 'day')) {
            if (this.state.eventMap.has(key)) {
                obj = {};
                obj.startMoment = start;
                obj.endMoment = moment(start).endOf("day");
                dates.push(obj);
            }
            start = moment(start).add(1, 'day').startOf("day");
            key = start.format("YYYY-MM-DD");
        }

        if (!start.isSame(end) && this.state.eventMap.has(key)) {
            obj = {};
            obj.startMoment = start;
            obj.endMoment = end;
            dates.push(obj);
        }
        return dates;
    }

    toMinutes = (time_string) => {
        // Convert string "HH:MM:ss" to minutes
        let part = time_string.split(':');
        return parseInt(part[0]) * 60 + parseInt(part[1], 10);
    }

    handleImport = (event) => {
        event.preventDefault();

        /* Process Data */
        const processData = (mList) => {

            let time_offset = (document.getElementById("toff").checked) ? this.state.offset : 0;
            let key, block, start, end, eventList;

            let [min_h, min_m] = this.state.minTime.split(":");
            let [max_h, max_m] = this.state.maxTime.split(":");
            let min = this.toMinutes(this.state.minTime);
            let max = this.toMinutes(this.state.maxTime);

            // Loop through every event block
            for (let i = 0; i < mList.length; ++i) {
                block = mList[i];
                start = block.startMoment;
                end = block.endMoment;
                key = start.format("YYYY-MM-DD");
                let minMoment = moment(start).set({'hour' : min_h, 'minute' : min_m});
                let maxMoment = moment(start).set({'hour' : max_h, 'minute' : max_m});

                if (!this.state.eventMap.has(key)) {
                    continue;
                }

                eventList = this.state.eventMap.get(key);

                // Apply offset values
                start = moment
                    .max(moment(start).subtract(time_offset, 'minutes'), minMoment)
                    .diff(moment(key).startOf('day'), 'minutes');
                end = moment.min(moment(end)
                    .add(time_offset, 'minutes'), maxMoment)
                    .diff(moment(key).startOf('day'), 'minutes');

                if (min <= start && max >= end) {
                    eventList.push([ start, end ]);
                }
            }
            block = null;

            this.convertToTimeSlots();

            // Close Popup
            this.close();
        }

        if (this.state.mode === "file") {
            this.handleUpload(processData);
        }
        else if (this.state.mode === "google") {
            this.handleGoogle(processData);
        }
        else {
            console.log("ERROR: NO MODE SELECTED");
        }
    }

    convertToTimeSlots = () => {

        let eventMap = this.state.eventMap;
        const timeWindow = this.state.timeWindow;
        let start_index, end_index, i = 0;
        let interval = (timeWindow[1]-timeWindow[0])/this.state.rowNum;
        let timeTable = Array(this.state.rowNum).fill().map(() => Array(this.state.columnNum).fill(1));

        //console.log(eventMap);

        for (const [date, events] of eventMap.entries()) {              // For each key in eventMap
            for (const event of events) {
                start_index = Math.floor((event[0] - timeWindow[0]) / interval);
                end_index = Math.ceil((event[1] - timeWindow[0]) / interval);

                // Set to 0 : busy for slots between start index and end_index
                for (let j = start_index; j < end_index; ++j) {
                    timeTable[j][i] = 0;
                }
            }
            ++i;
        }

        // Send to Database
        this.updateSelectCalData(JSON.stringify(timeTable));
        this.setState({});
    };

    /******* Functions used for UI *******/

    setValue = (event, key, defVal) => {
        let elem = event.target;
        if (elem.value.length !== 0 && elem.checkValidity())
            this.setState({[key] : elem.value});
        else
            this.setState({[key] : defVal});
    }

    toggleHidden = (id, action) => {
        let elem = document.getElementById(id);

        if (action === undefined)
            elem.hidden = !elem.hidden;
        else
            elem.hidden = (action === "hide");
    }

    /*************************************/

    render() {
        if (!this.state.isLoaded) {
            return <div>Loading Page ...</div>
        } else {
            return (
                <div>
                    <ThemeProvider theme={theme}>
                        <Dialog id="import_schedule" onClose={this.close} open={true} theme={theme}>
                            <a id="import_close" onClick={this.close} title={"Close"}>&#10006;</a>
                            <DialogTitle id="import_header" onClose={this.close}>
                                Import Schedule
                            </DialogTitle>
                            <DialogContent dividers>
                                <form onSubmit={this.handleImport}>
                                    <Typography>Select Import Method:</Typography>
                                    <fieldset className="import_file">
                                        <label htmlFor="uploadFile">
                                            <Button
                                                className="mode"
                                                id="calFile"
                                                component="span"
                                                display="block"
                                                variant="outlined"
                                                color="primary"
                                                size="large"
                                            >Upload File (ics)
                                            </Button>
                                        </label>
                                        <input type="file" id="uploadFile" accept=".ics" onChange={(e) => {this.selectUpload(e)}}/>

                                        <GoogleLogin
                                            render={renderProps => (
                                                <Button className="mode" id="calGoogle" onClick={renderProps.onClick}
                                                        disabled={renderProps.disabled} color="primary" variant="outlined"
                                                        size="large" display="block">Google Calendar</Button>)}
                                            clientId="926207137800-ogujdec6vo9oo1fun7mreedha60l7ude.apps.googleusercontent.com"
                                            discoveryDocs="https://content.googleapis.com/discovery/v1/apis/calendar/v3/rest"
                                            buttonText="Login"
                                            scope="https://www.googleapis.com/auth/calendar.readonly"
                                            theme="dark"
                                            responseType="token"
                                            onRequest={this.loadClient}
                                            onSuccess={this.loginSuccess}
                                            onFailure={this.loginFailure}
                                            cookiePolicy={'single_host_origin'}/>
                                    </fieldset>

                                    <Typography>Import Options</Typography>
                                    <fieldset className="import_option">
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    id="toff"
                                                    onChange={() => this.toggleHidden("time_offset", "hide")}
                                                    value={this.state.offset}
                                                    color="primary"
                                                />}
                                            label="Add offset time (min): "
                                        />
                                        <Typography style={{display: 'inline-block'}}>
                                            <output onClick={() => this.toggleHidden("time_offset")}>{this.state.offset}</output>
                                        </Typography>
                                        <br/>

                                        <div id="time_offset" hidden>
                                            <FormControlLabel
                                                labelPlacement="start"
                                                label="Change Value (min) :"
                                                control={
                                                    <TextField id="ntoff"
                                                               name="offset"
                                                               variant="standard"
                                                               onChange={(e) => this.setValue(e, "offset", 30)}
                                                               inputProps={{
                                                                   maxLength: 3,
                                                                   pattern: "[0-9]*",
                                                                   style: {fontSize: 12}
                                                               }}
                                                    />}
                                            />
                                        </div>

                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    id="all_day"
                                                    color="primary"
                                                />
                                            }
                                            label="Include all day events "
                                        />
                                        <br />
                                    </fieldset>

                                    <fieldset id="import_output">
                                        <output id="out">Note: This will overwrite your current selections</output>
                                        <div id="import_buttons">
                                            <button id="import_submit" type="submit" disabled={true}>Import</button>
                                        </div>
                                    </fieldset>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </ThemeProvider>
                </div>
            )}};
}

// From View Meeting
const mapDispatchToProps = dispatch => {
    return {
        updateSelectTableData: data => {
            dispatch(updateSelectCal(data));
        },
        updateAllOtherData: data => {
            dispatch(updateAllOtherCal(data));
        },
        fetchMeetingData: (prom) => {
            dispatch(fetchMeetingData(prom));
        }
    };
}

// From View Meeting
const mapStateToProps = state => {
    return {
        meeting: state.meeting,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ImportCal);