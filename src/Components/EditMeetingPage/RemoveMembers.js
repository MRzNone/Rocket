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
import Button from "@material-ui/core/Button";

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

            if (mem !== undefined && mem !== []) {
                for (const [id, value] of mem) {
                    if (value !== undefined && value !== []) {
                        const fields = Object.entries(value);
                        let newMem = [id]
                        for (const [key, val] of fields) {
                            newMem.push([key, val]);
                        }
                        members.push(newMem);
                    }

                }
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

    renderClips() {
        const data = this.state.members;

        if (data === []) return (<div/>)

        let checked = [];

        console.log(checked)
        return (
            <>
                <Container maxWidth="xl">
                    <FormControl component="fieldset" style={{
                        marginTop: '3vh',
                        marginLeft: '5vh',
                        paddingTop: '2vh'
                    }}>
                        <FormLabel component="legend" style={{
                            textAlign: 'right',
                            fontSize: 25,
                        }}>Members</FormLabel>

                        <FormGroup style={{textAlign:'center', width: '100%'}}>
                            {
                                data.map(d => {
                                    return (
                                        <FormControlLabel
                                            value={d[0]}
                                            control={<Checkbox color="primary"/>}
                                            label={d[2][1]}
                                            labelPlacement="start"
                                            onChange={checked.push(d[0])}
                                        />
                                    );
                                })
                            }
                        </FormGroup>
                    </FormControl>
                </Container>

                <Button variant="outlined" color="default" onClick={console.log(checked)} style={{margin:'5%'}}>
                    Remove User
                </Button>
            </>
        );
    }
/* removeMembers(d[0]) */

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
