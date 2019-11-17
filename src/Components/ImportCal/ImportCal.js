import React, {useState} from "react";
import "./ImportCal.css";

const ImportCal = ({close}) => {
    const[offset, setOffset] = useState(30);
    const[startTime, setStartTime] = useState("09:00");
    const[endTime, setEndTime] = useState("17:00");

    const handleImport = (event) => {
        event.preventDefault();

    };

    const handleGoogleLogin = () => {
        alert('handleGoogleLogin');
    };

    return(
        <div className="popup_wrapper">
        <header>
        <h1>Import Calendar</h1>
    <a className="close" onClick={close} title={"Close"}>&#10006;</a>
    </header>
    <main>
    <form onSubmit={handleImport}>
        <fieldset className="import_file">
        <label>
        <a href="#calFile">Use Local File</a>
    </label><br/>
    <div className="slide" id="calFile">
        <p><small>* Select ical/ics file:</small></p>
    <input type="file" accept=".ics,.ical" name="calFile" /><br />
        </div>

        <label>
        <a href="#calURL">Use Web URL</a>
    </label><br/>
    <div className="slide" id="calURL">
        <input type="text" name="calURL" placeholder="https://calendar.google.com/calendar/..." /><br/>
        </div>
        </fieldset>

        <fieldset className="import_option">
        <legend>Import Options</legend>
    <label>
    <input type="checkbox" name="time_offset" value={offset}/> Add offset time
    </label>
    <a onClick={() => {let t = document.getElementById('time_offset'); t.hidden = !t.hidden}}> change</a><br/>
    <div id="time_offset" hidden>
    <label>Offset Value (min): <input type="text" name="offset" pattern="\d*" maxLength="3" onChange={(e) => setOffset(e.target.value)}/></label>
    </div>

    <label><input type="checkbox" name="time_range" value={startTime + ":" + endTime} /> Restrict time range</label>
    <a onClick={() => {let t = document.getElementById('time_range'); t.hidden = !t.hidden}}> change</a><br/>
    <div id="time_range" hidden>
    <label>Start Time:<input type="time" onChange={(e) => setStartTime(e.target.value)} /></label><br/>
    <label>End Time : <input type="time" onChange={(e) => setEndTime(e.target.value)} /></label>
    </div>

    <div id="import_days">
        <p><label>Import specific days</label></p>
    <input id="day_su" type="checkbox" name="sunday"/><label for="day_su">SU</label>
        <input id="day_m"type="checkbox" name="monday"/><label for="day_m">M</label>
        <input id="day_tu" type="checkbox" name="tuesday" /><label for="day_tu">TU</label>
        <input id="day_w" type="checkbox" name="wednesday" /><label for="day_w">W</label>
        <input id="day_th" type="checkbox" name="thursday" /><label for="day_th">TH</label>
        <input id="day_f" type="checkbox" name="friday" /><label for="day_f">F</label>
        <input id="day_sa" type="checkbox" name="saturday"/><label for="day_sa">SA</label>
        </div>
        </fieldset>
        <div id="import_buttons">
        <button id="calGoogle" onClick={handleGoogleLogin}></button>
        <button id="import_submit" type="submit">Import</button>
        </div>
        </form>
        </main>
        </div>
);};

export default ImportCal;
