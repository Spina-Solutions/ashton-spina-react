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

function FullWidthGrid(props) {
    const { classes } = props;
    return (
        <div>
            <div className={classes.row}>
                <Avatar alt="AS" src={require('./images/ashtonspina.jpg')} className={classes.bigAvatar}/>
            </div>
            <div className={classes.row}>
                <Typography variant="h5" component="h3">
                    Ashton Spina
                </Typography>
            </div>
            <div className={classes.row}>
                <SocialIcon url="http://www.ashtonspina.com"/>
                <SocialIcon url="https://github.com/spina-a-d/ashton-spina-react"/>
            </div>
            <Typography variant="h5" component="h3">
                The Story
            </Typography>
            <Typography component="p">
                The ashtonspina.com website has been a long-term project of mine.  I use it to learn new technologies in web development, particularly front-end, and I hope it will be key in bringing me up-to-date with the cutting edge web technologies.  ashtonspina.com started as a basic, static html page served by a NodeJS server.  This was my first real webpage.  I used Bootstrap for my styling in this iteration.  Although this was sufficient, I wasn't happy with it and it had a lot of room for improvement, particularly in terms of learning and demonstrating my abilities.  I then began a static, single-page-application in VueJS.  I had already had work experience in VueJS so it was a natural choice.  This was short-lived though, because I realized that making a new webpage was an opportunity to learn new technologies that I might not otherwise have available so I scrapped that project and switched the the ReactJS single-page-application that you're viewiing now. I'm still very inexperienced with ReactJS, but I'm very much enjoying its capabilities.  I hope to continue learning ReactJS so that I might be able to work with it in future web development.
            </Typography>
            <Typography variant="h5" component="h3">
                Future Development
            </Typography>
            <Typography component="p">
                The primary future expansion for this page will definitely be adding an API back-end to this page.  This way I can avoid staticly serving the entire webpage upfront and allow some file downloads.  The other major expansion will be adding a blog feature with some articles that I've wanted to write about for some time.  This will begin after I'm happy with the base-site. 
            </Typography>
        </div>
    );
}

FullWidthGrid.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FullWidthGrid);