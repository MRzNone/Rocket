import { combineReducers } from 'redux';
import CalendarReducer from './CalendarReducer'


export default combineReducers({
  calendar: CalendarReducer,
});