import 'date-fns';
import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import {connect} from "react-redux";
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";

function Selects() {
    // The first commit of Material-UI
    const [startTime, setStartTime] = React.useState(new Date('2014-08-18T21:11:54'));
    const [endTime, setEndTime] = React.useState(new Date('2014-08-18T21:11:54'));

    const handleSTDateChange = date => {
        setStartTime(date);
    };
    const handleEDDateChange = date => {
        setEndTime(date);
    };

    /* length */
    const [length, setLength] = React.useState('');

    const inputLabelL = React.useRef(null);

    const handleChangeL = event => {
        setLength(event.target.value);
    };

    /* final result */
    const [time, setTime] = React.useState('');

    const inputLabelT = React.useRef(null);

    const handleChangeT = event => {
        setTime(event.target.value);
    };

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>

            <KeyboardTimePicker
                margin="normal"
                id="time-picker"
                label="Start Time"
                value={startTime}
                onChange={handleSTDateChange}
                KeyboardButtonProps={{
                    'aria-label': 'change start time',
                }}
                style={{width: 150, margin:10}}
            />
            <KeyboardTimePicker
                margin="normal"
                id="time-picker"
                label="End Time"
                value={endTime}
                onChange={handleEDDateChange}
                KeyboardButtonProps={{
                    'aria-label': 'change end time',
                }}
                style={{width: 150, margin:10}}
            />
            <FormControl style={{width:150, margin:10,  marginTop: 10}}>
                <InputLabel shrink id="length-label" >Length</InputLabel>
                <Select
                    labelId="length-label"
                    id="length"
                    value={length}
                    onChange={handleChangeL}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    <MenuItem value={10}>30 min</MenuItem>
                    <MenuItem value={20}>1 hr</MenuItem>
                    <MenuItem value={30}>1.5 hr</MenuItem>
                    <MenuItem value={40}>2 hr</MenuItem>
                    <MenuItem value={50}>2.5 hr</MenuItem>
                    <MenuItem value={60}>3 hr</MenuItem>
                </Select>
            </FormControl>
            <FormControl  style={{width:150, margin:10, marginTop: 10, marginBottom:27}}>
                <InputLabel shrink id="result-label" >Final Result</InputLabel>
                <Select
                    labelId="result-label"
                    id="result"
                    value={time}
                    onChange={handleChangeT}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    <MenuItem value={10}>Nov.10 08:00</MenuItem>
                    <MenuItem value={20}>Nov.12 08:30</MenuItem>
                    <MenuItem value={30}>Nov.12 12:30</MenuItem>
                    <MenuItem value={40}>Nov.13 15:00</MenuItem>
                </Select>
            </FormControl>

        </MuiPickersUtilsProvider>
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
)(Selects);
