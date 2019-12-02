import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Meeting, Member} from "../../EarthBase";
import Paper from '@material-ui/core/Paper';
import { Checkbox } from '@material-ui/core';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import update from 'immutability-helper';


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
            checked: [],
            checkBox: []
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

            let checkBox = {}
            members.map(mem => {
                checkBox[mem[0]]= false;
            })
            console.log(checkBox)
            console.log(members)

            this.setState({
                meetingID: meetingID,
                members: members,
                checkBox: checkBox
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

    checkBoxHandle(){
        const checkBox = this.state.checkBox;
        this.setState()
    }

    remove(){
        const checkBox = this.state.checkBox;
        console.log(checkBox)
        Object.entries(checkBox).forEach(c => {
            if (c[1] === true) {
                this.removeMembers(c[0])
            }
        })
    }

    renderClips() {
        const members = this.state.members;
        console.log(this.state.checkBox);
        if (members === []) return (<div/>)

        return (
            <div>
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
                                members.map(d => {
                                    let id = d[0]
                                    let name = d[2][1]
                                    return (
                                        <>
                                        <FormControlLabel
                                            id={id}
                                            value={id}
                                            control={<Checkbox color="primary" checked={this.state.checkBox[id]} onChange={(e) => this.setState(
                                                {checkBox: update(this.state.checkBox, {[id]: {$set: e.target.checked}})})} />}
                                            label={name}
                                            labelPlacement="start"
                                        />
                                    </>
                                    );
                                })
                            }
                        </FormGroup>
                    </FormControl>
                </Container>

                <Button variant="outlined" color="default" onClick={this.remove.bind(this)} style={{margin:'5%'}}>
                    Remove User
                </Button>
            </div>
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
