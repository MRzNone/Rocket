import React, { Component } from 'react';
import { Dialog, DialogContentText, DialogTitle, DialogContent, DialogActions, TextField } from '@material-ui/core';
import { connect } from 'react-redux';
import Button from '../NewLandPage/modules/components/Button';

class MeetingLogin extends Component {
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
                    />
                </DialogContent>
                
                <DialogActions>
                    <Button color="secondary"
                    href="/">
                        Back
                    </Button>
                    <Button color="primary" href="/MeetingLogin">
                        Create New User
                    </Button>
                    <Button color="primary" href="/" autoFocus>
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
  )(MeetingLogin);
  