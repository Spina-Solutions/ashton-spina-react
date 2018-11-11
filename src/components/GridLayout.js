import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import green from '@material-ui/core/colors/green';

const styles = theme => ({
    root: {
        flexGrow: 1,
    }
});

const theme = createMuiTheme({
  palette: {
    primary: green,
  }
});


function FullWidthGrid(props) {
    const { classes } = props;
    return (
        <div className={classes.root}>
            <Grid container spacing={40}>
                {
                    props.items.map((item, key) =>
                        <Grid key={key} item xs={12} sm={6} md={4} lg={3}>
                            <Card raised>
                              <CardActionArea>
                                <CardMedia
                                    style={{height: 0, paddingTop: '56.25%'}}
                                    image={item.imageUrl}
                                    title="Contemplative Reptile"
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        {item.title}
                                    </Typography>
                                    <Typography component="p">
                                        {item.text}
                                    </Typography>
                                </CardContent>
                              </CardActionArea>
                              <CardActions>
                                {item.githubLink && item.githubLink.length > 0 &&
                                    <Button size="small" color="secondary" href={item.githubLink}>
                                        See it on Github
                                    </Button>
                                }
                                {item.href && item.href.length > 0 &&
                                    <Button size="small" color="primary" href={item.href}>
                                        See it in Action
                                    </Button>
                                }
                                <React.Fragment>
                                    <MuiThemeProvider theme={theme}>
                                        <Button size="small" color="primary" href={item.url}>
                                            Read About It
                                        </Button>
                                    </MuiThemeProvider>
                                </React.Fragment>
                              </CardActions>
                            </Card>
                        </Grid>
                    )
                }
            </Grid>
        </div>
    );
}

FullWidthGrid.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FullWidthGrid);