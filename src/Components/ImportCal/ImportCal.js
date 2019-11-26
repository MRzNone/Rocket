import React, {Component} from "react";
import "./ImportCal.css";
import {GoogleLogin, GoogleLogout} from 'react-google-login';
import {Member} from "../../EarthBase/Member.js";
import {Meeting} from "../../EarthBase/Meeting.js";
import queryString from 'query-string';
import moment from "moment";

/* global gapi */

export class ImportCal extends Component {
    constructor(props) {
        super(props);

//        this.meetingDB = new Meeting();
//        this.memberDB = new Member();

        this.state = {
            memberId: undefined,
            meetingID: undefined,
            meetingDates: ["2019-06-02", "2019-06-03", "2019-06-05", "2019-06-06"],     // GET dates FROM DATABASE
            firstDate: undefined,
            lastDate: undefined,
            minTime: undefined,     // meeting specified min
            maxTime: undefined,     // meeting specified max
            rowNum: undefined,
            offset: 30,
            startTime: undefined,   // user specified min
            endTime: undefined,     // user specified max
            days: [0, 0, 0, 0, 0, 0, 0],
            mode: "none",
            auth: undefined,
            uploadFile: "n/a",
            timeSlots: [],          // TODO: SEND TO DATABASE (timeSlots)
            date: null
        }

        this.close = props.close.bind(this);
    }


    // TODO: Function that needs to send output to database
    convertToTimeSlots = (eventMap) => {

        // TEST
        const timeWindow = [300, 900];
        let start_index, end_index, i = 0;

        // rowNum x meetingDates.length, Default value 1
        let timeTable = Array(this.state.rowNum).fill().map(() => Array(this.state.meetingDates.length).fill(1));

        for (const [date, events] of eventMap.entries()) {              // For each key in eventMap
            //console.log("DATE: " + date);

            for (const event of events) {
                //console.log("EVENT: " + event);
                //console.log("TIME WINDOW: " + timeWindow);
                start_index = Math.floor((event[0] - timeWindow[0]) / this.state.rowNum);
                end_index = Math.ceil((event[1] - timeWindow[0]) / this.state.rowNum);

                console.log(start_index + "," + end_index);

                // Set to 0 : busy for slots between start index and end_index
                for (let j = start_index; j < end_index; ++j) {
                    timeTable[j][i] = 0;
                }
            }
            ++i;
        }

        console.log(JSON.stringify(timeTable));

        // TODO: OUTPUT
        this.setState({timeSlots : JSON.stringify(timeTable)});

        // SEND TO DATABASE





    };


    /****************** Initialization *******************/

    // Needed for Google Calendar API
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

    componentDidMount() {

        // TODO: Get meeting data (timeWindow, rowNum, dates)
        //
        //
        //
        //
        //
        //


        // Assuming first is earliest, Assuming last is latest
        let td = new Date(this.state.meetingDates.slice(-1)[0]);
        td.setDate(td.getDate() + 1);
        const lastDate =td.toISOString().split('.')[0]+"Z";
        const firstDate = new Date(this.state.meetingDates[0]).toISOString().split('.')[0]+"Z";

        const minTime = new Date(300 * 60000).toISOString().substr(11, 5);             // GET timeWindow[0]     // 300
        const maxTime = new Date(900 * 60000).toISOString().substr(11, 5);             // GET timeWindow[1]     // 900
        const rowNum = 46;

        this.setState({
            firstDate: firstDate,
            lastDate: lastDate,
            startTime: minTime,
            endTime: maxTime,
            maxTime: maxTime,
            minTime: minTime,
            rowNum: rowNum
        });

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
        document.getElementById('calGoogle').style.backgroundColor = "#BEF990";
        document.getElementById('calFile').style.backgroundColor = "#f9f6f4";
        document.getElementById("import_submit").disabled = false;

        let out = document.getElementById("out");
        out.innerHTML = "Import from Account: " + response.getBasicProfile().getEmail();
        out.style.color = "green";
    }

    loginFailure = (response) => {

        if (this.state.mode === "google") {
            this.setState({mode : "none"});
            document.getElementById('calGoogle').style.backgroundColor = "#f9f6f4";
        }

        if (this.state.mode !== "file")
            document.getElementById("import_submit").disabled = true;

        let out = document.getElementById("out");
        out.innerHTML = "Failed to fetch data from Google Account";
        out.style.color = "red";

        // Handle Error
        let code = response.error;
        if (code === "idpiframe_initialization_failed") {
            alert("Please enable third party cookies");
        } else {
            // "popup_closed_by_user"   Do nothing
            // "access_denied" 	        Do nothing
            // "immediate_failed"       Do nothing
        }
    }

    // DEBUG
    logoutSuccess = (response) => {
        alert("Log out successful");
    }

    // Fetch Event Data using Calendar API
    handleGoogle = (callback) => {

        let glist = [];
        let out = document.getElementById("out");
        let allowAllDay = document.getElementById("all_day").checked;

        let timeMax = this.state.lastDate;
        let timeMin = this.state.firstDate;

        console.log(timeMin);
        console.log(timeMax);


        gapi.client.calendar.events.list({
            "calendarId": "primary",
            "orderBy": "startTime",
            "showDeleted": false,
            "singleEvents": true,
            "timeMin": timeMin,     // Earliest start time (inclusive)
            "timeMax": timeMax,     // Latetst start time (exclusive
            "alt": "json",
            "prettyPrint": true
        }).then(function (data) {

            // Process Data
            let events = data.result.items;
            let start, end, block;

            for (let i = 0; i < events.length; i++) {
                block = events[i];

                //let title = block.summary;     // Event Name
                start = block.start.dateTime;     // Start Datetime
                end = block.end.dateTime;        // End Datetime

                // IF exclude all day && isAllDay
                if (!start) {
                    start = block.start.date;
                    end = block.end.date;
                }

                let startMoment = moment(start, ['YYYY-MM-DDTHH:mm:ssZ', 'YYYY-MM-DDTHH:mm:ss+-HH:mm', 'YYYY-MM-DD'], true);
                let endMoment = moment(end, ['YYYY-MM-DDTHH:mm:ssZ', 'YYYY-MM-DDTHH:mm:ss+-HH:mm', 'YYYY-MM-DD'], true);

                // If invalid format, skip
                if (!startMoment.isValid() || !endMoment.isValid())
                    continue;

                // General all day event spanning more than 12hr
                else if (!allowAllDay && (startMoment.diff(endMoment, "hours") >= 12 || startMoment.isSame(endMoment)))
                    continue;

                glist = [...glist, ...ImportCal.splitDates(startMoment, endMoment)];
            }

            callback(glist);

        }, function (err) {
            // Handle Errors
            console.error("Execute error", err);
            out.innerHTML = "Error retrieving events from Google Calendar";
            out.style.color = "red";

        });
        return glist;
    }

    /********** Functions to import from upload **********/

    selectUpload = (event) => {
        event.preventDefault();

        let file = event.target.files[0];

        if (!file) {
            // Cancel
            return;
        }

        // Reset background color
        let upload_btn = document.getElementById('calFile');
        let out = document.getElementById("out");
        let submit_btn = document.getElementById("import_submit");
        upload_btn.style.backgroundColor = "#f9f6f4";

        // TODO: CHECK FILE TYPE (MIME type, magic number)
        let isValid = true;


        if (isValid) {
            this.setState({
                uploadFile : file,
                mode : "file"
            });

            document.getElementById("calFile").style.backgroundColor = "#BEF990";
            document.getElementById('calGoogle').style.backgroundColor = "#f9f6f4";
            submit_btn.disabled = false;

            // Output Message
            out.innerHTML = "Import from File: " + file.name;
            out.style.color = "green";

        } else {
            if (this.state.mode === "file")
                this.setState({mode : "none"});

            if (this.state.mode !== "google")
                submit_btn.disabled = true;

            out.innerHTML = "Not valid ics file: " + file.name;
            out.style.color = "red";
        }
    }

    handleUpload = (callback) => {

        let out = document.getElementById("out");
        let submit_btn = document.getElementById("import_submit");
        let allowAllDay = document.getElementById("all_day").checked;

        let dateList = [];
        let fr = new FileReader();
        fr.onload = (e) => {
            try {
                let content = fr.result;
                const ical = require('ical.js');
                let data_parsed = ical.parse(content);
                let obj, start, end, startMoment, endMoment;

                // Get datetime start and end
                for (let i = 0; i < data_parsed[2].length; ++i) {
                    obj = {};
                    start = data_parsed[2][i][1][0][3];
                    end = data_parsed[2][i][1][1][3];

                    startMoment = moment(start, ['YYYY-MM-DDTHH:mm:ssZ', 'YYYY-MM-DDTHH:mm:ss+-HH:mm', 'YYYY-MM-DD'], true);
                    endMoment = moment(end, ['YYYY-MM-DDTHH:mm:ssZ', 'YYYY-MM-DDTHH:mm:ss+-HH:mm', 'YYYY-MM-DD'], true);

                    // If invalid format, skip
                    if (!startMoment.isValid() || !endMoment.isValid())
                        continue;

                    // General all day event spanning more than 12hr
                    else if (!allowAllDay && (endMoment.diff(startMoment, "hours") >= 12 || startMoment.isSame(endMoment)))
                        continue;

                    dateList = [...dateList, ...this.splitDates(startMoment, endMoment)];
                }
                callback(dateList);
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

    /********** Functions to process data **********/

    static splitDates = (s, e) => {

        // Split event into dates and process them

        let dates = [];
        let obj = {};
        let start = s;
        let end = e;
        let i = 0;

        if (start.isSame(end)) {
            obj.debug = i++;
            obj.startMoment = start;
            obj.endMoment = moment(start).endOf("day");
            dates.push(obj);

            return dates;
        }

        while (start.isBefore(end, 'day')) {
            obj = {};
            obj.debug = i++;
            obj.startMoment = start;
            obj.endMoment = moment(start).endOf("day");
            dates.push(obj);
            start = moment(start).add(1, 'day').startOf("day");

        }

        if (!start.isSame(end)) {
            obj = {};
            obj.debug = i++;
            obj.startMoment = start;
            obj.endMoment = end;
            dates.push(obj);
        }

        return dates;
    }

    toMinutes = (time_string) => {
        let part = time_string.split(':');          // HH:MM:ss
        return parseInt(part[0]) * 60 + parseInt(part[1], 10);
    }

    handleImport = (event) => {
        event.preventDefault();

        /* Process Data */
        const processData = (mList) => {

            console.log(this.state.meetingDates);

            // Check if specific days were selected
            let enable_anyday = this.state.days.every(n => n === 0);
            let time_offset = (document.getElementById("toff").checked) ? this.state.offset : 0;
            let key, block, start, end, eventList, date;

            let [min_h, min_m] = this.state.minTime.split(":");
            let [max_h, max_m] = this.state.maxTime.split(":");
            let min = this.toMinutes(this.state.minTime);
            let max = this.toMinutes(this.state.maxTime);

            //console.log("min_h: " + min_h + "min_m: " + min_m + "max_h: " + max_h + "max_m: " + max_m + "minMoment: " + minMoment.format("YYYY-DD-MM_HHmmss") + "maxMoment: " + maxMoment.format("YYYY-DD-MM_HHmmss"));

            let outList = [];

            // Create map for meeting days
            let meetingMap = new Map();

            // Default values are user earliest/latest availability
            for (let j = 0; j < this.state.meetingDates.length; ++j) {
                let content = [];
                let start = this.toMinutes(this.state.startTime);
                let end = this.toMinutes(this.state.endTime);
                let d = this.state.meetingDates[j];

                meetingMap.set(d, content);

                if (min < start) {
                    content.push([min, start]);
                    console.log("MIN: " + this.state.minTime + " < " + "START: " + this.state.startTime);
                }
                if (end < max) {
                    content.push([end, max]);
                    console.log("END: " + this.state.endTime + " < " + "MAX: " + this.state.maxTime);
                }
            }

            // Loop through every event block
            for (let i = 0; i < mList.length; ++i) {
                block = mList[i];
                start = block.startMoment;
                end = block.endMoment;
                key = start.format("YYYY-MM-DD");
                let minMoment = moment(start).set({'hour' : min_h, 'minute' : min_m});
                let maxMoment = moment(start).set({'hour' : max_h, 'minute' : max_m});

                // Skip irrelevant date
                if (!meetingMap.has(key)) {
                    continue;
                }
                eventList = meetingMap.get(key);


                // Filter out non-selected days
                if (enable_anyday || this.state.days[start.day()]) {


                    // Apply offset values
                    start = moment
                        .max(moment(start).subtract(time_offset, 'minutes'), minMoment)
                        .diff(moment(key).startOf('day'), 'minutes');
                    end = moment.min(moment(end)
                        .add(time_offset, 'minutes'), maxMoment)
                        .diff(moment(key).startOf('day'), 'minutes');

                    console.log("DATE: " + key + ", START: " + new Date(start * 60000).toISOString().substr(11, 5) + ", END: " + new Date(end * 60000).toISOString().substr(11, 5));

                    //console.log(moment().startOf('day'));

                    if (min < start && max > end) {
                        eventList.push([ start, end ]);
                    }
                }
                block = null;
            }

            // Convert Map to list
            //outList = Array.from(meetingMap.values());

            this.convertToTimeSlots(meetingMap);

            // Close Popup
            this.close();
        }

        if (this.state.mode === "file") {
            this.handleUpload(processData);
        }
        else if (this.state.mode === "google") {
            this.handleGoogle(processData);
            //this.state.auth.signOut();
            //this.state.auth.disconnect();
        }
        else {
            console.log("ERROR: NO MODE SELECTED");
        }
    }

    /******* Functions used for UI *******/

    // Calls appropriate set functions
    setValue = (event, key, defVal) => {
        let el = event.target;
        if (el.value.length !== 0 && el.checkValidity())
            this.setState({[key] : el.value});
        else
            this.setState({[key] : defVal});
    }

    // Helper function used to toggle hidden state of tags
    toggleHidden = (id, action) => {
        let t = document.getElementById(id);

        if (action === undefined)
            t.hidden = !t.hidden;
        else
            t.hidden = (action === "hide");
    }

    // Helper function used to reset day selection
    resetDays = () => {
        console.log(this.state.days);
        let children = document.getElementById("import_days").children;
        for (let i = 0; i < children.length; ++i) {
            if (children[i].type === "checkbox")
                children[i].checked = false;
        }
        this.setState({days : [0, 0, 0, 0, 0, 0, 0]});
    }

    updateDays = (index) => {
        let arr = [...this.state.days];
        arr[index] = arr[index] ? 0 : 1;
        this.setState({days : [...arr]});
        console.log(this.state.days);
    }

    /*************************************/

    render() {
        return (
        <div className="popup_wrapper">
            <header>
                <h1>Import Calendar</h1>
                <a className="close" onClick={this.close} title={"Close"}>&#10006;</a>
            </header>
            <main>
                <form onSubmit={this.handleImport}>
                    <fieldset className="import_file">

                        <label htmlFor="uploadFile" className="mode" id="calFile">
                            Upload File
                            <input type="file" id="uploadFile" accept=".ics" onChange={(e) => {
                                this.selectUpload(e)
                            }}/>
                        </label>

                        <GoogleLogin
                            render={renderProps => (
                                <button className="mode" id="calGoogle" onClick={renderProps.onClick}
                                        disabled={renderProps.disabled}>Import Google Calendar</button>)}
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

                    <fieldset className="import_option">
                        <legend>Import Options</legend>

                        <input type="checkbox" id="toff" name="time_offset" value={this.state.offset}
                               onClick={() => this.toggleHidden("time_offset", "hide")}/>
                        <label htmlFor="toff"> Add offset time (min): </label>
                        <output onClick={() => this.toggleHidden("time_offset")}>
                            {this.state.offset}</output>
                        <br/>
                        <div id="time_offset" hidden>
                            <label htmlFor="ntoff"> Change Value (min): </label>
                            <input id="ntoff" type="text" name="offset" pattern="\d*" maxLength="3"
                                   onChange={(e) => this.setValue(e, "offset", 30)}/>
                        </div>

                        <input type="checkbox" id="tran" name="time_range" value={[this.state.startTime, this.state.endTime]}
                               onClick={() => this.toggleHidden("time_range", "hide")}/>
                        <label htmlFor="tran"> Only free between: &nbsp;</label>
                        <output onClick={() => this.toggleHidden("time_range")}>
                            {this.state.startTime} - {this.state.endTime}</output>
                        <br/>
                        <div id="time_range" hidden>
                            <label> Free after:&nbsp;&nbsp;<input type="time" min={this.state.minTime} max={this.state.maxTime}
                                                                  onChange={(e) => this.setValue(e, "startTime", this.state.minTime)}/></label><br/>
                            <label> Free before:&nbsp;<input type="time" min={this.state.minTime} max={this.state.maxTime}
                                                             onChange={(e) => this.setValue(e, "endTime", this.state.maxTime)}/></label>
                        </div>

                        <input type="checkbox" id="all_day" name="all_day"/>
                        <label htmlFor="all_day"> Include all day events (+12hrs)</label><br/>

                        <input type="checkbox" id="days" name="day_selection"
                               onClick={() => {
                                   this.toggleHidden("import_days");
                                   this.resetDays();
                               }}/>
                        <label htmlFor="days"> Only specific day of week </label>
                        <div id="import_days" hidden>
                            <input id="day_su" type="checkbox" name="sunday" onClick={() => this.updateDays(0)}/><label
                            htmlFor="day_su">SU</label>
                            <input id="day_m" type="checkbox" name="monday" onClick={() => this.updateDays(1)}/><label
                            htmlFor="day_m">M</label>
                            <input id="day_tu" type="checkbox" name="tuesday" onClick={() => this.updateDays(2)}/><label
                            htmlFor="day_tu">TU</label>
                            <input id="day_w" type="checkbox" name="wednesday" onClick={() => this.updateDays(3)}/><label
                            htmlFor="day_w">W</label>
                            <input id="day_th" type="checkbox" name="thursday" onClick={() => this.updateDays(4)}/><label
                            htmlFor="day_th">TH</label>
                            <input id="day_f" type="checkbox" name="friday" onClick={() => this.updateDays(5)}/><label
                            htmlFor="day_f">F</label>
                            <input id="day_sa" type="checkbox" name="saturday" onClick={() => this.updateDays(6)}/><label
                            htmlFor="day_sa">SA</label>
                        </div>
                    </fieldset>

                    <fieldset id="import_output">
                        <output id="out"></output>
                        <div id="import_buttons">
                            <button id="import_submit" type="submit" disabled={true}>Import</button>
                        </div>
                    </fieldset>

                </form>

                <GoogleLogout
                    render={renderProps => (
                        <button onClick={renderProps.onClick}
                                disabled={renderProps.disabled}>LOGOUT DEBUG</button>)}
                    clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
                    buttonText="Logout"
                    onLogoutSuccess={this.logoutSuccess}>
                </GoogleLogout>

            </main>
        </div>
        )};
}

export default ImportCal;