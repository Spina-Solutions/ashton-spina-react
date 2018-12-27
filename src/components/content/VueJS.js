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
                <Avatar alt="AS" src={require('../icons/VueJS.png')} className={classes.bigAvatar}/>
            </div>
            <div className={classes.row}>
                <Typography variant="h5" component="h3">
                    VueJS
                </Typography>
            </div>
            <div className={classes.row}>
                <SocialIcon url="https://twitter.com/vuejs?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor"/>
                <SocialIcon url="https://github.com/vuejs"/>
            </div>
            <Typography variant="h5" component="h3">
                Experience
            </Typography>
            <Typography component="p">
                VueJS is the primary front-end javascript framework I use at work. 
                It integrates well with the Laravel back-end that we use for all our new projects.  VueJS lets me use
                my existing knowledge of HTML, CSS, and Javascript in nicely scoped, self-contained, re-usable components.  
                I work in VueJS to make single-page-application compatible components user-interfaces meant to allow
                employees to manage systems.

                I also was part of a team that proposed and created a VueJS Component Library for use 
                within the company I worked for to increase development speed for new projects and to 
                modernize older projects.
            </Typography>
            <br/>
            <Divider/>
            <br/>
            <Typography variant="h6" component="h3">
                Vuetify
            </Typography>
            <Typography component="p">
                The main component library I work with in VueJS is Vuetify.  Vuetify is a popular library that uses 
                Material Design methods to create simple common components for web design.  You can check it out here:
                <div className={classes.row}>
                    <SocialIcon url="https://vuetifyjs.com/en/"/>
                </div>
            </Typography>
            <br/>
            <Divider/>
            <br/>
            <Typography variant="h6" component="h3">
                Testing
            </Typography>
            <Typography component="p">
                I test my VueJS with Jest.  Jest tests allow us to test our components in an isolated manner.
                This way we can ensure components function as intended without relying on the data
                that we might provide them.  This is particularly important for example in our
                VueJS component library that we use across many projects in the company I work for.
            </Typography>
        </div>
    );
}

FullWidthGrid.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FullWidthGrid);