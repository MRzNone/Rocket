import React, {useEffect, useState} from "react";
import "./ImportCal.css";
import {GoogleLogin, GoogleLogout} from 'react-google-login';
import fetchMeetingData from "../Meeting/Meeting"

/* global gapi */

const ImportCal = ({close}) => {

    // TODO: RETRIEVE FROM DATABASE (dates, timeWindow, rowNum)
    const meetingDates = ["2019-06-02","2019-06-03","2019-06-05","2019-06-06"];     // GET dates FROM DATABASE
    const firstDate = new Date(meetingDates[0]).toISOString();                      // Assuming first is earliest
    const lastDate = new Date(meetingDates[-1]).toDateString();                     // Assuming last is latest
    const minTime = new Date(300*60000).toISOString().substr(11, 5);                // GET timeWindow[0]       // 300
    const maxTime = new Date(900*60000).toISOString().substr(11, 5);                // GET timeWindow[1]       // 900
    const rowNum = 46;                                                              // GET rowNum


    // TODO: SEND TO DATABASE (timeSlots)
    const [timeSlots, setTimeSlots] = useState([]);                                 // SEND timeSlots TO DATABASE


    const ical = require('ical.js');
    const moment = require('moment');

    const [offset, setOffset] = useState(30);
    const [startTime, setStartTime] = useState(minTime);
    const [endTime, setEndTime] = useState(maxTime);
    const [days, setDays] = useState([0,0,0,0,0,0,0]);
    const [mode, setMode] = useState("none");
    const [auth, setAuth] = useState(undefined);
    const [uploadFile, setUploadFile] = useState(undefined);


    // TODO: Function that needs to send output to database
    // Input is date as key, array of events as value      date: [[start1_s, end1_s],[start2_s, end2_s]...]
    const convertToTimeSlots = (eventMap) => {

        // TESTING
        const timeWindow = [300, 900];
        let start_index, end_index, i=0;




        console.log("OK: " + Array.from(eventMap.values()));

        // rowNum x meetingDates.length, Default value 1
        let timeTable = Array(rowNum).fill().map(() => Array(meetingDates.length).fill(1));

        console.log("EVENT MAP: " + JSON.stringify(eventMap));

        for (const [date, events] of eventMap.entries()) {              // For each key in eventMap
            console.log("DATE: " + date);

            for (const event of events) {
                console.log("EVENT: " + event);
                start_index = Math.floor((event[0]-timeWindow[0])/rowNum);
                end_index = Math.ceil((event[1]-timeWindow[0])/rowNum);

                console.log(start_index + "," + end_index);

                // Set to 0 : busy for slots between start index and end_index
                for (let j=start_index; j < end_index; ++j) {
                    timeTable[j][i] = 0;
                }

            }
            ++i;
        }

        console.log(JSON.stringify(timeTable));

        // TODO: OUTPUT
        setTimeSlots(JSON.stringify(timeTable));


        // SEND TO DATABASE

    };










    /****************** Initialization *******************/

    // Run when page load
    useEffect (() => {
        (function () {
            const script = document.createElement("script");
            script.src = "https://apis.google.com/js/api:client.js";
            document.body.appendChild(script);
            script.onload = () => { loadGapi(script);};
        })();
    },[]);

    // Needed for Google Calendar API
    const loadClient = () => {
        return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/calendar/v3/rest")
            .then(function() { console.log("GAPI client loaded"); },
                function(err) { console.error("Error loading GAPI client", err); });
    }
    const loadGapi = (script) => {
        if(!script.getAttribute('gapi_processed')){
            setTimeout(() => {loadGapi(script)}, 100);
        }
    }

    /********** Functions to import from Google **********/

    const loginSuccess = (response) => {
        setAuth(response.getAuthResponse());

        // Change mode
        setMode("google");

        // Change Page
        document.getElementById('calGoogle').style.backgroundColor = "#BEF990";
        document.getElementById('calFile').style.backgroundColor = "#f9f6f4";
        document.getElementById("import_submit").disabled = false;

        let out = document.getElementById("out");
        out.innerHTML = "Import from Account: " + response.getBasicProfile().getEmail();
        out.style.color = "green";
    };
    const loginFailure = (response) => {

        if (mode === "google") {
            setMode("none");
            document.getElementById('calGoogle').style.backgroundColor = "#f9f6f4";
        }

        if (mode !== "file")
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
    };

    // DEBUG
    const logoutSuccess = (response) => {
        alert("Log out successful");
    };
    // DEBUG
    const logoutFailure = (response) => {
        alert("Log out failed");
    };

    // Fetch Event Data using Calendar API
    const handleGoogle = (callback) => {

        let glist = [];
        let out = document.getElementById("out");
        let allowAllDay = document.getElementById("all_day").checked;

        gapi.client.calendar.events.list({
            "calendarId": "primary",
            "orderBy": "startTime",
            "showDeleted": false,
            "singleEvents": true,
            "timeMin": firstDate,
            "timeMax": lastDate,
            "alt": "json",
            "prettyPrint": true
        }).then(function (data) {

            // Process Data
            let events = data.result.items;
            let start, end, block;

            for (let i = 0; i < events.length; i++) {
                block = events[i];

                //let title = block.summary;     // Event Name
                start= block.start.dateTime;     // Start Datetime
                end = block.end.dateTime;        // End Datetime

                // IF exclude all day && isAllDay
                if (!start) {
                    start = block.start.date;
                    end = block.end.date;
                }

                let startMoment = moment(start, ['YYYY-MM-DDTHH:mm:ssZ', 'YYYY-MM-DDTHH:mm:ss+-HH:mm', 'YYYY-MM-DD' ], true);
                let endMoment = moment(end, ['YYYY-MM-DDTHH:mm:ssZ', 'YYYY-MM-DDTHH:mm:ss+-HH:mm', 'YYYY-MM-DD' ], true);

                // If invalid format, skip
                if (!startMoment.isValid() || !endMoment.isValid())
                    continue;

                // General all day event spanning more than 12hr
                else if (!allowAllDay && (startMoment.diff(endMoment, "hours") >= 12 || startMoment.isSame(endMoment)))
                    continue;

                glist = [...glist, ...splitDates(startMoment, endMoment, allowAllDay)];
            }
            callback(glist);

        }, function (err) {
            // Handle Errors
            console.error("Execute error", err);
            out.innerHTML = "Error retrieving events from Google Calendar";
            out.style.color = "red";

        });
        return glist;
    };

    /********** Functions to import from upload **********/

        // If succeed close window and go back to meeting page, if fail stay on page and display error
    const selectUpload = (event) => {
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


            if(isValid) {
                setUploadFile(file);
                setMode("file");

                document.getElementById("calFile").style.backgroundColor = "#BEF990";
                document.getElementById('calGoogle').style.backgroundColor = "#f9f6f4";
                submit_btn.disabled = false;

                // Output Message
                out.innerHTML = "Import from File: " + file.name;
                out.style.color = "green";

            } else {
                if (mode === "file")
                    setMode("none");

                if (mode !== "google")
                    submit_btn.disabled = true;

                out.innerHTML = "Not valid ics file: " + file.name;
                out.style.color = "red";
            }
        };
    const handleUpload = (callback)=> {

        let out = document.getElementById("out");
        let submit_btn = document.getElementById("import_submit");
        let allowAllDay = document.getElementById("all_day").checked;

        let dateList = [];
        let fr = new FileReader();
        fr.onload = (e) => {
            try {
                let content = fr.result;
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

                    // General all day event spanning more than 24hr
                    else if (!allowAllDay && (endMoment.diff(startMoment, "hours") >= 12 || startMoment.isSame(endMoment)))
                        continue;

                    dateList = [...dateList, ...splitDates(startMoment, endMoment, allowAllDay)];
                }
                callback(dateList);
            } catch (err) {
                console.log(err);
                setMode("none");
                submit_btn.disabled = true;
                out.innerHTML = "Failed to process file: " + uploadFile.name;
                out.style.color = "red";
            }
        };
        fr.onerror = (e) => {
            console.log(e);
            setMode("none");
            submit_btn.disabled = true;
            out.innerHTML = "Failed to process file: " + uploadFile.name;
            out.style.color = "red";
        };
        fr.readAsText(uploadFile);
    };

    /********** Functions to process data **********/

    const splitDates = (s,e, allowAllDay) => {

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

        /*
        for (let i = 0; i < dates.length; ++i) {
            console.log(dates[i].startMoment.format("YYYY-MM-DD_HH:mm") +
                " & " + dates[i].endMoment.format("YYYY-MM-DD_HH:mm"));
        }
        */

        return dates;
    };

    const toMinutes = (time_string) => {
        let part = time_string.split(':');          // HH:MM:ss
        return parseInt(part[0]) * 60 + parseInt(part[1],10);
    }

    const handleImport = (event) => {
        event.preventDefault();

        if(mode === "file") {
            handleUpload(processData);
        }
        else if (mode === "google") {
            handleGoogle(processData);
            //auth.signOut();
            //auth.disconnect();
        }
        else {
            console.log("ERROR: NO MODE SELECTED");
        }

        /* Process Data */
        function processData (mList) {

            // Check if specific days were selected
            let enable_anyday = days.every(n => n === 0);
            let time_offset = (document.getElementById("toff").checked) ? offset : 0;
            let key, block, start, end, eventList, date;
            let outList = [];

            // Create map for meeting days
            let meetingMap = new Map();

            // Default values are user earliest/latest availability
            for (let j = 0; j < meetingDates.length; ++j) {
                meetingMap.set(meetingDates[j], [
                    [ toMinutes(minTime), toMinutes(startTime) ],
                    [ toMinutes(endTime) , toMinutes(maxTime) ]
                ]);
            }

            // Loop through every event block
            for (let i = 0; i < mList.length; ++i) {
                block = mList[i];
                start = block.startMoment;
                end = block.endMoment;
                key = start.format("YYYY-MM-DD");

                // Skip irrelevant date
                if (!meetingMap.has(key)) {
                    continue;
                }
                eventList = meetingMap.get(key);


                // Filter out non-selected days
                if (enable_anyday || days[start.day()]) {

                    // Apply offset values
                    start = moment.max(moment(start).subtract(time_offset, 'minutes'), moment(start).startOf("day"));
                    end = moment.min(moment(end).add(time_offset, 'minutes'), moment(end).endOf("day"));


                    console.log("DATE: " + key + ", START: " + start.format("HH:mm") + ", END: " + end.format("HH:mm"));

                    console.log(moment().startOf('day'));

                    // Output Formatting
                    eventList.push([
                        start.diff(moment(key).startOf('day'), 'minutes'),  // start time (seconds)
                        end.diff(moment(key).startOf('day'), 'minutes'),    // end time (seconds)
                    ]);
                }
                block = null;
            }

            // Convert Map to list
            //outList = Array.from(meetingMap.values());



            convertToTimeSlots(meetingMap);

            // Close Popup
            close();
        }
    };

    /******* Functions used for UI *******/

        // Calls appropriate set functions
    const setValue = (event, setter, defVal) => {
            let el = event.target;
            if (el.value.length !== 0 && el.checkValidity())
                setter(el.value);
            else
                setter(defVal);
        }
    // Helper function used to toggle hidden state of tags
    const toggleHidden = (id, action) => {
        let t = document.getElementById(id);

        if (action === undefined)
            t.hidden = !t.hidden;
        else
            t.hidden = (action === "hide");
    };
    // Helper function used to reset day selection
    const resetDays = () => {
        console.log(days);
        let children = document.getElementById("import_days").children;
        for (let i = 0; i < children.length; ++i) {
            if(children[i].type === "checkbox")
                children[i].checked = false;
        }
        setDays([0,0,0,0,0,0,0]);
    }

    const updateDays = (index) => {
        let arr = [...days];
        arr[index] = arr[index] ? 0 : 1;
        setDays([...arr]);
        console.log(days);
    };

    /*************************************/

    return(
        <div className="popup_wrapper">
            <header>
                <h1>Import Calendar</h1>
                <a className="close" onClick={close} title={"Close"}>&#10006;</a>
            </header>
            <main>
                <form onSubmit={handleImport}>
                    <fieldset className="import_file">

                        <label htmlFor="uploadFile" className="mode" id="calFile" >
                            Upload File
                            <input type="file" id="uploadFile" accept=".ics" onChange={(e)=>{selectUpload(e)}}/>
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
                            onRequest={loadClient}
                            onSuccess={loginSuccess}
                            onFailure={loginFailure}
                            cookiePolicy={'single_host_origin'} />
                    </fieldset>

                    <fieldset className="import_option">
                        <legend>Import Options</legend>

                        <input type="checkbox" id="toff" name="time_offset" value={offset} onClick={() => toggleHidden("time_offset","hide")}/>
                        <label htmlFor="toff"> Add offset time (min): </label>
                        <output onClick={() => toggleHidden("time_offset")}>
                            {offset}</output>
                        <br/>
                        <div id="time_offset" hidden>
                            <label htmlFor="ntoff"> Change Value (min): </label>
                            <input id="ntoff" type="text" name="offset" pattern="\d*" maxLength="3" onChange={(e) => setValue(e, setOffset, 30)}/>
                        </div>

                        <input type="checkbox" id="tran" name="time_range" value={[startTime,endTime]} onClick={() => toggleHidden("time_range","hide")}/>
                        <label htmlFor="tran"> Only free between: &nbsp;</label>
                        <output onClick={() => toggleHidden("time_range")}>
                            {startTime} - {endTime}</output>
                        <br/>
                        <div id="time_range" hidden>
                            <label> Free after:&nbsp;&nbsp;<input type="time" min={minTime} max={maxTime} onChange={(e) => setValue(e, setStartTime, minTime)} /></label><br/>
                            <label> Free before:&nbsp;<input type="time" min={minTime} max={maxTime} onChange={(e) => setValue(e, setEndTime, maxTime)} /></label>
                        </div>

                        <input type="checkbox" id="all_day" name="all_day" />
                        <label htmlFor="all_day"> Include all day events (+12hrs)</label><br />

                        <input type="checkbox" id="days" name="day_selection"
                               onClick={() => {toggleHidden("import_days"); resetDays();}}/>
                        <label htmlFor="days"> Only specific day of week </label>
                        <div id="import_days" hidden>
                            <input id="day_su" type="checkbox" name="sunday" onClick={()=>updateDays(0)} /><label htmlFor="day_su">SU</label>
                            <input id="day_m"type="checkbox" name="monday" onClick={()=>updateDays(1)} /><label htmlFor="day_m">M</label>
                            <input id="day_tu" type="checkbox" name="tuesday" onClick={()=>updateDays(2)} /><label htmlFor="day_tu">TU</label>
                            <input id="day_w" type="checkbox" name="wednesday" onClick={()=>updateDays(3)} /><label htmlFor="day_w">W</label>
                            <input id="day_th" type="checkbox" name="thursday" onClick={()=>updateDays(4)} /><label htmlFor="day_th">TH</label>
                            <input id="day_f" type="checkbox" name="friday" onClick={()=>updateDays(5)} /><label htmlFor="day_f">F</label>
                            <input id="day_sa" type="checkbox" name="saturday" onClick={()=>updateDays(6)} /><label htmlFor="day_sa">SA</label>
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
                    onLogoutSuccess={logoutSuccess}
                    onFailure={logoutFailure}>
                </GoogleLogout>

            </main>
        </div>
    );};

export default ImportCal;
