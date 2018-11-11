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
            
            </div>
            <div className={classes.row}>
                <Typography variant="h5" component="h3">
                    Ashton Spina
                </Typography>
            </div>
            <Typography variant="h5" component="h3">
                Education
            </Typography>
            <Typography component="p">
                Although originally from Ontario, Canada, Ashton Spina studied a BSc in Computer Science at the University of Groningen
                in the Netherlands.  He completed the 3 year programme within the allotted time period with no complications.  Although 
                his only previous experience in computing science came in the form of a short, secondary school Java course, Ashton quickly
                took to the challenge and mathematical nature of the subject and became a fan.  In addition to his normal coursework
                he took a liking to web development and began his first personal projects in this field.  Within his 3 year programme for 180
                ECTS Ashton also managed to take a semester for participating in the ERASMUS+ programme at the University of Malta.  Here he continued
                studying computer science subjects, albeit at a sunnier locale.
            </Typography>
            <br/>
            <Divider/>
            <br/>
            <Typography variant="h5" component="h3">
                Employment
            </Typography>
            <Typography component="p">
                After completing the first year of studies at the University of Groningen Ashton immediately turned to his natural
                calling, employment.  He took up a job as a Teaching Assistant for the University, helping to pay his way through school,
                as well as providing valuable experience in a teaching position and allowing good opportunity to revisit previous subjects 
                in more depth.  Ashton's interest in web development and position as a Teaching Assistant put him in a position to find a 
                job at Belsimpel.  This job began as a part-time endeavour during his final semester after returning from Malta and transitioned
                into a full-time position after graduation.  Here he learned he quickly learned the ropes of the software development process, first as 
                a junior backend developer, but quickly transitioning into a lead full-stack developer.
            </Typography>
            <br/>
            <Divider/>
            <br/>
            <Typography variant="h5" component="h3">
                The Future
            </Typography>
            <Typography component="p">
                Ashton is always looking to expand his horizons.  He continues to work full-time for Belsimpel while in the evenings
                and weekends working to expand his web development skill set.  Ashton believes that Artificial Intelligence will be the 
                future and hopes to begin to learn and create projects using AI technologies in order to remaining at the cutting edge of 
                his field.
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
                <SocialIcon url="https://github.com/a-d-spina-student"/>
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