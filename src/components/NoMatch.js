import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import { Parallax } from 'react-parallax';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    button: {
        margin: theme.spacing(1),
    },
});


function NoMatch(props) {
    const { classes } = props;
    return (
        <div className={classes.root}>
            <Parallax
                bgImage={'https://stmed.net/sites/default/files/nice-wallpapers-28768-2049855.jpg'}
                strength={400}
            >
                <div style={{margin: '20px', height: '89vh'}}>
                    <Grid item xs={12} sm={6}>
                        <Grid container justify ="center">
                            <Typography gutterBottom variant="h1" component="h1">
                                404 : This Page Doesn't Exist
                            </Typography>
                            <Grid container justify="center">
                                <Link to='/' style={{ textDecoration: 'none', color: 'black' }}>
                                    <IconButton aria-label="Home" className={classes.button}>
                                        <HomeIcon style={{ fontSize: '72px' }} color="secondary"/>
                                    </IconButton>
                                </Link>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </Parallax>  
        </div>
    );
}

NoMatch.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NoMatch);