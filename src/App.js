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


function App() {
  return (
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
  );
}

export default App;
