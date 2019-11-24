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
    apiKey: "AIzaSyB2PVFQS5VRClqybChAazdYIn7fk3g3W7g",
    authDomain: "cse110firebase-b653b.firebaseapp.com",
    databaseURL: "https://cse110firebase-b653b.firebaseio.com",
    projectId: "cse110firebase-b653b",
    storageBucket: "cse110firebase-b653b.appspot.com",
    messagingSenderId: "494039804036",
    appId: "1:494039804036:web:550ac5388459573150bad1",
    measurementId: "G-KC1CX6P03G"
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
