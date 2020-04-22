import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { LazyLoadComponent } from 'react-lazy-load-image-component';
import Tooltip from '@material-ui/core/Tooltip';

const styles = (theme) => ({
  root: {
    padding: '24px',
    width: '98vw',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  imageSide: {
    transition: 'all 0.4s ease-in-out 0s',
    '&:hover': {
      // necessary to override inline background colour
      background: '#455a64 !important',
    },
  },
  image: {
    padding: '12px',
  },
  text: {
    padding: '12px',
    color: '#FFFFFF',
  },
  hookSide: {
    padding: '24px',
  },
});

/**
 * This class acts as a grid to contain all the cities and display them to users
 */
class BlogLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
    };
  }

  /**
   * For now I call the same function in both lifecycle hooks because the state won't always be set otherwise because of the order of the components mounting
   */
  componentDidMount() {
    window.addEventListener('resize', this.updateWindowDimensions.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener(
      'resize',
      this.updateWindowDimensions.bind(this)
    );
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth });
  }

  render() {
    const { classes, items } = this.props;

    return (
      <div className={classes.root}>
        <Grid container spacing={2} justify="center" alignItems="center">
          {Object.keys(this.props.items).map((key, index) => {
            return (
              <Grid key={key} item xs={12}>
                <LazyLoadComponent>
                  {index % 2 === 0 && (
                    <Paper>
                      <Grid container justify="center" alignItems="stretch">
                        <Grid
                          item
                          xs={6}
                          className={classes.imageSide}
                          style={{
                            background: items[key].paperBackground,
                            '&:hover': {
                              background: '#455a64',
                            },
                          }}
                        >
                          <Link
                            to={items[key].url}
                            style={{
                              textDecoration: 'none',
                              color: 'black',
                            }}
                          >
                            <Grid
                              className={classes.image}
                              container
                              justify="center"
                              alignItems="center"
                            >
                              <Grid
                                item
                                xs={12}
                                md={6}
                                className={classes.image}
                                align="center"
                              >
                                <Tooltip
                                  title="Click here to find out more"
                                  aria-label="Click here to find out more"
                                >
                                  <img
                                    src={items[key].iconUrl}
                                    alt={items[key].name}
                                    style={{
                                      height:
                                        this.state.width < 600
                                          ? '100px'
                                          : '180px',
                                      width:
                                        this.state.width < 600
                                          ? '100px'
                                          : '180px',
                                    }}
                                  />
                                </Tooltip>
                              </Grid>
                              <Grid item xs={12} md={6} align="center">
                                <Typography
                                  variant={this.state.width < 600 ? 'h6' : 'h3'}
                                  className={classes.text}
                                >
                                  {items[key].title}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Link>
                        </Grid>
                        <Grid
                          item
                          xs={6}
                          className={classes.hookSide}
                          container
                          justify="center"
                          alignItems="center"
                        >
                          <Grid container justify="center" alignItems="center">
                            {items[key].category !== undefined && (
                              <Grid item xs={12}>
                                <Typography variant="subtitle1">
                                  {items[key].category}
                                </Typography>
                              </Grid>
                            )}
                            <Grid item xs={12}>
                              <Typography
                                variant={
                                  this.state.width < 600 ? 'body2' : 'h6'
                                }
                              >
                                {items[key].hook}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Paper>
                  )}
                  {index % 2 === 1 && (
                    <Paper>
                      <Grid container justify="center" alignItems="stretch">
                        <Grid
                          item
                          xs={6}
                          className={classes.hookSide}
                          container
                          justify="center"
                          alignItems="center"
                        >
                          <Grid container justify="center" alignItems="center">
                            {items[key].category !== undefined && (
                              <Grid item xs={12}>
                                <Typography variant="subtitle1">
                                  {items[key].category}
                                </Typography>
                              </Grid>
                            )}
                            <Grid item xs={12}>
                              <Typography
                                variant={
                                  this.state.width < 600 ? 'body2' : 'h6'
                                }
                              >
                                {items[key].hook}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid
                          item
                          xs={6}
                          className={classes.imageSide}
                          style={{
                            background: items[key].paperBackground,
                            '&:hover': {
                              background: '#455a64',
                            },
                          }}
                        >
                          <Link
                            to={items[key].url}
                            style={{
                              textDecoration: 'none',
                              color: 'black',
                            }}
                          >
                            <Grid
                              className={classes.image}
                              container
                              justify="center"
                              alignItems="center"
                            >
                              <Grid item xs={12} md={6} align="center">
                                <Typography
                                  variant={this.state.width < 600 ? 'h6' : 'h3'}
                                  className={classes.text}
                                >
                                  {items[key].title}
                                </Typography>
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                md={6}
                                className={classes.image}
                                align="center"
                              >
                                <Tooltip
                                  title="Click here to find out more"
                                  aria-label="Click here to find out more"
                                >
                                  <img
                                    src={items[key].iconUrl}
                                    alt={items[key].name}
                                    style={{
                                      height:
                                        this.state.width < 600
                                          ? '100px'
                                          : '180px',
                                      width:
                                        this.state.width < 600
                                          ? '100px'
                                          : '180px',
                                    }}
                                  />
                                </Tooltip>
                              </Grid>
                            </Grid>
                          </Link>
                        </Grid>
                      </Grid>
                    </Paper>
                  )}
                </LazyLoadComponent>
              </Grid>
            );
          })}
        </Grid>
      </div>
    );
  }
}

BlogLayout.propTypes = {
  classes: PropTypes.object.isRequired,
  items: PropTypes.array.isRequired,
};

export default withStyles(styles, { withTheme: true })(BlogLayout);
