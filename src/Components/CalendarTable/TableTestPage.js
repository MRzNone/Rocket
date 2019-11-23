import React, { Component } from 'react'
import CalendarSelectTable from './CalendarSelectTable';
import CalendarDispTable from './CalendarDispTable';
import { connect } from 'react-redux';
import { updateSelectCal, updateAllOtherCal } from '../../action';


export class TableTestPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      // dummy data in order to display something
      tableParams: {
        colNum: 7,
        rowNum: 10,
        colTitles: [],
        rowTitles: [],
      },
      initData: undefined,
      datafromOthers: undefined,
    }
  }

  componentWillMount() {
    // fetch data from data base
    const allData = [
      '[[0,0,0,0,0,0],[0,1,1,1,1,0],[0,1,1,1,1,0],[0,1,1,1,1,0],[0,1,1,1,1,0],[0,1,1,1,1,0],[0,1,1,1,1,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,1,1,1,0,0],[0,1,1,1,0,0],[0,1,1,1,0,0],[0,1,1,1,0,0],[0,1,1,1,0,0],[0,1,1,1,0,0],[0,1,1,1,0,0],[0,1,1,1,0,0],[0,1,1,1,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]]',
      '[[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,1,1,1,1,0],[0,1,1,1,1,0],[0,1,1,1,1,0],[0,1,1,1,1,0],[0,1,1,1,1,0],[0,1,1,1,1,0],[0,1,1,1,1,0],[0,1,1,1,1,0],[0,1,1,1,1,0],[0,1,1,1,1,0],[0,1,1,1,1,0],[0,1,1,1,1,0],[0,1,1,1,1,0],[0,1,1,1,1,0],[0,1,1,1,1,0],[0,1,1,1,1,0],[0,0,0,0,0,0]]',
      '[[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,1,1,1,1,0],[0,1,1,1,1,0],[0,1,1,1,1,0],[0,1,1,1,1,0],[0,1,1,1,1,0],[0,1,1,1,1,0],[0,1,1,1,1,0],[0,1,1,1,1,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]]'
    ];
    const colNum = 6;
    const rowNum = 24;
    const colTitles = ["colA", "colB", "colC", "colD", "colE", "colF"];
    const rowTitles = ["rowA", "rowB", "rowC"];

    // !!! USE undefined if there is no data
    // this is the current user data
    const initData = allData.shift(); // just need the String
    // this is the data from all others
    const datafromOthers = allData; // just need the string

    this.handleData(colNum, rowNum, colTitles, rowTitles, datafromOthers, initData);
  }

  componentDidMount() {
    this.props.updateAllOtherData(this.datafromOthers);
  }

  setData(data) {
    // this is the up to date data.  use this to update your data
    console.log(data);
    // e.g. this.MY_DATA = data
  }

  // just pass in all the necessary data.  This function will handle the rest
  // no need to parse data
  handleData(colNum, rowNum, colTitles, rowTitles, datafromOthers, initData) {
    const initDataArr =
      initData !== undefined ? JSON.parse(initData) : undefined;
    const datafromOthersArr = datafromOthers !== undefined ?
      datafromOthers.map(str => JSON.parse(str)) : undefined;

    // -----------
    const tableParams = {
      colNum,
      rowNum,
      colTitles,
      rowTitles,
    };

    this.setState({
      initData: initDataArr,
      datafromOthers: datafromOthersArr,
      tableParams,
    });
  }

  render() {
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
            tableObservSetter={this.setData.bind(this)}
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
}

// copy
const mapDispatchToProps = dispatch => {
  return {
    updateSelectTableData: data => {
      dispatch(updateSelectCal(data));
    },
    updateAllOtherData: data => {
      dispatch(updateAllOtherCal(data));
    }
  }
}

export default connect(undefined, mapDispatchToProps)(TableTestPage);
//------ Change TableTestPage to your component name