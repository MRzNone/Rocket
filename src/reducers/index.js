import { combineReducers } from 'redux';
import CalendarReducer from './CalendarReducer';
import MeetingReducer from './MeetingReducer';


export default combineReducers({
  calendar: CalendarReducer,
  meeting: MeetingReducer,
});