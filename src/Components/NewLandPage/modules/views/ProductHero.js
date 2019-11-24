import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '../components/Button';
import Typography from '../components/Typography';
import ProductHeroLayout from './ProductHeroLayout';
import blue from '@material-ui/core/colors/blue';
import red from '@material-ui/core/colors/red';

const backgroundImage =
  'https://images.unsplash.com/photo-1534854638093-bada1813ca19?auto=format&fit=crop&w=1400&q=80';

const primary = blue[300];
const secondary = red[500];

const styles = theme => ({
  background: {
    // backgroundImage: `url(${backgroundImage})`,
    // backgroundColor: '#7fc7d9', // Average color of the background image.
    backgroundColor: primary, // Average color of the background image.
    backgroundPosition: 'center',
  },
  button: {
    width: 250,
  },

  h5: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(4),
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing(2),
    },
  },
  more: {
    marginTop: theme.spacing(2),
  },
});

function ProductHero(props) {
  const { classes } = props;

  return (
    <ProductHeroLayout backgroundClassName={classes.background}>
      {/* Increase the network loading priority of the background image. */}
      {/* <img style={{ display: 'none' }} src={backgroundImage} alt="increase priority" /> */}
      <Typography color="inherit" align="center" variant="h1" marked="center" style={{ fontSize: '100px'}}>
        One Off
      </Typography>
      <Typography color="inherit" align="center" variant="h6" className={classes.h5} style= {{marginBottom: '7%'}}>
        Create a meeting today
      </Typography>
      <div>
        <Button
          color="secondary"
          variant="contained"
          size="large"
          className={classes.button}
          component="a"
          href="../../../MeetingResponse/"
        >
          Create Meeting
        </Button>
        <Button
          color="secondary"
          variant="contained"
          size="large"
          className={classes.button}
          component="a"
          href="../../../JoinMeeting/"
        >
          Join Meeting
        </Button>
      </div>
    </ProductHeroLayout>
  );
}

ProductHero.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProductHero);