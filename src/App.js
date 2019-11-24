import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import LandPage from './Components/LandPage/LandPage';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers';
import thunk from 'redux-thunk';
import Meeting from './Components/Meeting/Meeting';
import LostPage from './Components/LostPage/LostPage';
import EditMeetingPage from './Components/EditMeetingPage/EditMeetingPage';


function App() {

  return (
    <Provider store={createStore(reducers, applyMiddleware(thunk))}>
      <Router>
        <Switch>
          <Route exact path="/" component={LandPage} />
          <Route path="/meeting" component={Meeting} />
          <Route path="/edit" component={EditMeetingPage} />

          <Route component={LostPage} />
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
