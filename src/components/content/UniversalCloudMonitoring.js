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
});

function FullWidthGrid(props) {
  const { classes } = props;

  return (
    <div>
      <div className={classes.row}></div>
      <div className={classes.row}>
        <Avatar
          alt="AS"
          src={require('../../images/thumbs/universalCloudMonitoring_tn.jpg')}
          className={classes.bigAvatar}
        />
      </div>
      <div className={classes.row}>
        <Typography variant="h5" component="h3">
          Monitoring and Visualizing Computational Waste in Cloud Computing
          Systems
        </Typography>
      </div>
      <div className={classes.row}>
        <SocialIcon url="https://github.com/spina-a-d/waste-cloud-computing" />
        <SocialIcon url="http://www.universalcloudmonitoring.com/" />
      </div>
      <Typography variant="h6" component="h3">
        Overview
      </Typography>
      <Typography component="p">
        This was my thesis project for my Bachelor's in Computing Science. Here
        in cooperation with the professors Vasilios Andrikopoulos and Mircea
        Lungu at the University of Groningen I worked on researching and
        developing methods for monitoring cloud-deployed systems, particularly
        Virtual Machines.
      </Typography>
      <br />
      <Divider />
      <br />
      <Typography variant="h6" component="h3">
        Research
      </Typography>
      <Typography component="p">
        The research for this thesis made up the majority of the work
        accomplished and focused on investigating other research that had been
        done on monitoring cloud-deployed virtual machines and how that
        knowledge could be integrated in an monitoring implementation. Most
        existing research focused on monitoring very specific kinds of or parts
        of systems or under very specific circumstances. This in mind, we
        integrated these experiences into our own implementation and focused on
        making a very generalized system of monitoring. The key to this
        monitoring is that it would accomplish something that other generalized
        monitoring solutions failed to do, give the user information on how much
        their deployments were costing and how much of those instances was
        wasted.
      </Typography>
      <Typography variant="h6" component="h3">
        Implementation
      </Typography>
      <Typography component="p">
        After desigining the monitoring system based on similar systems, we
        decided to implement a monitoring system to prove that our solution was
        valid. Our eventual system was generalized enough that it could
        essentially run on any Linux system because the probing system was
        written entirely in bash and run via a crontab. This reported via curl
        post requests to a server, whose location was stored in the probe. This
        server could theoretically be any server the probe was configured to
        send to, including a clone of the example server. Probes could tolerate
        thigns like server or connection failure and was generally very durable
        as part of the specifications.
      </Typography>
      <Typography variant="h6" component="h3">
        Evaluation and Conclusions
      </Typography>
      <Typography component="p">
        Ultimately we concluded that although the implementation definitely
        could benefit from optimizations, especially if it were to be deployed
        commercially, it fulfilled the specifications that we set out to
        implement and successfully monitored the system as well as the system's
        cost and waste. The monitoring solution itself was very lightweight and
        on average consumed less than 1% of a typical system's resources, thus
        making the inherent waste of the monitoring solution adequately low.
        This paper may be published as part of a larger paper on monitoring and
        cost and waste optimizations and will be made available when that
        situation arises.
      </Typography>
    </div>
  );
}

FullWidthGrid.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FullWidthGrid);
