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
    },
    pictureLink: {
        backgroundColor: 'grey',
        textDecoration: 'none',
        color: 'white',
        padding: '4px 6px',
        fontSize: '12px',
        fontWeight: 'bold',
        lineHeight: '1.2',
        display: 'inline-block',
        borderRadius: '3px',
    }
});

function FullWidthGrid(props) {
    const { classes } = props;
    return (
        <div>
            <CardMedia
              className={classes.media}
              image={require('../../gta_space_usage.jpg')}
              title="The Ontario Housing Crisis"
            />
            <a
                href="https://unsplash.com/@marcojodoin?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge" 
                target="_blank" 
                rel="noopener noreferrer" 
                title="Download free do whatever you want high-resolution photos from Marc-Olivier Jodoin"
            >
                <Typography className={classes.pictureLink} component="p">Photo: Marc-Olivier Jodoin</Typography>
            </a>
            <Typography variant="h1">
                Ontario's City Problem
            </Typography>
            <Typography variant="h4">
                The Issue
            </Typography>
            <Typography component="p">
               Ontario is facing a housing crisis.  An infrastructure crisis.  A traffic crisis.  An urban sprawl crisis.  The Greater Toronto Area (GTA) definitely best exemplifies these issues.  Although, one should not discount the amazing growth of this urban conglomerate, almost doubling in size in the last 30 years, the issues it faces now will limit its growth if not properly checked.
            </Typography>
            <br/>
            <Typography component="p">
                With the major growth of cities in Ontario and Canada there has been a matching drive to increase the housing supply to match.  In the case of places like the GTA this has been accomplished largely through the use of cheap, large, wooden-frame, individual or multi-occupant houses of similar shape and appearance on relatively small plots.  Although the kilometres of identical housing could definitely lead one to insist the Canadian solution to housing is an individualistic, North American take on Soviet housing schemes, a solution that solves the problem is a valid solution nonetheless.  Nor could one complain about the choice of construction materials.  Afterall, wood is a readily available resource in the region and is far and away the most cost-effective and environmentally friendly building material one could choose.  Instead the problem lies with the side-effects of this viable, but decidedly Band-aid solution to the housing problem.  
            </Typography>
            <br/>
            <Typography component="p">
                No one can doubt that GTA traffic is horrible.  Toronto ranks at a healthy number 6 for worst cities in the world for commuters.  This ranking is made worse by the fact that it's not even accompanied by the likes as Los Angeles or New York like one might expect, but rather decidedly less wealthy cities of the likes of Rio De Janeiro, Bogota, and Istanbul whose issues might more easily attributed to their lack of wealth or stability to solve the problem, rather than planning mismanagement alone.  The GTA has no such excuses.
            </Typography>
            <br/>
            <Typography component="p">
                Although these issues may be somewhat foreign to the GTA and Canada, having such small populations in the past, they’re definitely not foreign on a global scale.

            </Typography>
            <Typography variant="h4">
                The Situation
            </Typography>
            <Typography variant="h6">
                Traffic
            </Typography>
            <Typography component="p">
               Obviously the discussion seems to have shifted seemingly without purpose between housing and traffic.  This is because the two are inextricably linked.  One cannot address housing without first addressing the infrastructure to support it and the traffic that results otherwise.  The flow of people is critical to any good housing solution and must begin here.  If traffic was not a concern, the solution to any housing crisis, particularly in a country with as much space as Canada, becomes obvious: build more houses on more land.  But, this is not the case and this solution as currently approached simply increases commute times and traffic. Wendover Productions does a great job of explaining the fundamental problems of traffic in this video:  <a href="https://www.youtube.com/watch?v=N4PW66_g6XA">TL;DR: More cars on the road causes more traffic, regardless of road width.</a>
            </Typography>
            <br/>
            <Typography component="p">
               Applying this logic to the GTA means more, better, public transport.  People often like to suggest that the public doesn’t like public transport.  Why would they?  It’s inconvenient. It can take 90 minutes to get from Etobicoke to Union Station without ever leaving one road: Lake Shore Boulevard.  It takes on average 32% longer to commute by public transport as by car, and that’s even with Toronto’s horrible traffic.  But, that’s because the infrastructure is not up-to-par.    Why during the day must one change trams on a direct route to Union Station?  Why is a city with 600 000 people, Brampton, whose population is dependent on the Toronto core for employment and exists essentially as a suburb of the city, only running a couple trains a day?  Why is it so difficult to get from any given home to a GO station?  If people need to maintain a car to just use public transport it's hardly desirable to use public transport.
            </Typography>
            <Typography variant="h6">
                Housing
            </Typography>
            <Typography component="p">
                Write about housing here.
            </Typography>

             <Typography variant="h4">
                The Solutions
            </Typography>
            <Typography component="p">
               With movement of people having been given a proper shakedown the topic of housing arises.  Clearly there’s only two options for housing in an expanding city so let’s discuss both of them. 
            </Typography>
            <br/>
            <Typography component="p">
               The first option is to continue with the current method of expansion.  More houses and more urban sprawl.  This is obviously the easier solution as it would mean no change to housing policy and people could continue with their current way of life.  This is not necessarily wrong, but it puts considerably more strain on the people moving infrastructure.  In the example of the GTA if this were the method that were decided upon then a reliance on cars is going to remain.  This is again manageable, but so much space will be wasted on cars.  This video about Barcelona’s attempt to pedestrianize the city has a good discussion on this issue:  <a href="https://www.youtube.com/watch?v=ZORzsubQA_M">TL;DR: Car infrastructure takes up a lot of space and limits cities.</a>
            </Typography>
            <br/>
            <Typography component="p">
               This in mind the only solution in this case would to be to build an absolutely phenomenal public transit system, something the GTA is nowhere near doing.  Though I would not be angry if I were proven wrong in this regard, I would hesitate to trust the current system to suddenly build one of the world’s most ambitious public transit systems.
            </Typography>
            <br/>
            <Typography component="p">
               The other option is to intensify.  This means that current space should be redeveloped to increase the amount of people and services within a given area.  This is the preferred method for most other metropoleis to handle housing.  Buildings that result from intensification are usually concrete and steel heavy.  Although these are not exactly rare materials, they are considerably more costly than the lumber which is available in vast quantities in Canada.  Therefore, in order to lower the cost of such an intensification programme, it would make sense for governments to explore new materials and options for building construction.  An example of this is Cross-Laminated Timber (CLT).  This material has already been used to build medium-height buildings in Canada and other countries.  CLT has the advantage that is a material made entirely from wood, a renewable resource.  As well, the environment benefits from the switch.  Concrete and steel require vast amounts of energy and greenhouse gas emissions to produce and transport.  CLT on the other hand is a carbon trap, gathering carbon from the atmosphere during its growth as trees.  This is just one example, but the big change should be subsidizing new construction methods.  By using a relatively lightweight material like CLT, Canada can begin a move towards pre-fabricated building components.  Sections of much larger buildings can be constructed in an assembly-line and craned into position wherever they need to be placed.  This can significantly reduce the ever-dreaded long construction times, a particularly important issue in Ontario’s short optimal build season. Medium-sized apartment blocks (8-12 stories to avoid the high costs and sunlight blocking that come with taller buildings) can be integrated with with commercial zoning and public transport to reduce the need for cars.  By reducing the distances between residential and commercial zones to essentially zero, by mixing them together, the need for car-based transport is reduced and thus more real-estate is freed for residential and commercial zoning, creating a feedback effect of improvement.
            </Typography>
            <br/>
            <Typography component="p">
               This solution does not only apply to the GTA, although evidently the GTA has the largest housing problems.  Many other countries use the medium-sized apartment block strategy mixed with commercial zoning even in low-density areas.  This allows people in semi-rural areas to benefit from the cost-saving of not needing cars and preserves the environment.  Pre-fabricated build solutions would keep the costs of these constructions down and make them more viable in these low-density areas. 
            </Typography>
            <div className={classes.row}>
                <Typography variant="h5" component="h3">
                    About the Author
                </Typography>
            </div>
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