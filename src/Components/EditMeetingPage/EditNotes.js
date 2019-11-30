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
        this.state ={
            notes: 'None'
        }
        this.meetingDB = new Meeting();
        this.notes = '';
    };

    updateNotes(note){
        const [value, setValue] = React.useState('Controlled');
        this.notes = note.map(event => setValue(event.target.value));
        // get meeting id
        const params = queryString.parse(this.props.location.search);
        // const meetingID = params.meetingID;
        const meetingID = "68c893a7-da81-9db0-8a8f-d35051d74db5";
        this.props.updateMeetingNote(meetingID, value);
    }

    render() {
        const {notes} = this.notes
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
                />
            </form>
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
