import React, { Component } from 'react';
import queryString from 'query-string';
import { connect } from 'react-redux';
import { Meeting } from '../../EarthBase';
import { updateSelectCal, updateAllOtherCal, fetchMeetingData } from '../../action';
import { Button } from '@material-ui/core';
import { util } from 'node-forge';
import CalendarSelectTable from '../CalendarTable/CalendarSelectTable';
import CalendarDispTable from '../CalendarTable/CalendarDispTable';
import { Member } from '../../EarthBase/Member';
import Popup from "reactjs-popup";
import ImportCal from "../ImportCal/ImportCal";
import CopyToClipboard from 'react-copy-to-clipboard';


export class ViewMeeting extends Component {
  constructor(props) {
    super(props);

    this.meetingDB = new Meeting();
    this.memberDB = new Member();

    this.state = {
      notes: undefined,
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

  UNSAFE_componentWillMount() {
    this.fetchData();
  }

  componentDidUpdate() {
    if ("status" in this.props.meeting) {
      console.error("Invlid meeting");
      this.props.history.push('/');
      return;
    }

    if (Object.entries(this.props.meeting).length !== 0 && this.state.calInit === false) {
      this.initCalendar();
    }
  }

  fetchData() {
    // get meeting id
    const params = queryString.parse(this.props.location.search);
    const meetingID = params.meetingId;
    const userId = params.userId;

    if (meetingID !== undefined && userId === undefined) {
      this.props.history.push('/meetinglogin?meetingId=' + meetingID);
      return;
    }

    if (meetingID === undefined || userId === undefined) {
      console.error("Invlid parameters");
      this.props.history.push("/");
      return;
    }

    this.setState({
      meetingID: meetingID,
      userId: userId,
      initData: undefined,
      datafromOthers: undefined,
      calInit: false,
    });

    this.props.fetchMeetingData(this.meetingDB.fetchMeetingData(meetingID));

    this.setFillGrid = undefined;
  }

  redirectToEdit = () => {
    const { userId, meetingID } = this.state;
    const { meeting } = this.props;
    if (userId === meeting.hostId) {
      this.props.history.push({
        pathname: '/editMeeting',
        search: '?meetingId=' + meetingID + "&userId=" + userId,
      })
    }
    else {
      alert("Sorry, you don't have the permission to edit this meeting.")
    }
  }

  copyToClip() {
    const url = window.location.origin + '/viewmeeting?meetingId=' + this.state.meetingID;
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
        background: '#28282a',
        marginBottom: 50,
      }}>
        <div style={{
          flexDirection: 'row',
          display: 'flex',
          flex: 1,
        }}>
          <div style={{
            marginRight: 50,
            marginLeft: 10,
            alignSelf: 'center',
            color: 'white',
            fontSize: 25
          }}>
            <h4>Meeting: {meeting.name}</h4>
          </div>

          <div style={{
            alignSelf: 'center',
            color: 'white',
            fontSize: 15
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
            color="default"
            style={{
              marginRight: 70,
              fontSize: 20,
              color: '#ff3366'
            }}
            onClick={() => this.props.history.push("/")}
          >
            Back to Main
          </Button>

        </div>


      </div>

    );
  }

  renderToolBar() {
    const { meetingID, userId } = this.state;
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          flex: 0.9,
          marginLeft: 80

        }}>

        </div>
        <div style={{
          left: 0

        }}>
          <Popup modal trigger={
            <Button
              variant="outlined"
              size="large"
              style={{
                backgroundColor: "#ff3366",
                color: 'white',
                marginRight: 10
              }}

            >
              Import Schedule
                </Button>}>
            {close => (
              <ImportCal
                location={this.props.location}
                close={() => {
                  close();
                  this.memberDB.getMemberTimeSlot(this.state.userId).then(newData => {
                    this.setFillGrid(newData);
                  })

                }}
              />
            )}
          </Popup>
          <Button
            variant="outlined"
            size="large"
            onClick={this.redirectToEdit.bind(this)}
            style={{
              backgroundColor: "#ff3366",
              color: 'white',
              marginRight: 10
            }}
          >
            Edit Meeting
            </Button>

          <CopyToClipboard text={window.location.origin + '/viewmeeting?meetingId=' + this.state.meetingID}>
            <Button
              variant="outlined"
              size="large"
              style={{
                backgroundColor: "#ff3366",
                color: 'white',
                marginRight: 10
              }}
            >
              Copy meeting link
            </Button>
          </CopyToClipboard>
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
    const { rowNum, dates,
      timeWindow, members } = this.props.meeting;

    if (!(this.state.userId in members)) {
      console.error("Invalid user");
      this.props.history.push("/");
      return;
    }

    const colNum = dates.length;

    const sortedDates = dates.sort(function (a, b) {
      return a > b ? 1 : -1;
    });

    // prepare colTitles
    const colTitles = sortedDates.map(
      date => (date.getMonth() + 1) + "/"
        + date.getDate() + "/" + date.getFullYear()
    );

    // prepare rowTitles
    const startTime = timeWindow[0];
    const endTime = timeWindow[1];

    const diffStep = (endTime - startTime) / rowNum;

    const rowTitles = [];
    for (let i = 0; i <= rowNum; i++) {
      rowTitles.push(this.minToTimeStr(startTime + diffStep * i));
    }

    // prepare initData and datafromOthers
    let initData = undefined;
    const datafromOthers = [];

    for (let [userId, memberData] of Object.entries(members)) {
      const rawData = memberData.timeSlots;
      const tData = rawData !== null && rawData !== "" ? rawData : undefined;

      if (userId === this.state.userId) {
        initData = tData;
      } else {
        if (tData !== undefined) {
          datafromOthers.push(tData);
        }
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
      this.memberDB.updateMemberSelection(userId, data);
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
        <div style={{ flex: 1 }} >
          <div style={{ textAlign: 'center' }}>
            <p>Select</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <CalendarSelectTable {...selectTableParams}
              tableObservSetter={this.updateSelectCalData.bind(this)}
              setFillGrid={(func) => {
                this.setFillGrid = func;
              }}
            />
          </div>
        </div>

        <div style={{ width: 30, height: 100 }} />

        <div style={{ flex: 1 }} >
          <div style={{ textAlign: 'center' }}>
            <p>Display</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <CalendarDispTable {...displayTableParams} />
          </div>
        </div>
      </div>
    )
  }


  render() {
    if ("status" in this.props.meeting) {
      return (<div></div>);
    }

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