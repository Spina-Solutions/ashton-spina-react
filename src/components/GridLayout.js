import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    card: {
        padding: '5px',
        background: 'linear-gradient(to right, #000000 0%, #111111 51%, #000000 100%)',
        transition: '6s',
        '&:hover': {
            background: 'linear-gradient(to right, #000000 0%, #444444 51%, #000000 100%)',
        },
        borderRadius: '20px'
    },
    actions: {
        height: '100%',
        display: 'flex',
        alignIitems: 'center',
        justifyContent: 'center',
    },
    text: {
      color: 'white',
      fontSize: '20px',
      position: 'absolute',
      top: '50%',
      left: '50%',
      '-webkit-transform': 'translate(-50%, -50%)',
      '-ms-transform': 'translate(-50%, -50%)',
      'transform': 'translate(-50%, -50%)',
      textAlign: 'center'
    }

});


function FullWidthGrid(props) {
    const { classes } = props;
    return (
        <div className={classes.root}>
            <Grid container spacing={32}>
                {
                    props.items.map((item, key) =>
                        <Grid key={key} item xs={12} sm={6} md={6} lg={4}>
                            <Card 
                                className={classes.card}
                                raised
                            >
                                <CardActionArea>
                                    <CardMedia
                                        style={{height: 0, paddingTop: '56.25%', borderRadius: '20px'}}
                                        image={item.imageUrl}
                                        title={item.title}
                                     />
                                 </CardActionArea>  
                                <div className={classes.actions}>
                                    <CardActions>
                                            {item.githubLink && item.githubLink.length > 0 &&
                                                <a href={item.githubLink} style={{ textDecoration: 'none' }}>
                                                    <Button size="small" color="primary">
                                                        See it on Github
                                                    </Button>
                                                </a>
                                            }
                                            {item.href && item.href.length > 0 &&
                                                <a href={item.href} style={{ textDecoration: 'none' }}>
                                                    <Button size="small" color="primary">
                                                        See it in Action
                                                    </Button>
                                                </a>    
                                            }
                                            {item.url && item.url.length > 0 &&
                                                <a href={item.url} style={{ textDecoration: 'none' }}>
                                                    <Button size="small" color="primary">
                                                        Read About It
                                                    </Button>
                                                </a>
                                            }
                                    </CardActions>
                                </div>
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