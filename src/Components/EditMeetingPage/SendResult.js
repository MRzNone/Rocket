import emailjs from 'emailjs-com';
import {connect} from "react-redux";

const templateParams = {
    email: 'p1fan@ucsd.edu',
    meeting_name: 'Check this out!',
    to_name: 'Ailsa',
    meeting_time: 'Nov.11 11:11',
    message_note: 'haha'
};

emailjs.send('rocket','rocket', templateParams, 'user_IenZPlJja0a5wyeaWq2WJ')
    .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
    }, (err) => {
        console.log('FAILED...', err);
    });

const mapStateToProps = (state, ownProps) => {
    return {

    };
};

const mapDispatchToProps = {

};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(emailjs.send);