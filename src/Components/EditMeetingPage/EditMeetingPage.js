
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import { Checkbox } from '@material-ui/core';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';

const useStyles = makeStyles(theme => ({
    container: {
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridGap: theme.spacing(3),
    },
    paper: {
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        whiteSpace: 'nowrap',
        marginBottom: theme.spacing(1),
    },
    divider: {
        margin: theme.spacing(2, 0),
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));



class EditMeetingPage extends Component{

    render() {
        return (
            <div style={{
                marginTop: '10vh',
                marginLeft: '10vh',
                marginRight: '10vh'
            }}>
                <Grid container spacing={3}>
                    <Grid item xs={4}>
                        <div style={{
                            fontSize: 20,
                            textAlign: 'center',
                            marginBottom: '3vh',
                        }}>Members
                        </div>
                        <Paper style={{
                            height: '61vh',
                            overflow: "scroll"
                        }}>
                            <FormControl component="fieldset" style={{
                                marginTop: '3vh',
                                marginLeft: '5vh',
                                paddingTop: '2vh'
                            }}>
                                <FormGroup>
                                    <FormControlLabel
                                        value="start"
                                        control={<Checkbox color="primary"/>}
                                        label="Start"
                                        labelPlacement="start"
                                    />

                                    <FormControlLabel
                                        value="start"
                                        control={<Checkbox color="primary"/>}
                                        label="Start"
                                        labelPlacement="start"
                                    />
                                    <FormControlLabel
                                        value="xxxxxxxxxxxxxxxx"
                                        control={<Checkbox color="primary"/>}
                                        label="xxxxxxxxxxxxxxxx"
                                        labelPlacement="start"
                                    />
                                    <FormControlLabel
                                        value="start"
                                        control={<Checkbox color="primary"/>}
                                        label="Start"
                                        labelPlacement="start"
                                    />
                                    <FormControlLabel
                                        value="start"
                                        control={<Checkbox color="primary"/>}
                                        label="Start"
                                        labelPlacement="start"
                                    />
                                    <FormControlLabel
                                        value="start"
                                        control={<Checkbox color="primary"/>}
                                        label="Start"
                                        labelPlacement="start"
                                    />
                                    <FormControlLabel
                                        value="start"
                                        control={<Checkbox color="primary"/>}
                                        label="Start"
                                        labelPlacement="start"
                                    />
                                    <FormControlLabel
                                        value="start"
                                        control={<Checkbox color="primary"/>}
                                        label="Start"
                                        labelPlacement="start"
                                    />
                                    <FormControlLabel
                                        value="start"
                                        control={<Checkbox color="primary"/>}
                                        label="Start"
                                        labelPlacement="start"
                                    />
                                    <FormControlLabel
                                        value="start"
                                        control={<Checkbox color="primary"/>}
                                        label="Start"
                                        labelPlacement="start"
                                    />
                                </FormGroup>
                            </FormControl>
                        </Paper>
                    </Grid>
                    <Grid item xs={8}>
                        <Paper style={{
                            height: '10vh',
                            marginBottom: '8vh',
                        }}></Paper>

                        <div style={{
                            marginLeft: '5vh',
                            marginBottom: '2vh',
                        }}> Notes: </div>
                        <Paper style={{
                            height: '45vh',
                        }}>

                        </Paper>
                    </Grid>

                </Grid>
                <Divider className='divider'/>

            </div>
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
