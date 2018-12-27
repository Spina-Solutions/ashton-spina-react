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
                <Avatar alt="AS" src={require('../../images/deviceDB.png')} className={classes.bigAvatar}/>
            </div>
            <div className={classes.row}>
                <Typography variant="h5" component="h3">
                    Device Database
                </Typography>
            </div>
            <Typography variant="h5" component="h3">
                Background
            </Typography>
            <Typography component="p">
                Working on the DeviceDatabase began and necessarily completed my transition to becoming a Full-stack Developer.  Although even by the name it's clear this project required a significant amount of back-end work (Laravel), being a database, considerably more effort was put into the front-end of this system which was built in VueJS.  This is because after the database design was finalized, the majority of development work was focused on providing reactive and intuititive tools for managing the database.
            </Typography>
            <br/>
            <Divider/>
            <br/>
            <Typography variant="h5" component="h3">
                Contributions
            </Typography>
            <Typography component="p">
                I was responsible for creating this project right from the beginning. This involved taking a fresh Laravel project and designing and implementing a database for storing a massive compilation of saleable mobile devices and their properties.  This transitioned into creating VueJS UI components for managing users, roles, permissions, and the devices themselves.  I also created a robust API for accessing this database and a proper token-based authentication system to protect it.
            </Typography>
        </div>
    );
}

FullWidthGrid.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FullWidthGrid);