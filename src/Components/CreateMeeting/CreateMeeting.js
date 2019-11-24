import React, {Component} from 'react';
import Calendar from "./CalendarSelect";
import './CreateMeeting.css';

class CreateMeeting extends Component {
    render() {
        return(
            <div>
                <div className="forms">
                    <form id="inputs">
                        <div id="times">
                            <input type="text" id="titleName" placeholder="Enter meeting name" /><br />
                            <label>Earliest Time:</label>
                            <select name="EarliestTime">
                                <option>Select a time:</option>
                                <option value="12">12 am</option>
                                <option value="1">1 am</option>
                                <option value="2">2 am</option>
                                <option value="3">3 am</option>
                                <option value="4">4 am</option>
                                <option value="5">5 am</option>
                                <option value="6">6 am</option>
                                <option value="7">7 am</option>
                                <option value="8">8 am</option>
                                <option value="9">9 am</option>
                                <option value="10">10 am</option>
                                <option value="11">11 am</option>
                                <option value="12">12 pm</option>
                                <option value="1">1 pm</option>
                                <option value="2">2 pm</option>
                                <option value="3">3 pm</option>
                                <option value="4">4 pm</option>
                                <option value="5">5 pm</option>
                                <option value="6">6 pm</option>
                                <option value="7">7 pm</option>
                                <option value="8">8 pm</option>
                                <option value="9">9 pm</option>
                                <option value="10">10 pm</option>
                                <option value="11">11 pm</option>
                            </select><br />
                            <label>Latest Time:</label>
                            <select name="LatestTime">
                                <option>Select a time:</option>
                                <option value="12">12 am</option>
                                <option value="1">1 am</option>
                                <option value="2">2 am</option>
                                <option value="3">3 am</option>
                                <option value="4">4 am</option>
                                <option value="5">5 am</option>
                                <option value="6">6 am</option>
                                <option value="7">7 am</option>
                                <option value="8">8 am</option>
                                <option value="9">9 am</option>
                                <option value="10">10 am</option>
                                <option value="11">11 am</option>
                                <option value="12">12 pm</option>
                                <option value="1">1 pm</option>
                                <option value="2">2 pm</option>
                                <option value="3">3 pm</option>
                                <option value="4">4 pm</option>
                                <option value="5">5 pm</option>
                                <option value="6">6 pm</option>
                                <option value="7">7 pm</option>
                                <option value="8">8 pm</option>
                                <option value="9">9 pm</option>
                                <option value="10">10 pm</option>
                                <option value="11">11 pm</option>
                            </select><br />
                            <label>Time interval:</label>
                            <select name="timeInterval">
                                <option>Select time interval:</option>
                                <option value="30">30 mins</option>
                            </select><br />
                        </div>
                        <div id="Calendar">
                            <Calendar />
                        </div>
                    </form>
                    <footer>
                        <div className="buttons">
                            <a id="next" href="#next">Next &raquo;</a>
                            <a id="back" href="#back">&laquo; Back</a>
                        </div>
                    </footer>
                </div>
            </div>
        );
    }
}

export default CreateMeeting;