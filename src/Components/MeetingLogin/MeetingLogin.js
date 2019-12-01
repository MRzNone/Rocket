import React, { Component } from 'react';
import { Dialog, DialogContentText, DialogTitle, DialogContent, DialogActions, TextField } from '@material-ui/core';
import { connect } from 'react-redux';
import Button from '../NewLandPage/modules/components/Button';
import queryString from 'query-string'
import { Meeting, Member } from '../../EarthBase';

class MeetingLogin extends Component {

    constructor(props){
        super(props);
        const query_values = queryString.parse(this.props.location.search);
        console.log(query_values);
        
        this.state = {
            email: '',
            meeting_id: query_values.meetingId,
        }

        this.meetingDB = new Meeting();
        this.memberDB = new Member();
    }

    render(){
        return(
            <Dialog open="true"  className="box">
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
        var that = this;
        console.log(this.state.email);

        this.meetingDB.fetchMeetingData(this.state.meeting_id).then(function(result){
            let memberArray = Object.entries(result.members);
            let found = false;
            console.log(memberArray);
            for(var i = 0; i < memberArray.length; i++){
                if(memberArray[i][1].email == that.state.email){
                    console.log("found email");
                    that.props.history.push('/viewmeeting?meetingId=' + that.state.meeting_id + '&userId=' + memberArray[i][0]);
                }
            }            
        }, function(error){

        });
        
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
  