import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Meeting, Member} from "../../EarthBase";
import queryString from "query-string";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Checkbox } from '@material-ui/core';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Container from "@material-ui/core/Container";
import FormHelperText from '@material-ui/core/FormHelperText';
import Chip from '@material-ui/core/Chip';
import {EditNotes} from "./EditNotes";

/**
 * Remove Members.
 */

export class RemoveMembers extends Component {

    constructor(props) {
        super(props);

        this.meetingDB = new Meeting();
        this.memberDB = new Member();
        this.state ={
            meetingID: undefined,
            members: [],
            userID: undefined
        };
    };

    fetchData() {       // NOTE: Modified by ImportCal.js

        const params = new URLSearchParams(window.location.search);
        const meetingID = params.get("meetingId");

        if (meetingID === undefined) {
            console.error("Invlid parameters");
            this.props.history.push("/");
            return;
        }

        this.meetingDB.fetchMeetingData(meetingID).then(data => {

            const members = data.members;
            const hostID = data.hostId;

            this.setState({
                meetingID: meetingID,
                members: members,
                userID: hostID
            });
        });
    }

    componentDidMount() {
        this.fetchData();
    }

    removeMembers(memberID) {     // NOTE: Modified by ViewMeeting.js
        const meetingID = this.state.meetingID;
        this.memberDB.deleteMember(memberID, meetingID);
    }

    handleDelete (chipToDelete) {
        let memArray = this.state.members.filter(chip => chip.key !== chipToDelete.key);
        this.setState({members: memArray});
    }

    renderClips() {
        const {data} = this.state.members;
        if (data === undefined) return (<div />)
        else {data.map(d => {
            return (
                <>
                    <Chip
                        key={d.id}
                        label={d.name}
                        onDelete={this.handleDelete.bind(d)}
                        style={{margin: 5}}
                    />
                </>
            );
        })}
    }

    render() {

        return (
            <>
                <Paper style={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    padding: 10,
                }}>
                    {this.renderClips()}
                </Paper>
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
)(RemoveMembers);