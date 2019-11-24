import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as db from "firebase";

import TextField from '@material-ui/core/TextField';


/**
 * Edit Notes.
 */
const EditNotes = () => {

    const [value, setValue] = React.useState('Controlled');

    const handleChange = event => {
        setValue(event.target.value);
    };

    return (
        <form noValidate autoComplete="off">
            <TextField
                id="outlined-multiline-static"
                multiline
                rows="16"
                defaultValue="Notes: "
                variant="outlined"
                style={{
                    width:'100%',
                    flexWrap: 'wrap',
                }}
            />
        </form>
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
)(EditNotes);
