import React, { Component } from 'react';
import { connect } from 'react-redux';
//import './LandPage.css';
import './icon.png';

/**
 * Landing page.
 */
class LandPage extends Component {
  render() {
    return (
        <div className="page-wrapper">
          <section className="title">

            <header role="banner">
              <h1>ONE OFF</h1>
              <h2>Schedule a Meeting NOW</h2>
              <div className="circle" id="c1" />
              <div className="circle" id="c2" />
              <div className="circle" id="c3" />
            </header>

            <aside className="logo">
                <img alt="logo" src={require("./icon.png")} />
            </aside>

            <aside className="function">
              <h3>Start Here</h3>
              <ul>
                <li>Create a Meeting</li>
                <li>Join a Meeting</li>
              </ul>
            </aside>

            <div className="info">
              <h3>About us</h3>
              <p>OneOff is a meeting driven web application that aims in resolving scheduling conflicts and deciding the most optimal time for a meeting.</p>
              <p>And the most of all, it's effective, user-friendly, and free to use.</p>
            </div>

          </section>

          <div className="footer">
            @2019 Rocket
          </div>

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
)(LandPage);
