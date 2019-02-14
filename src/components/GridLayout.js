import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CardMedia from '@material-ui/core/CardMedia';
import { Link } from 'react-router-dom';
import StackGrid from "react-stack-grid";
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    contentOverlay: {
        position: 'absolute',
        top: '0',
        bottom: '0',
        left: '0',
        right: '0',
        background: 'rgba(0,0,0,0.7)',
        height: '100%',
        width: '100%',
        opacity: '0',
        '-webkit-transition': 'all 0.4s ease-in-out 0s',
        '-moz-transition': 'all 0.4s ease-in-out',
        transition: 'all 0.4s ease-in-out 0s',
        'transitionDelay': '0.1s',
        '&:hover': {
            opacity: '1',
            '& div': {
                top: '40%',
                left: '50%',
                opacity: '1'
            }
        }
    },
    content: {
        position: 'relative'
    },
    contentInner: {
        position: 'absolute',
        textAlign: 'center',
        paddingLeft: '1em',
        paddingRight: '1em',
        width: '100%',
        top: '50%',
        left: '50%',
        opacity: '0',
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
        }
    }
});


function GridLayout(props) {
    const { classes } = props;

    return (
        <StackGrid
            columnWidth={
                window.innerWidth > 768 ? '33%' : '100%'
            }
        >
            {
                props.items.map((item, key) =>
                    <div key={key} className={classes.card}>   
                        <Link to={item.url} style={{ textDecoration: 'none', color: 'black' }}>
                            <div className={classes.content}>
                                <CardMedia
                                    style={{height: 0, paddingTop: '56.25%'}}
                                    image={item.imageUrl}
                                    title={item.title}
                                />
                                <div className={classes.contentOverlay}>
                                    <div className={classes.contentInner}>
                                        <Typography component="h1">{item.title}</Typography>
                                        <Typography component="p">{item.subtitle}</Typography>
                                    </div>
                                </div> 
                            </div>
                         </Link>
                    </div>
                )
            }
        </StackGrid>
    );
}

GridLayout.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GridLayout);