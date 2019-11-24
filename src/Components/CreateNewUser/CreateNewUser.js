import React, { Component } from 'react';
import { Dialog, DialogContentText, DialogTitle, DialogContent, DialogActions, TextField } from '@material-ui/core';
import { connect } from 'react-redux';
import Button from '../NewLandPage/modules/components/Button';

class CreateNewUser extends Component {
    render(){
        return(
            <Dialog open="true"  className="box">
                <DialogTitle>Input Meeting Participant Information</DialogTitle>
                <DialogContent>
                    <DialogContentText>Please enter your name and email.</DialogContentText>
                    <TextField
                        required
                        autoFocus
                        margin="dense"
                        id="name-id"
                        label="Name"
                        fullWidth
                        variant="outlined" 
                    />
                    <TextField
                        required
                        margin="dense"
                        id="email-id"
                        label="Email"
                        type="email"
                        fullWidth
                        variant="outlined" 
                    />
                </DialogContent>
                
                <DialogActions>
                    <Button color="secondary"
                    href="/MeetingLogin">
                        Cancel
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
  )(CreateNewUser);
  