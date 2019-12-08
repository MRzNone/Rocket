import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Meeting, Member } from "../../EarthBase";
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";


/**
 * Edit Notes.
 */
export class EditNotes extends Component {

    constructor(props) {
        super(props);

        this.meetingDB = new Meeting();
        this.state = {
            meetingID: undefined,
            userID: undefined,
            notes: '',
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

            const notes = data.notes;

            this.setState({
                meetingID: meetingID,
                userID: userID,
                notes: notes,
            })
        });
    }

    updateNotes(data) {     // NOTE: Modified by ImportCal.js
        const meetingID = this.state.meetingID
        this.meetingDB.updateMeetingNote(meetingID, this.state.notes);
    }

    componentDidMount() {
        this.fetchData();
    }

    render() {
        const params = new URLSearchParams(window.location.search);
        const meetingID = params.get("meetingId");
        const userID = params.get("userId");

        return (
            <div>
                <form noValidate autoComplete="off">
                    <TextField
                        id="outlined-multiline-static"
                        multiline
                        rows="16"
                        defaultValue={this.state.notes}
                        variant="outlined"
                        placeholder="Notes:"
                        style={{
                            width: '100%',
                            flexWrap: 'wrap',
                        }}
                        onChange={(e) => this.setState({ notes: e.target.value })}
                    />
                </form>
                <div style={{ margin: -10, marginTop: 0 }}>
                    <Button
                        variant="outlined"
                        style={{
                            background: "#ff3366",
                            color: 'white',
                            margin: '1.5%',
                            fontSize: 10
                        }}
                        onClick={this.updateNotes.bind(this)}
                    >
                        Save Changes
                    </Button>

                    <Button
                        variant="outlined"
                        size="large"
                        style={{
                            backgroundColor: "#ff3366",
                            color: 'white',
                            margin: '5%',
                            padding: 5,
                            fontSize: 10
                        }}
                        onClick={() => this.props.history.push({
                            pathname: '/sendResult',
                            search: '?meetingId=' + meetingID + "&userId=" + userID,
                        })}>
                        Share Meeting Results
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
)(EditNotes);

