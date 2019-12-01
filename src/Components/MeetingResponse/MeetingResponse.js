import React, { Component } from 'react';
import { Dialog, DialogContentText, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import { connect } from 'react-redux';
import Button from '../NewLandPage/modules/components/Button';
import queryString from 'query-string';
import { Meeting } from '../../EarthBase';


class MeetingResponse extends Component {

    constructor(props){
        super(props);
        const query_values = queryString.parse(this.props.location.search);
        
        this.state = {
            meeting_id: query_values.meetingId,
            user_id: query_values.userId
        }
        console.log(this.state.user_id);
        
        this.meetingDB = new Meeting();

    }

    render(){
        return(
            <Dialog open="true"  className="box">
                <DialogTitle>Create Meeting</DialogTitle>
                <DialogContent>
                    <DialogContentText>Meeting Id: <b>{ this.state.meeting_id }</b></DialogContentText>
                    <DialogContentText>You'll use your meeting Id to gain access to the meeting.</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={this.handleNextClick} autoFocus>
                        {/* This button should redirect to meeting page */}
                        Next
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    handleNextClick = (e) => {        
        this.props.history.push('/viewmeeting?meetingId=' + this.state.meeting_id + '&userId=' + this.state.user_id);
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
  
    };
  };
  
  const mapDispatchToProps = {
  
  };
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(MeetingResponse);
  