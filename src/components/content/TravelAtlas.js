import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import {SocialIcon} from "react-social-icons";

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

function TravelAtlas(props) {
    const { classes } = props;
    return (
        <div>
            <div className={classes.row}>
                <Avatar alt="AS" src={require('../../images/thumbs/travel-atlas_tn.jpg')} className={classes.bigAvatar}/>
            </div>
            <div className={classes.row}>
                <Typography variant="h5" component="h3">
                    Travel-Atlas
                </Typography>
            </div>
            <div className={classes.row}>
                <SocialIcon url="https://www.travel-atlas.com"/>
            </div>
            <Typography variant="h5" component="h3">
                Background
            </Typography>
            <Typography component="p">
                Travel atlas is my attempt to break into the travel scene.  Travelling, particularly backpacking is one of my passions in life and making something that could allow me to contribute to that hobby and the community around it as well as potentially eventually develop a source of revenue in that domain would be ideal.
            </Typography>
            <br/>
            <Divider/>
            <br/>
            <Typography variant="h5" component="h3">
                The Project
            </Typography>
            <Typography component="p">
                Although this project also involves a lot of management, copy-writing, and data-entry, one of the main focuses on making it was the ability to learn ReactJS and Progressive Web Apps.
                During the course of the initial development cycle for this project I learned a framework which was relatively new to me, ReactJS, which quickly became my preferred front-end javascript framework.
                I also learned to configure and deploy Progressive Web Apps, a technology I am personally very enthusiastic for.  Finally, I became comfortable with deploying servers behind an nginx reverse-proxy server with proper SSL configuration.
            </Typography>
        </div>
    );
}

TravelAtlas.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TravelAtlas);