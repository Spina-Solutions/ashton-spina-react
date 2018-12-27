import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import { SocialIcon } from 'react-social-icons';

const styles = theme => ({
    root: {
        flexGrow: 1,
        margin: '3vw'
    },
    row: {
        display: 'flex',
        justifyContent: 'center',
    },
    bigAvatar: {
        borderStyle: 'solid',
        borderWidth: '3px',
        borderColor: '#2196f3',
        width: 200,
        height: 200,
    },
});

function FullWidthGrid(props) {
    const { classes } = props;
    return (
        <div>
            <div className={classes.row}>
                <Avatar alt="AS" src={require('./images/reactjs.png')} className={classes.bigAvatar}/>
            </div>
            <div className={classes.row}>
                <Typography variant="h5" component="h3">
                    ReactJS
                </Typography>
            </div>
            <div className={classes.row}>
                <SocialIcon url="https://twitter.com/reactjs"/>
                <SocialIcon url="https://github.com/facebook/react"/>
            </div>
            <Typography variant="h5" component="h3">
                Experience
            </Typography>
            <Typography component="p">
                I've only began learning ReactJS as a front-end web framework, but its quickly become my favourite.
                I enjoy the feeling of using Javascript to write a front-end and the integration that JSX
                offers.  This webpage was made using ReactJS and the MaterialUI library.  I hope to continue to work 
                in ReactJS going forward and expand my abilities.
            </Typography>
            <br/>
            <Divider/>
        </div>
    );
}

FullWidthGrid.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FullWidthGrid);