import React, { Component } from 'react';

const CELL_WIDTH = 30;
const CELL_HEIGHT = 10;

class CalendarTable extends Component {
  /**
     * Propos needs:
     * colNum: int, # of columns
     * rowNum: int, # of rows
     * colTitles: [String], title of each column (on the left, vertical layout)
     *                      evenly layout vertically
     * rowTitles: [String], title of row column (on the left, vertical layout)
     *                      evenly layout horizontally.
     * tableSetter: Function, optional, a setter to update data.
     * 
     * 
     * Example:
     *   tableSetter(table) {
     *    this.table = table;
     *  }
     *
     *  render() {
     *    let p = {
     *      colNum: 3,
     *      rowNum: 24,
     *      colTitles: ["colA", "colB", "colC"],
     *      rowTitles: ["rowA", "rowB", "rowC"],
     *    };
     *
     *    return (
     *      // <div> LandPage </div>
     *      <div>
     *        <CalendarTable
     *          {...p}
     *          tableSetter={this.tableSetter.bind(this)}
     *        />
     *        <Button
     *          onClick={e => console.log(this.table)}
     *        >Click</Button>
     *      </div>
     *    );
     *  }
     */
  constructor(props) {
    super(props);

    const { colNum, rowNum } = this.props;

    const fillGrid = [...Array(rowNum)].map(e => Array(colNum).fill(false));

    this.state = {
      fillGrid,
      tempGrid: undefined,
      startDragging: false,
      startDrag: undefined,
      endDrag: undefined,
      targetVal: undefined,
    };
  }

  copyGrid(grid) {
    return JSON.parse(JSON.stringify(grid));
  }

  renderGrid() {
    const { colNum, rowNum } = this.props

    let grid = this.state.startDrag ?
      this.state.tempGrid : this.state.fillGrid;

    return grid.map((row, i) => {
      // render the row
      const rowCells = row.map((ifFilled, j) => {
        let cellStyle = Object.assign({}, Style.baseCellStyle);
        cellStyle['backgroundColor'] = ifFilled ? "rgb(30, 153,25)" : "rgba(0, 0, 0, 0)";

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
            onMouseDown={e => {
              this.setState({
                startDrag: [i, j],
                endDrag: [i, j],
                startDragging: true,
                targetVal: !ifFilled,
                tempGrid: this.copyGrid(this.state.fillGrid),
              });
            }}

            onMouseEnter={e => {
              if (this.state.startDrag) {
                this.setState({
                  endDrag: [i, j]
                });
              }
            }}
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

  flipValues() {
    // flip color
    const c1 = Math.min(this.state.startDrag[0], this.state.endDrag[0]);
    const c2 = Math.max(this.state.startDrag[0], this.state.endDrag[0]);

    const r1 = Math.min(this.state.startDrag[1], this.state.endDrag[1]);
    const r2 = Math.max(this.state.startDrag[1], this.state.endDrag[1]);

    const newGrid = this.copyGrid(this.state.fillGrid);
    for (let i = c1; i <= c2; i++) {
      for (let j = r1; j <= r2; j++) {
        newGrid[i][j] = this.state.targetVal;
      }
    }

    return newGrid;
  }

  handleMouseUp(evt) {
    if (this.state.startDrag) {
      const newGrid = this.flipValues();

      this.setState({
        tempGrid: undefined,
        startDragging: false,
        startDrag: undefined,
        endDrag: undefined,
        targetVal: undefined,
        fillGrid: newGrid,
      });
    }
  }

  renderColTitle() {
    const { colTitles, colNum } = this.props;

    const titles = [];

    for (let i = 0; i < colNum; i++) {
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

  exportToTable() {
    const grid = this.state.fillGrid;
    const { colNum, rowNum } = this.props;

    const table = [...Array(colNum)].map(e => Array(rowNum));

    for (let i = 0; i < colNum; i++) {
      for (let j = 0; j < rowNum; j++) {
        table[i][j] = grid[j][i];
      }
    }

    return table;
  }

  render() {
    // update data through setter
    if (this.props.tableSetter !== undefined) {
      this.props.tableSetter(this.exportToTable());
    }

    return (
      <div style={{
        display: 'flex',
        flexDirection: 'row',
      }}>
        <div style={{
          paddingTop: CELL_HEIGHT + 1,
        }}>
          {this.renderRowTitle()}
        </div>

        <div>
          {this.renderColTitle()}
          <div
            onMouseUp={this.handleMouseUp.bind(this)}
            onMouseMove={e => {
              if (this.state.startDrag) {
                const newGrid = this.flipValues();
                this.setState({
                  tempGrid: newGrid,
                });
              }
            }}

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
    width: CELL_WIDTH,
    marginRight: 1,
    fontSize: 10,
    textAlign: 'center',
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

export default CalendarTable;
