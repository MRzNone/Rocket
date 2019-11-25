import React, { Component } from 'react';
import { connect } from 'react-redux';
import RemoveMembers from './RemoveMembers';
import EditNotes from './EditNotes';
import Selects from './Selects'
import Grid from '@material-ui/core/Grid';
import Button from "@material-ui/core/Button";
import Divider from '@material-ui/core/Divider';
import 'date-fns';
import {Meeting} from "../../EarthBase";

//import SendResult from "./SendResult";

class EditMeetingPage extends React.Component {

    render() {
        return (
            <>
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
                        </Grid>
                    </Grid>
                    <div >
                    <Button variant="outlined" color="default" style={{margin:'5%'}}>
                        Remove User
                    </Button>

                    <Button variant="outlined" color="default" style={{margin:'5%'}}>
                        Save Changes
                    </Button>

                    <Button variant="outlined" color="default" /*onClick={SendResult}*/ style={{margin:'5%'}}>
                        Share Meeting Results
                    </Button>

                    <Button variant="outlined" color="default" style={{margin:'5%'}}>
                        Back to Meeting
                    </Button>
                    </div>
                </div>
            </>
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
)(EditMeetingPage);
