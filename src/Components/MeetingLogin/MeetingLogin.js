import React, { Component } from 'react';
import { Dialog, DialogContentText, DialogTitle, DialogContent, DialogActions, TextField } from '@material-ui/core';
import { connect } from 'react-redux';
import Button from '../NewLandPage/modules/components/Button';
import queryString from 'query-string'
import { Meeting, Member } from '../../EarthBase';

class MeetingLogin extends Component {

    constructor(props) {
        super(props);
        const query_values = queryString.parse(this.props.location.search);

        this.state = {
            email: '',
            meeting_id: query_values.meetingId,
        }

        this.meetingDB = new Meeting();
        this.memberDB = new Member();
    }

    render() {
        return (
            <Dialog open className="box">
                <DialogTitle>Input Meeting Participant Information</DialogTitle>
                <DialogContent>
                    <DialogContentText>Please enter the email used to join the meeting. If this is your first time joining, please click on the Create a New User button</DialogContentText>
                    <TextField
                        required
                        autoFocus
                        margin="dense"
                        id="meeting-id"
                        label="Email"
                        type="email"
                        fullWidth
                        variant="outlined"
                        onChange={this.handleTextFieldChange}
                    />
                </DialogContent>

                <DialogActions>
                    <Button color="secondary"
                        href="/JoinMeeting">
                        Back
                    </Button>
                    <Button color="primary" href={"/CreateNewUser?meetingId=" + this.state.meeting_id}>
                        Create New User
                    </Button>
                    <Button color="primary" onClick={this.handleNextClick} autoFocus>
                        {/* This button should redirect to meeting page */}
                        Next
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    handleTextFieldChange = (e) => {
        this.setState({
            email: e.target.value
        });
    }

    handleNextClick = (e) => {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email)) {
            var that = this;

            this.meetingDB.fetchMeetingData(this.state.meeting_id).then(function (result) {
                let memberArray = Object.entries(result.members);
                for (var i = 0; i < memberArray.length; i++) {
                    if (memberArray[i][1].email === that.state.email) {
                        console.log("found email");
                        that.props.history.push('/viewmeeting?meetingId=' + that.state.meeting_id + '&userId=' + memberArray[i][0]);
                        return;
                    }
                }

                // not found
                alert("Member does not exist. Please create a member or try a different email.");
            }, function (error) {

            });
        }
        else {
            alert("Not a valid email!");
        }

    }


}

const mapStateToProps = (state, ownProps) => {
    return {

    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MeetingLogin);
