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

            const hostID = data.hostId;

            const mem = Object.entries(data.members);
            let members = [];
            for (const [id, value] of mem) {
                const fields = Object.entries(value);
                let newMem = [id]
                for (const [key, val] of fields) {
                    newMem.push([key, val]);
                }
                members.push(newMem);

            }

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
        console.log(chipToDelete)
        let memArray = this.state.members.filter(mem => mem[0] !== chipToDelete.target.value);
        this.setState({members: memArray});
        this.removeMembers(chipToDelete);
    }

    renderClips() {
        const data = this.state.members;
        Object.keys(data).forEach(e => console.log(e));
        Object.values(data).forEach(e => console.log(Object.values(e)));




        if (data === []) return (<div/>)

        console.log(data)
        return (
            <>
                {data.map(d => {
                    return (
                        <Chip
                            key={d[0]}
                            label={d[2][1]}
                            onDelete={this.handleDelete.bind(d[0])}
                        />

                    );
                })}
                </>
        );
    }


    render() {

        return (
            <div>
                <Paper style={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    padding: 10,
                }}>
                    {this.renderClips()}
                </Paper>
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
)(RemoveMembers);