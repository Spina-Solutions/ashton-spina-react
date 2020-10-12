import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import { SocialIcon } from 'react-social-icons';

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    margin: '3vw',
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
  socialIcon: {
    '&:hover': {
      borderRadius: '100px',
      backgroundClip: 'content-box',
      backgroundColor: '#B0BEC5',
    },
  },
});

function AboutMe(props) {
  const { classes } = props;
  return (
    <div>
      <div className={classes.row}>
        <Avatar
          alt="AS"
          src={require('./images/ashtonspina.jpg')}
          className={classes.bigAvatar}
        />
      </div>
      <div className={classes.row}>
        <SocialIcon
          className={classes.socialIcon}
          url="https://www.linkedin.com/in/spinaadbusiness/"
        />
        <SocialIcon
          className={classes.socialIcon}
          url="https://github.com/spina-a-d"
        />
        <SocialIcon
          className={classes.socialIcon}
          url="https://stackoverflow.com/users/10460453/ashton-spina"
        />
        <SocialIcon
          className={classes.socialIcon}
          url="https://plus.google.com/u/0/118135112796392901012"
        />
        <SocialIcon
          className={classes.socialIcon}
          url="https://www.facebook.com/ashton.spina"
        />
        <SocialIcon
          className={classes.socialIcon}
          url="https://www.instagram.com/ashtonspina/"
        />
      </div>
      <div className={classes.row}>
        <Typography variant="h3">Ashton Spina</Typography>
      </div>
      <Typography variant="h5" component="h3">
        Overview
      </Typography>
      <Typography component="p">
        I'm currently a Web Developer, working on or leading a variety of
        software development projects. Although my current work stack involves
        PHP (Laravel), Javascript (VueJS), DHTML, and SQL (MariaDB), I do have
        experience at verying levels in Java, C/C++, Android Development,
        ReactJS, NodeJS, MongoDB, and others as well. Though I love web
        technologies, I'm passionate about success more than any one technology
        and am always looking to expand into new fields (or something like that).
      </Typography>
      <br />
      <Divider />
      <br />
      <Typography variant="h5" component="h3">
        Personal
      </Typography>
      <Typography component="p">
        On a personal level, I'm a Canadian living in the Netherlands with EU
        citizenship. I love learning new things and for this reason I try to
        surround myself with people I can learn from. I am always at home in a
        new place with fresh experiences. I have a few years of non-computing
        science related work experience from before university and have
        developed a passion for work where I can make things and solve problems,
        as well as a strong work ethic as any of my previous employers will
        testify. A combination of these traits is what led me to not only the
        field I study, but also far from home.
      </Typography>
      <br />
      <Typography component="p">
        I spend most of my free time reading about subjects such as history,
        politics, economics, and languages. I also enjoy playing sports
        recreationally such as soccer (football) and volleyball.
      </Typography>
      <br />
      <Divider />
      <br />
      <Typography variant="h5" component="h3">
        The Future
      </Typography>
      <Typography component="p">
        I'm always looking to expand into new things. I continue to work
        full-time for Belsimpel while in the evenings and weekends I like
        working to expand my web development skill set. I'm hoping to continue
        writing opinion posts here on my webpage now that its available and add
        any cool tools I develop to be available to the public here. I believe
        that Artificial Intelligence is the future and I hope to begin some
        projects using AI technologies in the near future.
      </Typography>
    </div>
  );
}

AboutMe.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AboutMe);
