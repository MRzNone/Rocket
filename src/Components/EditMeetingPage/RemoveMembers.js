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
import Container from "@material-ui/core/Container";
import FormHelperText from '@material-ui/core/FormHelperText';

/**
 * Remove Members.
 */


const RemoveMembers = () => {
    const [state, setState] = React.useState({
        Amy: false,
        Bee: false,
        Cat: false,
        Dog: false,
        Each: false,
        Fat: false,
        Good: false,
        Hit: false,
        Ice: false,
        Job: false,
        Kit: false
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
                overflow: "scroll",
            }}>
                <Container maxWidth="xl">
                <FormControl component="fieldset" style={{
                    marginTop: '3vh',
                    marginLeft: '5vh',
                    paddingTop: '2vh'
                }}>
                    <FormLabel component="legend" style={{
                        textAlign: 'right',
                        fontSize: 25,
                    }}>Members</FormLabel>

                    <FormGroup style={{textAlign:'center', width: '100%'}}>
                        <FormControlLabel
                            value="Amy"
                            control={<Checkbox color="primary" onChange={handleChange('Amy')}/>}
                            label="Amy"
                            labelPlacement="start"
                        />
                        <FormControlLabel
                            value="Bob"
                            control={<Checkbox color="primary" onChange={handleChange('Bob')}/>}
                            label="Bob"
                            labelPlacement="start"
                        />
                        <FormControlLabel
                            value="Cat"
                            control={<Checkbox color="primary" onChange={handleChange('Cat')}/>}
                            label="Cat"
                            labelPlacement="start"
                        />
                        <FormControlLabel
                            value="Dog"
                            control={<Checkbox color="primary" onChange={handleChange('Dog')}/>}
                            label="Dog"
                            labelPlacement="start"
                        />
                        <FormControlLabel
                            value="Each"
                            control={<Checkbox color="primary" onChange={handleChange('Each')}/>}
                            label="Each"
                            labelPlacement="start"
                        />
                        <FormControlLabel
                            value="Fat"
                            control={<Checkbox color="primary" onChange={handleChange('Fat')}/>}
                            label="Fat"
                            labelPlacement="start"
                        />
                        <FormControlLabel
                            value="Good"
                            control={<Checkbox color="primary" onChange={handleChange('Good')}/>}
                            label="Good"
                            labelPlacement="start"
                        />
                        <FormControlLabel
                            value="Hit"
                            control={<Checkbox color="primary" onChange={handleChange('Hit')}/>}
                            label="Hit"
                            labelPlacement="start"
                        />
                        <FormControlLabel
                            value="Ice"
                            control={<Checkbox color="primary" onChange={handleChange('Ice')}/>}
                            label="Ice"
                            labelPlacement="start"
                        />
                        <FormControlLabel
                            value="Job"
                            control={<Checkbox color="primary" onChange={handleChange('Job')}/>}
                            label="Job"
                            labelPlacement="start"
                        />
                        <FormControlLabel
                            value="Kit"
                            control={<Checkbox color="primary" onChange={handleChange('Kit')}/>}
                            label="Kit"
                            labelPlacement="start"
                        />
                    </FormGroup>
                </FormControl>
                </Container>
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