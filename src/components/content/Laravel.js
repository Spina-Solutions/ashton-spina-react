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
                <Avatar alt="AS" src={require('./images/laravel.jpg')} className={classes.bigAvatar}/>
            </div>
            <div className={classes.row}>
                <Typography variant="h5" component="h3">
                    Laravel
                </Typography>
            </div>
            <div className={classes.row}>
                <SocialIcon url="https://twitter.com/laravelphp"/>
                <SocialIcon url="https://github.com/laravel/laravel"/>
            </div>
            <Typography variant="h5" component="h3">
                Experience
            </Typography>
            <Typography component="p">
                My experience in Laravel corresponds directly to my work experience. 
                We made all new projects based in the Laravel Framework with a Software as a Service (SaaS) model.
                We always ensure we're using the latest releases in order to maintain the highest level
                of technological quality for our projects.  In this way, I have also managed to keep my
                web development skills inline with the newest web development technologies.  For personal projects
                I would consider Laravel if I needed a complex system because of all the included libraries
                and functionalities.
            </Typography>
            <br/>
            <Divider/>
            <br/>
            <Typography variant="h6" component="h3">
                Databases
            </Typography>
            <Typography component="p">
                Although I have experience with pure SQL on MariaDB databases using Active Record, when using
                Laravel for PHP-based system, I mostly relied on the Eloquent ORM for managing the database
                and the Eloquent Query Builder for Queries.  In this way I have had experience with both
                SQL database management as well as using more modern, abstracted, ORM system.s
            </Typography>
            <br/>
            <Divider/>
            <br/>
            <Typography variant="h6" component="h3">
                Testing
            </Typography>
            <Typography component="p">
                My experience in testing Laravel-based system back-ends is with PHPUnit.  Here I focused on
                Feature tests primarily for the functionality of system Models and Controllers. 
            </Typography>
        </div>
    );
}

FullWidthGrid.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FullWidthGrid);