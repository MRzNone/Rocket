import React from 'react';
import './App.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import * as firebase from "firebase";
import NewLandPage from './Components/NewLandPage/landPage';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers';
import thunk from 'redux-thunk';

import Meeting from './Components/Meeting/Meeting';
import MeetingResponse from './Components/MeetingResponse/MeetingResponse';
import LostPage from './Components/LostPage/LostPage';
import JoinMeeting from './Components/JoinMeeting/JoinMeeting';
import MeetingLogin from './Components/MeetingLogin/MeetingLogin';
// import { createMuiTheme } from '@material-ui/core/styles';
// import { MuiThemeProvider } from 'material-ui/core/styles';
import CreateNewUser from './Components/CreateNewUser/CreateNewUser';
import ViewMeeting from './Components/ViewMeeting/ViewMeeting';
import EditMeetingPage from "./Components/EditMeetingPage/EditMeetingPage";
import CreateMeeting from "./Components/CreateMeeting/CreateMeeting";
import SendResult from "./Components/EditMeetingPage/SendResult";

// import 'typeface-roboto';

// const theme = createMuiTheme({
//   palette: {
//     primary: {
//       light: '#757ce8',
//       main: '#3f50b5',
//       dark: '#002884',
//       contrastText: '#fff',
//     },
//     secondary: {
//       light: '#ff7961',
//       main: '#f44336',
//       dark: '#ba000d',
//       contrastText: '#000',
//     },
//   },
// });

function App() {
    const firebaseConfig = {
        apiKey: "AIzaSyBj8CmEsvlDHyjbd74-kNfrAVeXDc3ZjfQ",
        authDomain: "cse110project-8d6be.firebaseapp.com",
        databaseURL: "https://cse110project-8d6be.firebaseio.com",
        projectId: "cse110project-8d6be",
        storageBucket: "cse110project-8d6be.appspot.com",
        messagingSenderId: "24482060507",
        appId: "1:24482060507:web:ab018bc0415a3250a854fe",
        measurementId: "G-Q7P86Y5NGR"
    };

    // init firebase
    firebase.initializeApp(firebaseConfig);

<<<<<<< HEAD
    return (
        <Provider store={createStore(reducers, applyMiddleware(thunk))}>
          <Router>
            <Switch>
              <Route exact path="/" component={LandPage} />
              <Route path="/meeting" component={Meeting} />
              <Route path="/viewMeeting" component={ViewMeeting} />
              <Route path="/createMeeting" component={CreateMeeting} />
              <Route path="/editMeeting" component={EditMeetingPage} />
              <Route path="/sendResult" component={SendResult} />
              <Route component={LostPage} />
            </Switch>
          </Router>
        </Provider>
    );
=======
  return (
    // <MuiThemeProvider theme={theme}>
    <Provider store={createStore(reducers, applyMiddleware(thunk))}>
      <Router>
        <Switch>
          <Route exact path="/" component={NewLandPage} />
          <Route path="/meeting" component={Meeting} />
          <Route path="/meetingresponse" component={MeetingResponse} />
          <Route path="/joinmeeting" component={JoinMeeting} />
          <Route path="/meetinglogin" component={MeetingLogin} />
          <Route path="/createnewuser" component={CreateNewUser} />
          <Route path="/viewmeeting" component={ViewMeeting} />
          <Route path="/createmeeting" component={CreateMeeting} />
          <Route component={LostPage} />
        </Switch>
      </Router>
    </Provider>
    // </MuiThemeProvider>
  );
>>>>>>> faa49c7587090482d7cb884a251902f3645e860e
}

export default App;