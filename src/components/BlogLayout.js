import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { LazyLoadComponent } from 'react-lazy-load-image-component';
import Tooltip from '@material-ui/core/Tooltip';

const styles = theme => ({
    root: {
        padding: '24px',
        width: '98vw',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    imageSide: {
        transition: 'all 0.4s ease-in-out 0s',
        '&:hover':  {
            // necessary to override inline background colour
            background: '#455a64 !important'
        },
    },
    image: {
        padding: '12px'
    },
    text: {
        padding: '12px',
        color: '#FFFFFF'
    },
    hookSide: {
        padding: '24px',
    }
});

/**
 * This class acts as a grid to contain all the cities and display them to users
 */
class GridLayout extends React.Component {
    render() {
        const { classes, items} = this.props;

        return (
            <div
                className={classes.root}
            >
                <Grid 
                    container
                    spacing={2}
                    justify="center" 
                    alignItems="center"
                >
                    {Object.keys(this.props.items).map((key, index) => {
                        return (
                            <Grid key={key} item xs={12}>
                                <LazyLoadComponent>
                                    {index % 2 === 0 &&
                                        <Paper>
                                            <Grid
                                                container
                                                justify="center"
                                                alignItems="center"
                                            >
                                                <Grid
                                                    item
                                                    xs={6}
                                                    className={classes.imageSide}
                                                    style={{
                                                        background: items[key].paperBackground,
                                                        '&:hover':  {
                                                            background: '#455a64'
                                                        },
                                                    }}
                                                >
                                                    <Link
                                                        to={items[key].url}
                                                        style={{ textDecoration: 'none', color: 'black' }}
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
                                                                        style={{height: '180px', width: '180px'}}
                                                                    />
                                                                </Tooltip>
                                                            </Grid>
                                                            <Grid
                                                                item
                                                                xs={12}
                                                                md={6}
                                                                align="center"
                                                            >
                                                                <Typography variant="h3" className={classes.text}>{items[key].title}</Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </Link>
                                                </Grid>
                                                <Grid
                                                    item
                                                    xs={6}
                                                    className={classes.hookSide}
                                                    alignContent="space-between"
                                                >
                                                    {items[key].category !== undefined &&
                                                        <div>
                                                            <Typography variant="subtitle1">{items[key].category}</Typography>
                                                        </div>
                                                    }
                                                    <div>
                                                        <Typography variant="h6">{items[key].hook}</Typography>
                                                    </div>
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    }
                                    {index % 2 === 1 &&
                                        <Paper>
                                            <Grid
                                                container
                                                justify="center"
                                                alignItems="center"
                                            >
                                                <Grid
                                                    item
                                                    xs={6}
                                                    className={classes.hookSide}
                                                >
                                                    <div>
                                                        <Typography variant="h6">{items[key].hook}</Typography>
                                                    </div>
                                                </Grid>
                                                <Grid
                                                    item
                                                    xs={6}
                                                    className={classes.imageSide}
                                                    style={{
                                                        background: items[key].paperBackground,
                                                        '&:hover':  {
                                                            background: '#455a64'
                                                        },
                                                    }}
                                                >
                                                    <Link
                                                        to={items[key].url}
                                                        style={{ textDecoration: 'none', color: 'black' }}
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
                                                                align="center"
                                                            >
                                                                <Typography variant="h3" className={classes.text}>{items[key].title}</Typography>
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
                                                                        style={{height: '180px', width: '180px'}}
                                                                    />
                                                                </Tooltip>
                                                            </Grid>
                                                        </Grid>
                                                    </Link>
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    }
                                </LazyLoadComponent>
                            </Grid>
                        );
                    })}
              </Grid>
          </div>
        );
    }
}

GridLayout.propTypes = {
    classes: PropTypes.object.isRequired,
    items: PropTypes.array.isRequired,
};

export default withStyles(styles, { withTheme: true })(GridLayout);