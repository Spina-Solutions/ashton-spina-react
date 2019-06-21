import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CardMedia from '@material-ui/core/CardMedia';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { LazyLoadComponent } from 'react-lazy-load-image-component';

const styles = theme => ({
    root: {
        padding: '24px',
        width: '98vw',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    content: {
        position: 'relative',
    },
    contentOverlay: {
        position: 'absolute',
        top: '0',
        bottom: '0',
        left: '0',
        right: '0',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.7))',
        height: '100%',
        width: '100%',
        opacity: '0.7',
        cursor: 'pointer',
        '-webkit-transition': 'all 0.4s ease-in-out 0s',
        '-moz-transition': 'all 0.4s ease-in-out',
        transition: 'all 0.4s ease-in-out 0s',
        'transitionDelay': '0.1s',
        '&:hover': {
            opacity: '1',
        },
    },
    contentInner: {
        position: 'absolute',
        textAlign: 'center',
        paddingLeft: '1em',
        paddingRight: '1em',
        width: '100%',
        top: '90%',
        left: '50%',
        opacity: '1',
        '-webkit-transform': 'translate(-50%, -50%)',
        '-moz-transform': 'translate(-50%, -50%)',
        transform: 'translate(-50%, -50%)',
        '-webkit-transition': 'all 0.3s ease-in-out 0s',
        '-moz-transition': 'all 0.3s ease-in-out 0s',
        transition: 'all 0.3s ease-in-out 0s',
        '& h1': {
            color: '#fff',
            fontWeight: '500',
            letterSpacing: '0.3em',
            marginBottom: '0.5em',
            textTransform: 'uppercase'
        },
        '& p': {
            color: '#fff',
            fontSize: '0.8em',
        },
    },
    vertIcon: {
        position: 'absolute',
        top: '0%',
        right: '0%',
        float: 'right'
    },
    row: {
        display: 'flex',
        justifyContent: 'center',
    },
});

/**
 * This class acts as a grid to contain all the cities and display them to users
 */
class GridLayout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
        };
    }

    /**
     * Handles closing the menu so that the anchor element can be reset
     *
     * @returns {void}
     * @public
     */
    handleClose = () => {
        this.setState({ anchorEl: null });
    };

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
                    {Object.keys(this.props.items).map((key) => {
                        return (
                            <Grid key={key} className={classes.card} item xs={12} sm={6} md={4} lg={3}>
                                <LazyLoadComponent>
                                    <Paper className={classes.content}>
                                        <Link
                                            to={items[key].url}
                                            style={{ textDecoration: 'none', color: 'black' }}
                                        >
                                            <CardMedia
                                                style={{height: 0, paddingTop: '56.25%'}}
                                                image={items[key].imageUrl}
                                                title={items[key].name}
                                            />
                                        </Link>
                                        <Link
                                            to={items[key].url}
                                            style={{ textDecoration: 'none', color: 'black' }}
                                        >
                                            <div className={classes.contentOverlay}>
                                                <div className={classes.contentInner}>
                                                    <Typography component="h1">{items[key].title}</Typography>
                                                </div>
                                            </div>
                                        </Link>
                                    </Paper>
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