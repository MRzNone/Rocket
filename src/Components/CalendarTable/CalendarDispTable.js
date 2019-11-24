import React, { Component } from 'react';
import { util } from 'node-forge';
import { connect } from 'react-redux';

const CELL_WIDTH = 30;
const CELL_HEIGHT = 15;

const COLOR_BUF_RATIO = 0.25;
const COLOR_REM_RATIO = 1 - COLOR_BUF_RATIO;
const TARGET_COLOR = {
  'r': 30,
  'g': 153,
  'b': 25,
};

class CalendarDispTable extends Component {
  /**
     * Propos needs:
     * colNum: int, # of columns
     * rowNum: int, # of rows
     * colTitles: [String], title of each column (on the left, vertical layout)
     *                      evenly layout vertically
     * rowTitles: [String], title of row column (on the left, vertical layout)
     *                      evenly layout horizontally.
     * allTimeSlots: [String] all time slots, each String is a stringfy object.
     */

  copyGrid(grid) {
    return JSON.parse(JSON.stringify(grid));
  }

  renderGrid() {
    const { colNum, rowNum } = this.props

    const { grid, max } = this.combineAllGrid();

    return grid.map((row, i) => {
      // render the row
      const rowCells = row.map((fill, j) => {
        let cellStyle = Object.assign({}, Style.baseCellStyle);

        let color = util.format("rgb(%s, %s, %s)",
          TARGET_COLOR.r * fill * COLOR_REM_RATIO / max
          + TARGET_COLOR.r * COLOR_BUF_RATIO,
          TARGET_COLOR.g * fill * COLOR_REM_RATIO / max
          + TARGET_COLOR.g * COLOR_BUF_RATIO,
          TARGET_COLOR.b * fill * COLOR_REM_RATIO / max
          + TARGET_COLOR.b * COLOR_BUF_RATIO
        );
        cellStyle['backgroundColor'] = fill !== 0 ? color : "rgba(0, 0, 0, 0)";

        // deal last row
        if (i + 1 === rowNum) {
          cellStyle['borderBottom'] = '0.5px solid black';
        }

        // deal last column
        if (j + 1 === colNum) {
          cellStyle['borderRight'] = '0.5px solid black';
        }

        return (
          <div
            key={"calendar-col-" + j}
            style={cellStyle}
          />
        );
      });

      const rowComponent = (
        <div
          style={Style.rowContainer}
          key={"calendar-row-" + i}
        >
          {rowCells}
        </div>
      );

      return rowComponent;
    });
  }

  renderColTitle() {
    const { colTitles } = this.props;

    if (colTitles === undefined) {
      return;
    }

    const titles = [];

    for (let i = 0; i < colTitles.length; i++) {
      titles.push(
        <div
          key={"col-title-" + i}
          style={Style.colTitleCell}
        >
          {colTitles[i]}
        </div>
      );
    }

    return (
      <div style={Style.colTitleContainer}>
        {titles}
      </div>
    );
  }

  renderRowTitle() {
    const { rowTitles, rowNum } = this.props;

    if (rowTitles === undefined) {
      return;
    }

    const titles = [];

    for (let i = 0; i < rowTitles.length; i++) {
      titles.push(
        <div
          key={"row-title-" + i}
          style={Style.rowTitleCell}
        >
          {rowTitles[i]}
        </div>
      );
    }

    return (
      <div style={{
        ...Style.rowTitleContainer,
        height: rowNum * (CELL_HEIGHT + 0.5),
      }}>
        {titles}
      </div >
    );
  }

  mergeGrid(a, b) {
    const R = a.length;
    const H = a[0].length;

    let c = [...Array(R)].map(e => Array(H).fill(0));

    for (let i = 0; i < R; i++) {
      for (let j = 0; j < H; j++) {
        c[i][j] = a[i][j] + b[i][j];
      }
    }

    return c;
  }

  combineAllGrid() {
    const { calData, rowNum, colNum } = this.props;

    let grid = [...Array(rowNum)].map(e => Array(colNum).fill(0));

    for (let arrTime of calData) {
      grid = this.mergeGrid(grid, arrTime);
    }

    // find max
    let max = -1;
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[0].length; j++) {
        max = max > grid[i][j] ? max : grid[i][j];
      }
    }

    return { grid, max };
  }

  render() {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        WebkitUserSelect: 'none'
      }}>
        <div style={{
          paddingTop: CELL_HEIGHT + 1,
        }}>
          {this.renderRowTitle()}
        </div>

        <div>
          {this.renderColTitle()}
          <div
            style={{ display: 'inline' }}
          >
            {this.renderGrid()}
          </div >
        </div>
      </div>
    );
  }
}


const Style = {
  baseCellStyle: {
    width: CELL_WIDTH,
    height: CELL_HEIGHT,
    borderTop: '0.5px solid black',
    borderLeft: '0.5px solid black',
  },
  rowContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  colTitleCell: {
    maxWidth: CELL_WIDTH,
    marginRight: 1,
    fontSize: 10,
    textAlign: 'center',
    flex: 1,
  },
  colTitleContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  rowTitleCell: {
    minHeight: CELL_HEIGHT,
    fontSize: 10,
    flex: 1,
    marginTop: 0.5,
  },
  rowTitleContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
};

const mapStateToProps = state => {
  const { selectCal, allOtherData } = state.calendar;

  let combinedData = [];

  if (selectCal !== undefined && selectCal.length !== 0) {
    combinedData = combinedData.concat([selectCal]);
  }

  if (allOtherData !== undefined && allOtherData.length !== 0) {
    combinedData = combinedData.concat(allOtherData);
  }

  return {
    calData: combinedData,
  }
}

export default connect(mapStateToProps)(CalendarDispTable);
