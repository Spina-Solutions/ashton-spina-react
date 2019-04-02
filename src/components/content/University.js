import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
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

function University(props) {
    const { classes } = props;
    return (
        <div>
            <div className={classes.row}>
                <Avatar alt="AS" src={require('../../images/school_work.png')} className={classes.bigAvatar}/>
            </div>
            <div className={classes.row}>
                <Typography variant="h5" component="h3">
                    University Snippets
                </Typography>
            </div>
             <div className={classes.row}>
                <SocialIcon url="https://github.com/spina-a-d/Ashton-s-School-Assignment-Collection"/>
            </div>
            <Typography variant="h5" component="h3">
                Notice
            </Typography>
            <Typography component="p">
                In order to protect the academic integrity of new Computing Science students at the University of Groninge. I've decided to make this repository private.  If you're not a student at the University of Groningen and would like access to this repository please contact me.
            </Typography>
            <Typography variant="h5" component="h3">
                Overview
            </Typography>
            <Typography component="p">
                This is a collection of snippets of work from my time in University.  It is not designed to show-off my current abilities, but rather the depth of content I've been exposed to and the progression I made during my time in education.  If you're interested you can click though the well-labelled Github repo.
            </Typography>
        </div>
    );
}

University.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(University);