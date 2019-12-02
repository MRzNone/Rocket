import React, { Component } from 'react';
import Calendar from "./CalendarSelect/CalendarSelect";
import '../CreateMeeting/CreateMeeting.css';
import { Select, MenuItem, Button } from "@material-ui/core";
import { Meeting, getRandomId } from '../../EarthBase';

class CreateMeeting extends Component {
    constructor(props) {
        super(props);

        this.state = {
            earliestTime: 0,
            latestTime: 23,
            timeInterval: 30,
            meetingName: '',
        };

        this.meetingDB = new Meeting();
        this.selectedDates = [];
    }

    updateSelected(data) {
        this.selectedDates = data.map(d => d.date.toDate());
    }

    createMeetingDB() {
        const hostId = getRandomId();
        const meetingId = getRandomId();
        const { earliestTime, latestTime, timeInterval, meetingName } = this.state;

        console.log(this.state);
        
        if (latestTime < earliestTime) {
            alert("Latest time has to be after earliest time");
            return;
        }
        if(this.selectedDates.length == 0){
            alert("Please select a date");
            return;
        }
        if(meetingName.length === 0 || !meetingName.trim() ){
            alert("Please enter a meeting name");
            return;
        }

        this.meetingDB.createMeeting(
            meetingId,
            meetingName,
            this.selectedDates,
            earliestTime * 60,
            latestTime * 60,
            hostId,
            Math.floor((latestTime - earliestTime) * 60 / timeInterval)
        ).then(() => {

            this.props.history.push({
                pathname: '/createnewuser',
                search: '?meetingId=' + meetingId + "&userId=" + hostId,
            });
        });
    }

    render() {
        return (
            <div>
                <div className="forms">
                    <form id="inputs">
                        <div id="times">
                            <input
                                type="text"
                                id="titleName"
                                placeholder="Enter meeting name"
                                value={this.state.meetingName}
                                onChange={(evt) => this.setState({ meetingName: evt.target.value })}
                            />
                            <br />
                            <label>Earliest Time:</label>
                            <Select
                                name="EarliestTime"
                                style={{ minWidth: 100, textAlign: 'center' }}
                                value={this.state.earliestTime}
                                onChange={(evt) => this.setState({ earliestTime: evt.target.value })}
                            >
                                <MenuItem value={0}>12 am</MenuItem>
                                <MenuItem value={1}>1 am</MenuItem>
                                <MenuItem value={2}>2 am</MenuItem>
                                <MenuItem value={3}>3 am</MenuItem>
                                <MenuItem value={4}>4 am</MenuItem>
                                <MenuItem value={5}>5 am</MenuItem>
                                <MenuItem value={6}>6 am</MenuItem>
                                <MenuItem value={7}>7 am</MenuItem>
                                <MenuItem value={8}>8 am</MenuItem>
                                <MenuItem value={9}>9 am</MenuItem>
                                <MenuItem value={10}>10 am</MenuItem>
                                <MenuItem value={11}>11 am</MenuItem>
                                <MenuItem value={12}>12 pm</MenuItem>
                                <MenuItem value={13}>1 pm</MenuItem>
                                <MenuItem value={14}>2 pm</MenuItem>
                                <MenuItem value={15}>3 pm</MenuItem>
                                <MenuItem value={16}>4 pm</MenuItem>
                                <MenuItem value={17}>5 pm</MenuItem>
                                <MenuItem value={18}>6 pm</MenuItem>
                                <MenuItem value={19}>7 pm</MenuItem>
                                <MenuItem value={20}>8 pm</MenuItem>
                                <MenuItem value={21}>9 pm</MenuItem>
                                <MenuItem value={22}>10 pm</MenuItem>
                                <MenuItem value={23}>11 pm</MenuItem>
                            </Select>
                            <br />
                            <br />
                            <label>Latest Time:</label>
                            <Select
                                name="LatestTime"
                                style={{ minWidth: 100, textAlign: 'center' }}
                                value={this.state.latestTime}
                                onChange={(evt) => this.setState({ latestTime: evt.target.value })}
                            >
                                <MenuItem value={0}>12 am</MenuItem>
                                <MenuItem value={1}>1 am</MenuItem>
                                <MenuItem value={2}>2 am</MenuItem>
                                <MenuItem value={3}>3 am</MenuItem>
                                <MenuItem value={4}>4 am</MenuItem>
                                <MenuItem value={5}>5 am</MenuItem>
                                <MenuItem value={6}>6 am</MenuItem>
                                <MenuItem value={7}>7 am</MenuItem>
                                <MenuItem value={8}>8 am</MenuItem>
                                <MenuItem value={9}>9 am</MenuItem>
                                <MenuItem value={10}>10 am</MenuItem>
                                <MenuItem value={11}>11 am</MenuItem>
                                <MenuItem value={12}>12 pm</MenuItem>
                                <MenuItem value={13}>1 pm</MenuItem>
                                <MenuItem value={14}>2 pm</MenuItem>
                                <MenuItem value={15}>3 pm</MenuItem>
                                <MenuItem value={16}>4 pm</MenuItem>
                                <MenuItem value={17}>5 pm</MenuItem>
                                <MenuItem value={18}>6 pm</MenuItem>
                                <MenuItem value={19}>7 pm</MenuItem>
                                <MenuItem value={20}>8 pm</MenuItem>
                                <MenuItem value={21}>9 pm</MenuItem>
                                <MenuItem value={22}>10 pm</MenuItem>
                                <MenuItem value={23}>11 pm</MenuItem>
                            </Select>
                            <br />
                            <br />
                            <label>Time interval:</label>
                            <Select
                                name="timeInterval"
                                style={{ minWidth: 100, textAlign: 'center' }}
                                value={this.state.timeInterval}
                                onChange={(evt) => this.setState({ timeInterval: evt.target.value })}
                            >
                                <MenuItem value={30}>30 mins</MenuItem>
                            </Select>
                        </div>
                        <div id="Calendar">
                            <Calendar
                                updateSelected={this.updateSelected.bind(this)}
                            />
                        </div>
                    </form>
                    <footer>
                        <div className="buttons">
                            <Button
                                id="next"
                                onClick={() => this.createMeetingDB()}
                            >
                                Next &raquo;
                            </Button>
                            <Button
                                id="back"
                                onClick={() => this.props.history.push("/")}
                            >
                                &laquo; Back
                            </Button>
                        </div>
                    </footer>
                </div>
            </div>
        );
    }
}

export default CreateMeeting;