import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import { SocialIcon } from 'react-social-icons';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import ShareIcon from '@material-ui/icons/Share';

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
    media: {
        height: 0,
        paddingTop: '38.5%', // 16:9 = 56.25, should switch to this for real image or similar
    }
});

function FullWidthGrid(props) {
    const { classes } = props;
    return (
        <div>
            <CardMedia
              className={classes.media}
              image={require('../../comingSoon.png')}
              title="Laravel Vs. NodeJS"
            />
            
            <Typography variant="h5" component="h3">
                About the Author
            </Typography>
            <div className={classes.row}>
                <Avatar alt="AS" src={require('./ashtonspina.jpg')} className={classes.bigAvatar}/>
            </div>
            <div className={classes.row}>
                <Typography variant="h5" component="h3">
                    Ashton Spina
                </Typography>
            </div>
            <div className={classes.row}>
                <SocialIcon url="https://www.linkedin.com/in/spinaadbusiness/"/>
                <SocialIcon url="https://github.com/spina-a-d"/>
                <SocialIcon url="https://stackoverflow.com/users/10460453/ashton-spina"/>
                <SocialIcon url="https://plus.google.com/u/0/118135112796392901012"/>
                <SocialIcon url="https://www.facebook.com/ashton.spina"/>
                <SocialIcon url="https://www.instagram.com/ashtonspina/"/>
            </div>
        </div>
    );
}

FullWidthGrid.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FullWidthGrid);