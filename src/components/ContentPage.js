import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Route, Switch, Redirect } from 'react-router-dom';
import AshtonSpina from './content/AshtonSpina';
import UniversalCloudMonitoring from './content/UniversalCloudMonitoring';
import Laravel from './content/Laravel';
import NodeJS from './content/NodeJS';
import ReactJS from './content/ReactJS';
import VueJS from './content/VueJS';

const styles = theme => ({
    root: {
        flexGrow: 1,
        margin: '3vw'
    },
    paper: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    }
});

function FullWidthGrid(props) {
    const { classes } = props;
    return (
        <div className={classes.root}>
            <Grid container>
                <Grid item xs={12}>
                    <Paper className={classes.paper} elevation={10}>
                        <Switch>
                            <Route exact path='/content/ashtonspina' render={(props) => (
                                <AshtonSpina/>
                            )}/>
                            <Route exact path='/content/universalcloudmonitoring' render={(props) => (
                                <UniversalCloudMonitoring/>
                            )}/>
                            <Route exact path='/content/laravel' render={(props) => (
                                <Laravel/>
                            )}/>
                            <Route exact path='/content/nodejs' render={(props) => (
                                <NodeJS/>
                            )}/>
                            <Route exact path='/content/reactjs' render={(props) => (
                                <ReactJS/>
                            )}/>
                            <Route exact path='/content/vuejs' render={(props) => (
                                <VueJS/>
                            )}/>
                            <Route render={(props) => (
                                <Redirect to="/nomatch" />
                            )}/>
                        </Switch>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
}

FullWidthGrid.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FullWidthGrid);