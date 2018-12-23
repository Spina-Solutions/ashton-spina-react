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
                <Avatar alt="AS" src={require('./laravel.jpg')} className={classes.bigAvatar}/>
            </div>
            <div className={classes.row}>
                <Typography variant="h5" component="h3">
                    TulipAssist
                </Typography>
            </div>
            <Typography variant="h5" component="h3">
                Background
            </Typography>
            <Typography component="p">
                Working on TulipAssist was my first software development job.  TulipAssist is the website for the TulipAssist insurance company which insures primarily mobile phones.  Although the customer-facing pages don't necessarily convey as much, the customer service-facing pages and the systems that support them can be quite complex.  I started here at this job.  Particularly in the back-end.   TulipAssist seeks to ultimately handle the job of insurances and the work that goes with running an insurance company in an automated-as-possible manner.  This means many systems working on managing insurance policies, claims, damages, repairs, and finances with as little human intervention as can be managed.
            </Typography>
            <br/>
            <Divider/>
            <br/>
            <Typography variant="h5" component="h3">
                Major Contributions
            </Typography>
            <Typography variant="h6" component="h6">
                Finance Management System
            </Typography>
            <Typography component="p">
                I began working on TulipAssist as a Junior Back-end developer: building export functionalities for better financial reporting, I quickly transitioned into more complex tasks.  I developed a system for keeping track of how much damage was claimed on phones and how much should be reserved in the company's finances for covering these claims.  This allowed more accurate financial reserves, better compliance, and less man-hours for the finance department.  
            </Typography>
            <Typography variant="h6" component="h6">
                Dynamic Policy Pricing
            </Typography>
            <Typography component="p">
                Dynamic Policy Pricing was another project with significant financial savings for the company.  By making a Device Database (another project I made) I was able to keep track of available phones and their properties.  Based on these properties and historical claim costs we could calculate how much we would expect an average phone of a certain kind would cost in claims.  Then we could adjust the policy costs accordingly.  This meant that phones insurance policies could be more accurately priced, costs fairly distributed to customers, and profits more confidently assured.
            </Typography>
            <Typography variant="h6" component="h6">
                Reseller / Repair Portals
            </Typography>
            <Typography component="p">
                My first real strong foray into front-end devlopment on the TulipAssist project involved making portals for other companies to interact with our system.  By crafting these out of pure CSS (with CSS-Grid) and not relying on external libraries for styling I ensured a lightweight front-end that could be loaded with ease on a variety of connection / hardware qualities, including tablets.  I also deftly used Javascript to avoid full-page reloads with all the front-end - back-end communication.  This is functionality that would normally be much easier achieved with a front-end javascript framework like VueJS, ReactJS, or AngularJS, but I manually created this functionality because including those would be too much for such a small feature and would've required signicant changes to the system.  These portals allowed other companies to resell our insurances in their own shops and our repair contracters to handle their own repair recording in our system, respectively.
            </Typography>
            <Typography variant="h6" component="h6">
                Reseller / Repair Portals
            </Typography>
            <Typography component="p">
                My first real strong foray into front-end devlopment on the TulipAssist project involved making portals for other companies to interact with our system.  By crafting these out of pure CSS (with CSS-Grid) and not relying on external libraries for styling I ensured a lightweight front-end that could be loaded with ease on a variety of connection / hardware qualities, including tablets.  I also deftly used Javascript to avoid full-page reloads with all the front-end - back-end communication.  This is functionality that would normally be much easier achieved with a front-end javascript framework like VueJS, ReactJS, or AngularJS, but I manually created this functionality because including those would be too much for such a small feature and would've required signicant changes to the system.  These portals allowed other companies to resell our insurances in their own shops and our repair contracters to handle their own repair recording in our system, respectively.
            </Typography>
            <Typography variant="h6" component="h6">
                Repair Drop Shipping
            </Typography>
            <Typography component="p">
                I also used the repair portal I built as part of a system of quasi-drop-shipping for phone repairs.  In order to speed up customer claims and improve customer satisfaction we built a system that would directly route phones with claimed damages to our repair contractors and then back to customers, effectively cutting out our own logistics system in a large amount of claim cases.  This significantly improved claim turnover time, reduced the load on our logistics department, and thus improved profits.
            </Typography>
            <Typography variant="h6" component="h6">
                Internationalization
            </Typography>
            <Typography component="p">
                One of my side-projects while working on TulipAssist was bringing Internationalization to the system.
                Although we already had the ability to translate strings for the front-end in our templates, fully converting the system to handle multiple languages and dynamically select a language depending on the user prepared us for international expansion.
            </Typography>
        </div>
    );
}

FullWidthGrid.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FullWidthGrid);