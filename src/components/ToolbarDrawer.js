import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import Avatar from '@material-ui/core/Avatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { SocialIcon } from 'react-social-icons';
import Typography from '@material-ui/core/Typography';

const drawerWidth = 330;

const styles = theme => ({
    root: {
        display: 'flex',
    },
    toolbarButtons: {
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 20,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
     },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
    row: {
        display: 'flex',
        justifyContent: 'center',
    },
    bigAvatar: {
        borderStyle: 'solid',
        borderWidth: '3px',
        borderColor: '#2196f3',
        width: 180,
        height: 180,
    },
    socialIcon: {
        '&:hover': {
            borderRadius: '100px',
            backgroundClip: 'content-box',
            backgroundColor: '#B0BEC5'
        }
    }
});

class PersistentDrawerLeft extends React.Component {
  state = {
    open: false,
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes, theme } = this.props;
    const { open } = this.state;

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={classNames(classes.appBar, {
            [classes.appBarShift]: open,
          })}
        >
          <Toolbar disableGutters={!open}>
            <Button
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerOpen}
              className={classNames(classes.menuButton, open && classes.hide)}
            >
              About Me
            </Button>
            <div className={classes.toolbarButtons}>
                <Link to="/" style={{ textDecoration: 'none', color: 'black' }}> 
                    <Button color="inherit">Blog</Button>
                </Link>
                <Link to="/projects" style={{ textDecoration: 'none', color: 'black' }}> 
                    <Button color="inherit">Projects</Button>
                </Link>
            </div>
          </Toolbar>
        </AppBar>
        <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="left"
            open={open}
            classes={{
                paper: classes.drawerPaper,
            }}
        >
            <div className={classes.drawerHeader}>
                {/* MR to make backgroundColor change fill in works, check on this later */}
                <SocialIcon className={classes.socialIcon} url="https://www.linkedin.com/in/spinaadbusiness/"/>
                <SocialIcon className={classes.socialIcon} url="https://github.com/spina-a-d"/>
                <SocialIcon className={classes.socialIcon} url="https://stackoverflow.com/users/10460453/ashton-spina"/>
                <SocialIcon className={classes.socialIcon} url="https://www.facebook.com/ashton.spina"/>
                <SocialIcon className={classes.socialIcon} url="https://www.instagram.com/ashtonspina/"/>
                <IconButton onClick={this.handleDrawerClose}>
                    {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
            </div>
            <Divider/>
            <br/>
            <List>
                <div className={classes.row}>
                    <Avatar alt="AS" src={require('./content/images/ashtonspina.jpg')} className={classes.bigAvatar}/>
                </div>
                <div className={classes.row}>
                    <Typography variant="h5" component="h3">
                        Ashton Spina
                    </Typography>
                </div>
                <Link className={classes.row} to="/content/aboutme" style={{ textDecoration: 'none', color: 'black' }}> 
                    <Button variant="outlined">Learn More</Button>
                </Link>
            </List>
            <List>
                <Divider/>
                <ListItem>
                    <Typography variant="h6" component="h6">
                        Experience
                    </Typography>
                </ListItem>
                <Divider/>
                <Link to='/content/laravel' style={{ textDecoration: 'none', color: 'black' }}>
                    <ListItem button>
                        <ListItemIcon>
                            <Avatar alt='Laravel' src={require('./icons/Laravel.svg')}/>
                        </ListItemIcon>
                        <ListItemText primary='Laravel' />
                    </ListItem>
                </Link>
                <Link to='/content/nodejs' style={{ textDecoration: 'none', color: 'black' }}>
                  <ListItem button>
                      <ListItemIcon>
                          <Avatar alt='NodeJS' src={require('./icons/NodeJS.svg')}/>
                      </ListItemIcon>
                      <ListItemText primary='NodeJS' />
                  </ListItem>
                </Link> 
                <Link to='/content/reactjs' style={{ textDecoration: 'none', color: 'black' }}>
                  <ListItem button>
                      <ListItemIcon>
                          <Avatar alt='ReactJS' src={require('./icons/ReactJS.png')}/>
                      </ListItemIcon>
                      <ListItemText primary='ReactJS' />
                  </ListItem>
                </Link>
                <Link to='/content/vuejs' style={{ textDecoration: 'none', color: 'black' }}>
                    <ListItem button>
                        <ListItemIcon>
                            <Avatar alt='VueJS' src={require('./icons/VueJS.png')}/>
                        </ListItemIcon>
                        <ListItemText primary='VueJS' />
                    </ListItem>
                </Link>
                <Link to='/content/android' style={{ textDecoration: 'none', color: 'black' }}>
                    <ListItem button>
                        <ListItemIcon>
                            <Avatar alt='Android' src={require('../images/android.jpg')}/>
                        </ListItemIcon>
                        <ListItemText primary='Android' />
                    </ListItem>
                </Link>
            </List>
            <br/>
        </Drawer>
        <main
          className={classNames(classes.content, {
            [classes.contentShift]: open,
          })}
        >
          <div className={classes.drawerHeader} />
            {this.props.children}
        </main>
      </div>
    );
  }
}

PersistentDrawerLeft.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(PersistentDrawerLeft);
