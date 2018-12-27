import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';

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
                <Avatar alt="AS" src={require('../../images/wander.png')} className={classes.bigAvatar}/>
            </div>
            <div className={classes.row}>
                <Typography variant="h5" component="h3">
                    Wander
                </Typography>
            </div>
            <Typography variant="h5" component="h3">
                Background
            </Typography>
            <Typography component="p">
                Wander was my first large software engineering project.  I worked with a team of students to develop an application for the Psychology Department at the University of Groningen.  This client was focused on bringing one of their experiments to their test subjects.  This way rather than brining subjects to test environments, they could have them do the experiment on their smartphones in a more natural environment, something that was desirable for the experiment.  Since the development this app has been used by other groups for similar experiments.
            </Typography>
            <br/>
            <Divider/>
            <br/>
            <Typography variant="h5" component="h3">
                Major Contributions
            </Typography>
            <Typography variant="h6" component="h6">
                Android App
            </Typography>
            <Typography component="p">
                For this project I was the main developer for the Android App itself. I had previously experimented in personal projects on native Android App development and thus became the natural choice for this role.  I worked alongside another student who focused on front-end design which I helped implement in addition to the back-end of the application which communicated with the server.  The server in our case was a Google Sheet.  Although we initially considered a full server for this purpose, we realized we could send formatted data to the Google Sheet which was much more accessible for the client, who could download it and manipulate the data easily from its raw form.
            </Typography>
        </div>
    );
}

FullWidthGrid.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FullWidthGrid);