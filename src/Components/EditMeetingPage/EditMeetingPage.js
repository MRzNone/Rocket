import React, { Component } from 'react';
import { connect } from 'react-redux';
import RemoveMembers from './RemoveMembers';
import EditNotes from './EditNotes';
import Result from './Result'
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import 'date-fns';
import Button from "@material-ui/core/Button";

class EditMeetingPage extends Component {

    render() {
        const params = new URLSearchParams(window.location.search);
        const meetingID = params.get("meetingId");
        const userID = params.get("userId");
        const { meeting } = this.props;
        //const { meetingID } = this.state;


        return (
            <div>
                <div style={{
                    flex: 0.5,
                    justifyContent: 'flex-end',
                    display: 'flex',
                    background: '#28282a',
                    marginBottom: 50,
                    flexDirection: 'row',
                }}>

                    <div style={{
                        flexDirection: 'row',
                        display: 'flex',
                        flex: 1,
                    }}>
                        <div style={{
                            marginRight: 50,
                            marginLeft: 10,
                            alignSelf: 'center',
                            color: 'white',
                            fontSize: 25
                        }}>
                            <h4>Meeting: {meeting.name}</h4>
                        </div>

                        <div style={{
                            alignSelf: 'center',
                            color: 'white',
                            fontSize: 15
                        }}>
                            <h4>Id: {meetingID}</h4>
                        </div>
                    </div>


                    <Button
                        color="default"
                        style={{
                            marginRight: 70,
                            fontSize: 20,
                            color: '#ff3366'
                        }}
                        onClick={() => this.props.history.push({
                            pathname: '/viewMeeting',
                            search: '?meetingId=' + meetingID + "&userId=" + userID
                        })}
                    >
                        Back to Meeting
                    </Button>

                </div>

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
                            <Result/>
                            <EditNotes/>
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
