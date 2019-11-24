export const fetchMeetingData = (prom) => {
  return async dispatch => {
    const data = await prom.then();
    dispatch({
      type: "FETCH_MEETING_DATA",
      payload: data,
    });
  }
}