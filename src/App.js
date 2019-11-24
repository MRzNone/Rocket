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
import ViewMeeting from './Components/ViewMeeting/ViewMeeting';
import * as firebase from "firebase";

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

  return (
    <Provider store={createStore(reducers, applyMiddleware(thunk))}>
      <Router>
        <Switch>
          <Route exact path="/" component={LandPage} />
          <Route path="/meeting" component={Meeting} />
          <Route path="/viewMeeting" component={ViewMeeting} />
          <Route component={LostPage} />
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
