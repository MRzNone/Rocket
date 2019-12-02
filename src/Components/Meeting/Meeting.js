import React, { Component } from 'react';
import { connect } from 'react-redux';

import Popup from "reactjs-popup";
import ImportCal from "../ImportCal/ImportCal";

/**
 * Meeting page.
   */
class Meeting extends Component {
  render() {
    return (
      <div> Meeting
          <Popup modal trigger={<button>Import Calendar</button>}>
              {close => (<ImportCal close={close}/>)}</Popup>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {

  };
};

const mapDispatchToProps = {

};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Meeting);
