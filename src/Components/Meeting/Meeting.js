import React, { Component } from 'react';
import { connect } from 'react-redux';

/**
 * Meeting page.
 */
class Meeting extends Component {
  render() {
    return (
      <div> Meeting </div>
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
