import React, { Component } from 'react';
import { Dialog, DialogContentText, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import { connect } from 'react-redux';
import Button from '../NewLandPage/modules/components/Button';
class MeetingResponse extends Component {
    render(){
        return(
            <Dialog open="true"  className="box">
                <DialogTitle>Create Meeting</DialogTitle>
                <DialogContent>
                    <DialogContentText>Meeting Id: <b>123</b></DialogContentText>
                    <DialogContentText>Host Pin: <b>??? (Not sure if we're still using this)</b></DialogContentText>
                    <DialogContentText>You'll use your meeting Id to gain access to the meeting.</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="secondary"
                    href="/">
                        Cancel Meeting Creation
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
  )(MeetingResponse);
  