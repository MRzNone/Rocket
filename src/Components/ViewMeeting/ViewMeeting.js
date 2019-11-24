import React, { Component } from 'react';
import queryString from 'query-string';
import { connect } from 'react-redux';
import { Meeting } from '../../EarthBase';
import { updateSelectCal, updateAllOtherCal, fetchMeetingData } from '../../action';
import { Button } from '@material-ui/core';
import { util } from 'node-forge';
import CalendarSelectTable from '../CalendarTable/CalendarSelectTable';
import CalendarDispTable from '../CalendarTable/CalendarDispTable';

export class ViewMeeting extends Component {
  constructor(props) {
    super(props);

    this.meetingDB = new Meeting();

    this.state = {
      userId: undefined,
      meetingID: undefined,
      tableParams: {
        colNum: 7,
        rowNum: 10,
        colTitles: [],
        rowTitles: [],
      },
      initData: undefined,
      datafromOthers: undefined,
      calInit: false,
    }
  }

  componentWillMount() {
    this.fetchData();
  }
  componentDidUpdate() {
    if (Object.entries(this.props.meeting).length !== 0 && this.state.calInit === false) {
      this.initCalendar();
    }
  }

  fetchData() {
    // get meeting id
    const params = queryString.parse(this.props.location.search);
    const meetingID = params.meetingId;
    const userId = params.userId;

    this.setState({
      meetingID: meetingID,
      userId: userId,
    });

    this.props.fetchMeetingData(this.meetingDB.fetchMeetingData(meetingID));
  }

  copyToClip(url) {
    navigator.clipboard.writeText(url);
  }

  renderHeader() {
    const { meeting } = this.props;
    const { meetingID } = this.state;

    return (
      <div style={{
        flexDirection: 'row',
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 50,
      }}>
        <div style={{
          flexDirection: 'row',
          display: 'flex',
          flex: 1,
        }}>
          <div style={{
            marginRight: 50,
            alignSelf: 'center',
          }}>
            <h4>Meeting: {meeting.name}</h4>
          </div>

          <div style={{
            alignSelf: 'center',
          }}>
            <h4>Id: {meetingID}</h4>
          </div>
        </div>

        <div style={{
          flex: 0.5,
          justifyContent: 'flex-end',
          display: 'flex'
        }}>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            style={{ marginRight: 70 }}
            onClick={() => this.props.history.push("/")}
          >
            Back to Main
            </Button>
        </div>
      </div>
    );
  }

  renderToolBar() {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flex: 0.4,
          }}
        >
          <div style={{
            flex: 0.4,
          }}>
            <Button
              variant="outlined"
              color="primary"
              size="large"
            >
              Notes
              </Button>
          </div>

          <div style={{
            flex: 0.6,
            alignSelf: 'center',
          }}>
            <h4>Results:</h4>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flex: 0.6,
            justifyContent: 'space-between',
          }}
        >
          <Button
            variant="outlined"
            color="primary"
            size="large"
          >
            Import Schedule
            </Button>

          <Button
            variant="outlined"
            color="primary"
            size="large"
          >
            Edit Meeting
            </Button>

          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={() => this.copyToClip(window.location.href)}
          >
            Copy meeting link
            </Button>
        </div>
      </div>
    );
  }

  handleCalData(colNum, rowNum, colTitles, rowTitles, datafromOthers, initData) {
    const initDataArr =
      initData !== undefined ? JSON.parse(initData) : undefined;
    const datafromOthersArr = datafromOthers.map(str => str !== undefined ? JSON.parse(str) : undefined);

    // -----------
    const tableParams = {
      colNum,
      rowNum,
      colTitles,
      rowTitles,
    };

    this.props.updateAllOtherData(datafromOthersArr);

    this.setState({
      initData: initDataArr,
      datafromOthers: datafromOthersArr,
      tableParams,
    });
  }

  minToTimeStr(min) {
    const hour = String(Math.floor(min / 60));
    let minutes = String(min % 60);
    if (minutes.length < 2) {
      minutes = "0" + minutes;
    }

    return util.format("%s:%s", hour, minutes);
  }

  initCalendar() {
    const { colNum, rowNum, dates,
      timeWindow, members } = this.props.meeting;

    // prepare colTitles
    const colTitles = dates.map(
      date => date.getMonth() + "/" + date.getDate()
    );

    // prepare rowTitles
    const startTime = timeWindow[0];
    const endTime = timeWindow[1];

    const diffStep = (endTime - startTime) / rowNum;

    const rowTitles = [];
    for (let i = 0; i < rowNum; i++) {
      rowTitles.push(this.minToTimeStr(startTime + diffStep * i));
    }

    // prepare initData and datafromOthers
    let initData = undefined;
    const datafromOthers = [];

    for (let [userId, memberData] of Object.entries(members)) {
      const tData = memberData.timeSlots !== null ? memberData.timeSlots : undefined;
      if (userId === this.state.userId) {
        initData = tData;
      } else {
        datafromOthers.push(tData);
      }
    }

    this.handleCalData(colNum, rowNum, colTitles,
      rowTitles, datafromOthers, initData);

    this.setState({
      calInit: true,
    })
  }

  updateSelectCalData(data) {
    const userId = this.state.userId;
    if (userId !== undefined) {
      this.meetingDB.updateMemberSelection(userId, data);
    }
  }

  renderCal() {
    if (this.state.calInit === false) {
      return (<div></div>);
    }

    // copy
    let selectTableParams = Object.assign({
      initData: this.state.initData
    }, this.state.tableParams);

    let displayTableParams = Object.assign({}, this.state.tableParams);
    // ----

    // your component
    return (
      <div style={{ flexDirection: 'row', display: 'flex' }}>
        <div>
          <div style={{ textAlign: 'center' }}>
            <p>Select</p>
          </div>
          <CalendarSelectTable {...selectTableParams}
            // optional
            tableObservSetter={this.updateSelectCalData.bind(this)}
          />
        </div>

        <div style={{ width: 30, height: 100 }} />

        <div>
          <div style={{ textAlign: 'center' }}>
            <p>Display</p>
          </div>
          <CalendarDispTable {...displayTableParams} />
        </div>
      </div>
    )
  }


  render() {
    if (Object.entries(this.props.meeting).length === 0) {
      return (<div />);
    }


    return (
      <div>
        {/* Header */}
        {this.renderHeader()}

        {/* Notes, edit, etc bar */}
        {this.renderToolBar()}

        {/* Calendar Stuff */}
        {this.renderCal()}
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateSelectTableData: data => {
      dispatch(updateSelectCal(data));
    },
    updateAllOtherData: data => {
      dispatch(updateAllOtherCal(data));
    },
    fetchMeetingData: (prom) => {
      dispatch(fetchMeetingData(prom));
    }
  };
}

const mapStateToProps = state => {
  return {
    meeting: state.meeting,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewMeeting);