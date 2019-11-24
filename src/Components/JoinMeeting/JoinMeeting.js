import React, { Component } from 'react';
import { Dialog, DialogContentText, DialogTitle, DialogContent, DialogActions, TextField } from '@material-ui/core';
import { connect } from 'react-redux';
import Button from '../NewLandPage/modules/components/Button';

class JoinMeeting extends Component {
    render(){
        return(
            <Dialog open="true"  className="box">
                <DialogTitle>Join Meeting</DialogTitle>
                <DialogContent>
                    <DialogContentText>Please enter the Meeting Id of the meeting you're trying to view</DialogContentText>
                    <TextField
                        required
                        autoFocus
                        margin="dense"
                        id="meeting-id"
                        label="Meeting ID"
                        type="number"
                        fullWidth
                        variant="outlined" 
                    />
                </DialogContent>
                <DialogActions>
                    <Button color="secondary"
                    href="/">
                        Back
                    </Button>
                    <Button color="primary" href="/MeetingLogin" autoFocus>
                        {/* This button should redirect to meeting page */}
                        Next
                    </Button>
                </DialogActions>
            </Dialog>
        );
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
  )(JoinMeeting);
  