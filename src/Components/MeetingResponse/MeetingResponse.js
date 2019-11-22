import React, { Component } from 'react';
import { Dialog, DialogContentText, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import { connect } from 'react-redux';
import Button from '../NewLandPage/modules/components/Button';

const styles = theme => ({
    box:{
        padding:100,
    }
});
class MeetingResponse extends Component {
    render(){
        return(
            <Dialog open="true"  className="box">
                <DialogTitle>Create Meeting</DialogTitle>
                <DialogContent>
                    <DialogContentText>Meeting Id: <b>123</b></DialogContentText>
                    <DialogContentText>You'll use your meeting Id to gain access to the meeting.</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="secondary">
                        Cancel Meeting Creation
                    </Button>
                    <Button color="primary" autoFocus>
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
  