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
                <Avatar alt="AS" src={require('./images/nodejs.png')} className={classes.bigAvatar}/>
            </div>
            <div className={classes.row}>
                <Typography variant="h5" component="h3">
                </Typography>
            </div>
            <div className={classes.row}>
                <SocialIcon url="https://twitter.com/nodejs?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor"/>
                <SocialIcon url="https://github.com/nodejs/node"/>
            </div>
            <Typography variant="h5" component="h3">
                Experience
            </Typography>
            <Typography component="p">
                NodeJS is my framework of choice for personal projects.  I enjoy its quick setup time and lightweight web frameworks.
                I've used NodeJS for everything from small university projects to a large project for my thesis.  This 
                webpage you're reading this on is served by a NodeJS back-end.  I very much enjoy working in Javascript
                because post-ECMAScript2015 it has become a very powerful scripting language.  I also enjoy the large variety
                of modules available through the Node Package Manager (npm).  I hope to continue my learning in NodeJS and
                Javascript in the future.  I hope to eventually learn TypeScript as well.
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