import React, { Component } from 'react';
import { Dialog, DialogContentText, DialogTitle, DialogContent, DialogActions, TextField } from '@material-ui/core';
import { connect } from 'react-redux';
import Button from '../NewLandPage/modules/components/Button';
import { Meeting } from '../../EarthBase';

class JoinMeeting extends Component {

    constructor(props) {
        super(props);
        console.log(props);

        this.state = {
            meeting_id: '',
        }

        this.meetingDB = new Meeting();
    }

    render() {
        return (
            <Dialog open className="box">
                <DialogTitle>Join Meeting</DialogTitle>
                <DialogContent>
                    <DialogContentText>Please enter the Meeting Id of the meeting you're trying to view</DialogContentText>
                    <TextField
                        required
                        autoFocus
                        margin="dense"
                        id="meetingid"
                        label="Meeting ID"
                        fullWidth
                        variant="outlined"
                        value={this.state.meeting_id}
                        onChange={this.handleTextFieldChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button color="secondary"
                        href="/">
                        Back
                    </Button>
                    <Button autoFocus color="primary" onClick={this.handleNextClick}>
                        {/* This button should redirect to meeting page */}
                        Next
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    handleTextFieldChange = (e) => {
        this.setState({
            meeting_id: e.target.value
        });
    }

    handleNextClick = (e) => {
        var that = this;
        if (this.state.meeting_id.length > 0) {
            this.meetingDB.fetchMeetingData(this.state.meeting_id).then(function (result) {
                if (result.status) {
                    alert("Cannot find meeting.");
                    console.log("Did Not Find Meeting");
                }
                else {
                    console.log("Found Meeting!");
                    that.props.history.push('/meetinglogin?meetingId=' + that.state.meeting_id);
                }
            }, function (error) {
                console.log("Did Not Find Meeting");
            });
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
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(JoinMeeting);
