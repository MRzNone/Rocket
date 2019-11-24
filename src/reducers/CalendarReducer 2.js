const INITIAL_STATE = {
  selectCal: [],
  allOtherData: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SELECT_CALENDAR_UPDATE':
      return { ...state, selectCal: action.payload };
    case 'ALL_OTHER_CAL_DATA_UPDATE':
      return { ...state, allOtherData: action.payload };
    default:
      return state;
  }
}