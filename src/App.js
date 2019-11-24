import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import LandPage from './Components/NewLandPage/landPage';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers';
import thunk from 'redux-thunk';
import Meeting from './Components/Meeting/Meeting';
import MeetingResponse from './Components/MeetingResponse/MeetingResponse';
import LostPage from './Components/LostPage/LostPage';
import JoinMeeting from './Components/JoinMeeting/JoinMeeting';
import MeetingLogin from './Components/MeetingLogin/MeetingLogin';
import { createMuiTheme } from '@material-ui/core/styles';
import { MuiThemeProvider } from 'material-ui/styles';

import 'typeface-roboto';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#757ce8',
      main: '#3f50b5',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },
  },
});

function App() {
  return (
    <MuiThemeProvider theme={theme}>
    <Provider store={createStore(reducers, applyMiddleware(thunk))}>
      <Router>
        <Switch>
            <Route exact path="/" component={LandPage} />
            <Route path="/meeting" component={Meeting} />
            <Route path="/meetingresponse" component={MeetingResponse} />
            <Route path="/joinmeeting" component={JoinMeeting} />
            <Route path="/meetinglogin" component={MeetingLogin} />
            <Route component={LostPage} />
        </Switch>
      </Router>
    </Provider>
    </MuiThemeProvider>
  );
}

export default App;
