import emailjs from 'emailjs-com';
import {connect} from "react-redux";
import React, { Component } from 'react';
import {Meeting, Member} from "../../EarthBase";
import Button from "@material-ui/core/Button";


/**
 * Send Results.
 */
export class SendResult extends Component{

    constructor(props) {
        super(props);

        this.meetingDB = new Meeting();
        this.state ={
            meetingID: undefined,
            hostID: undefined,
            members: [],
            name: undefined,
            time: undefined,
            notes: undefined,
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
            const members = data.members;
            const notes = data.notes;
            const time = data.finalTime;
            const name = data.name;

            this.setState({
                meetingID: meetingID,
                hostID: hostID,
                members: members,
                notes: notes,
                time: time,
                name: name,
            })
        });
    }

    componentDidMount() {
        this.fetchData();
    }

    send (email, name) {
        let templateParams = {
            email: email,
            meeting_name: this.state.name,
            to_name: name,
            meeting_time: this.state.time,
            message_note: this.state.notes,
        }

        emailjs.send('rocket', 'rocket', templateParams, 'user_IenZPlJja0a5wyeaWq2WJ')
            .then((response) => {
                console.log('SUCCESS!', response.status, response.text);
            }, (err) => {
                console.log('FAILED...', err);
            });
    }

    render() {
        const params = new URLSearchParams(window.location.search);
        const meetingID = params.get("meetingId");

        return (
            <>
                {this.send('ailsafan@hotmail.com', 'Ailsa')}
                <Button variant="outlined" color="default" style={{margin:'5%'}} onClick={() => this.props.history.push({
                    pathname: '/editMeeting',
                    search: '?meetingId=' + meetingID,
                })}> Back </Button>

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
)(SendResult);