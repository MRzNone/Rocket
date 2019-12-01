import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as db from "firebase";
import {Meeting, Member} from "../../EarthBase";
import TextField from '@material-ui/core/TextField';
import queryString from 'query-string';
import Button from "@material-ui/core/Button";


/**
 * Edit Notes.
 */
export class EditNotes extends Component{


    constructor(props) {
        super(props);

        this.meetingDB = new Meeting();
        this.state ={
            meetingID: undefined,
            notes: 'none'
        };
    };

    fetchData() {       // NOTE: COPIED FROM ImportCal.js and ViewMeeting.js

        const params = new URLSearchParams(window.location.search);
        const meetingID = params.get("meetingId");

        if (meetingID === undefined) {
            console.error("Invlid parameters");
            this.props.history.push("/");
            return;
        }

        this.meetingDB.fetchMeetingData(meetingID).then(data => {

            const notes = data.notes;

            this.setState({
                meetingID: meetingID,
                notes: notes
            });
        });
    }

    updateNotes(data) {     // NOTE: COPIED FROM ImportCal.js and ViewMeeting.js
        const meetingID = this.state.meetingID
            this.meetingDB.updateMeetingNote(meetingID, this.state.notes);
    }

    componentDidMount() {
        this.fetchData();
    }

    render() {
        return (
            <>
                <form noValidate autoComplete="off">
                    <TextField
                        id="outlined-multiline-static"
                        multiline
                        rows="16"
                        defaultValue="Notes: "
                        variant="outlined"
                        style={{
                            width:'100%',
                            flexWrap: 'wrap',
                        }}
                        input onChange={(e) => this.setState({ notes: e.target.value })}
                    />
                </form>
                <Button variant="outlined" color="default" onClick={this.updateNotes.bind(this)} style={{margin:'5%'}}>
                    Save Changes
                </Button>
            </>
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

