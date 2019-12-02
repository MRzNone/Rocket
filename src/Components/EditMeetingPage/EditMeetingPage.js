import React, { Component } from 'react';
import { connect } from 'react-redux';
import RemoveMembers from './RemoveMembers';
import EditNotes from './EditNotes';
import Selects from './Selects'
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import 'date-fns';
import Button from "@material-ui/core/Button";

class EditMeetingPage extends Component {

    render() {
        const params = new URLSearchParams(window.location.search);
        const meetingID = params.get("meetingId");
        const userID = params.get("userId");

        return (
            <div>
                <div style={{
                    marginTop: '15vh',
                    marginLeft: '10vh',
                    marginRight: '10vh',
                }}>
                    <Grid container spacing={3}>
                        <Grid item xs={4}>
                            <RemoveMembers/>
                        </Grid>
                        <Grid item xs={8}>
                            <Selects/>
                            <EditNotes/>
                            <Button variant="outlined" color="default" onClick={() => this.props.history.push({
                                pathname: '/sendResult',
                                search: '?meetingId=' + meetingID + "&userId=" + userID,
                            })}
                                    style={{margin:'5%'}}>
                                Share Meeting Results
                            </Button>

                            <Button variant="outlined" color="default" style={{margin:'5%'}} onClick={() => this.props.history.push({
                                pathname: '/viewMeeting',
                                search: '?meetingId=' + meetingID + "&userId=" + userID,
                            })}
                            > Back to Meeting
                            </Button>
                        </Grid>
                    </Grid>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        meeting: state.meeting,
    };
}

const mapDispatchToProps = {

};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EditMeetingPage);
