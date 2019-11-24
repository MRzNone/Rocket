import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Meeting } from "../../EarthBase";
import queryString from "query-string";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Checkbox } from '@material-ui/core';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import FormHelperText from '@material-ui/core/FormHelperText';

/**
 * Remove Members.
 */


const RemoveMembers = () => {
    const [state, setState] = React.useState({
        gilad: true,
        jason: false,
        antoine: false,
    });

    const handleChange = name => event => {
        setState({ ...state, [name]: event.target.checked });
    };

    const { gilad, jason, antoine } = state;
    const error = [gilad, jason, antoine].filter(v => v).length !== 2;

    return (
        <div>
            <Paper style={{
                height: '59.5vh',
                overflow: "scroll"
            }}>
                <FormControl component="fieldset" style={{
                    marginTop: '3vh',
                    marginLeft: '5vh',
                    paddingTop: '2vh'
                }}>
                    <FormLabel component="legend" style={{
                        textAlign: 'right'
                    }}>Members</FormLabel>

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

        </div>
    );
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
)(RemoveMembers);