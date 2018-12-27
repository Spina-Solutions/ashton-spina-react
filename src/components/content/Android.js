import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import { SocialIcon } from 'react-social-icons';
import { Link } from 'react-router-dom';

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
                <Avatar alt="AS" src={require('../../images/android.jpg')} className={classes.bigAvatar}/>
            </div>
            <div className={classes.row}>
                <Typography variant="h5" component="h3">
                    Android
                </Typography>
            </div>
            <div className={classes.row}>
                <SocialIcon url="https://source.android.com/"/>
            </div>
            <Typography variant="h5" component="h3">
                Experience
            </Typography>
            <Typography component="p">
                My experience in Android development comes from my early computer science career.  When I first learned to program I decided that I wanted to try to make some personal projects.  I thought that making an App for Android phones would be really cool.  I learned Android development by making some small Apps, but never was interested in and didn't have the time to release anything large on my own.  I eventually used my experience to eventually work on and release <Link to="/content/wander">Wander</Link>.
            </Typography>
        </div>
    );
}

FullWidthGrid.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FullWidthGrid);