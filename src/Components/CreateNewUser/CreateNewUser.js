import React, { Component } from 'react';
import { Dialog, DialogContentText, DialogTitle, DialogContent, DialogActions, TextField } from '@material-ui/core';
import { connect } from 'react-redux';
import Button from '../NewLandPage/modules/components/Button';
import queryString from 'query-string';
import { Meeting, Member, getRandomId } from '../../EarthBase';

class CreateNewUser extends Component {

    constructor(props){
        super(props);
        const query_values = queryString.parse(this.props.location.search);
        console.log(query_values);
        
        this.state = {
            name: '',
            email: '',
            meeting_id: query_values.meetingId,
        }

        this.meetingDB = new Meeting();
        this.memberDB = new Member();
    }

    render(){
        return(
            <Dialog open  className="box">
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
                        onChange={this.handleNameFieldChange}
                    />
                    <TextField
                        required
                        margin="dense"
                        id="email-id"
                        label="Email"
                        type="email"
                        fullWidth
                        variant="outlined" 
                        onChange={this.handleEmailFieldChange}
                    />
                </DialogContent>
                
                <DialogActions>
                    <Button color="secondary"
                    href="/">
                        Cancel
                    </Button>
                    <Button color="primary" onClick={this.handleNextClick} autoFocus>
                        {/* This button should redirect to meeting page */}
                        Next
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    handleNameFieldChange = (e) => {
        this.setState({
            name: e.target.value
        });
    }

    handleEmailFieldChange = (e) => {
        this.setState({
            email: e.target.value
        });
    }

    handleNextClick = (e) => {
        let memberId = getRandomId();
        try{
            this.memberDB.createMember(memberId, this.state.meeting_id, this.state.name, this.state.email, ' ');
            this.props.history.push('/viewmeeting?meetingId=' + this.state.meeting_id + '&userId=' + memberId);
        }
        catch(e){
            console.log("error");
        }
        
        
        
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
  