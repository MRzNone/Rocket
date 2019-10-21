import React, { Component } from 'react';
import { connect } from 'react-redux';

/**
 * Landing page.
 */
class LandPage extends Component {
  render() {
    return (
      <div> LandPage </div>
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
)(LandPage);
