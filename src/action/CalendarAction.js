export const updateSelectCal = (cal) => {
  return {
    type: 'SELECT_CALENDAR_UPDATE',
    payload: cal,
  };
}

export const updateAllOtherCal = (data) => {
  return {
    type: 'ALL_OTHER_CAL_DATA_UPDATE',
    payload: data,
  };
}