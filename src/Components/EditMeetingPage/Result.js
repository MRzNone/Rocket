import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Meeting, Member } from "../../EarthBase";
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";


/**
 * Enter Results.
 */
export class Result extends Component {

    constructor(props) {
        super(props);

        this.meetingDB = new Meeting();
        this.state = {
            meetingID: undefined,
            userID: undefined,
            finalTime: '',
        };
    };

    fetchData() {       // NOTE: Modified by ImportCal.js

        const params = new URLSearchParams(window.location.search);
        const meetingID = params.get("meetingId");
        const userID = params.get("userId");

        if (meetingID === undefined) {
            console.error("Invlid parameters");
            this.props.history.push("/");
            return;
        }

        this.meetingDB.fetchMeetingData(meetingID).then(data => {

            const finalTime = data.finalTime;

            this.setState({
                meetingID: meetingID,
                userID: userID,
                finalTime: finalTime !== null ? finalTime : '',
            })
        });
    }

    updateResult(data) {     // NOTE: Modified by ImportCal.js
        const meetingID = this.state.meetingID
        this.meetingDB.updateFinalResult(meetingID, this.state.finalTime);
    }

    componentDidMount() {
        this.fetchData();
    }

    render() {
        const params = new URLSearchParams(window.location.search);

        return (
            <div>
                <form noValidate autoComplete="off">
                    <TextField
                        id="standard-textarea"
                        label="Final Meeting Time"
                        placeholder="e.x. 2019-12-05 17:00"
                        margin="normal"
                        multiline
                        value={this.state.finalTime}
                        style={{
                            width: 150,
                            flexWrap: 'wrap',
                        }}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                this.setState({ finalTime: e.target.value })
                            }
                        }}
                        onChange={(e) => this.setState({ finalTime: e.target.value })}
                    />
                </form>
                <div >
                    <Button
                        variant="outlined"
                        style={{
                            background: "#ff3366",
                            color: 'white',
                            marginLeft: 200,
                            marginTop: -40,
                            marginBottom: 10,
                            fontSize: 10
                        }}
                        onClick={this.updateResult.bind(this)}
                    >
                        Save Final Time
                    </Button>

                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        meeting: state.meeting,
    };
}

const mapDispatchToProps = {

};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Result);

