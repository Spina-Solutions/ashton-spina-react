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
import {withRouter} from 'react-router-dom';

const drawerWidth = 330;

const styles = theme => ({
    root: {
        display: 'flex',
    },
    icon: {
        img: {
            margin: 'auto',
        }
    },
    toolbarButtons: {
        marginLeft: 'auto',
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
    leftButton: {
        marginLeft: 12,
        marginRight: 20,
        zIndex: 10,
    },
    rightButton: {
        marginLeft: 12,
        marginRight: 20,
        zIndex: 10,
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
        overflowX: 'hidden'
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
        width: 50,
        height: 50,
    },
    socialIcon: {
        '&:hover': {
            borderRadius: '100px',
            backgroundClip: 'content-box',
            backgroundColor: '#B0BEC5'
        }
    },
});

class PersistentDrawerLeft extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            scrollY: 0,
            width: window.innerWidth,
            top: false,
            dialogOpen: false,
            searchName: ''
        };
    }

    /**
     * For now I call the same function in both lifecycle hooks because the state won't always be set otherwise because of the order of the components mounting
     */
    componentDidMount () {
        window.addEventListener('scroll', this.updateScrollPosition.bind(this));
        window.addEventListener('resize', this.updateWindowDimensions.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.updateScrollPosition.bind(this));
        window.removeEventListener('resize', this.updateWindowDimensions.bind(this));
    }

    updateScrollPosition() {
        this.setState({ scrollY: window.scrollY });
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth });
    }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes, theme, location } = this.props;
    const { open } = this.state;

    return (
      <div className={classes.root}>
        <CssBaseline />
          <AppBar
              style={{
                  background: 'white',
                  boxShadow: 'none',
                  opacity: this.state.scrollY > 0 ? 0.8 : 1,
                  WebkitTransition: 'opacity 1s ease, margin 225ms cubic-bezier(0.0, 0, 0.2, 1) 0ms,width 225ms cubic-bezier(0.0, 0, 0.2, 1) 0ms',
                  transition: 'opacity 1s ease, margin 225ms cubic-bezier(0.0, 0, 0.2, 1) 0ms,width 225ms cubic-bezier(0.0, 0, 0.2, 1) 0ms',
                  transitionDelay: 'opacity 0.3s',
              }}
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
              className={classNames(classes.leftButton, open && classes.hide)}
            >
                About Me
            </Button>
              <div
                  style={{
                      margin: 'auto',
                      textAlign: 'center',
                      maxWidth: '10%',
                      maxHeight: '10%'
                  }}
              >
                  <div
                      style={{
                          opacity: !['/', '/projects'].includes(location.pathname) || this.state.scrollY > 0 ? 0 : 1,
                          left: '50%',
                          top: '10%',
                          transform: !['/', '/projects'].includes(location.pathname) || this.state.scrollY > 0 ? 'translate(-50%, -100%)' : 'translate(-50%, -68%)',
                          position: 'absolute',
                          width: window.innerWidth < 500 ? '320px' : '400px',
                          height: window.innerWidth < 500 ? '320px' : '400px',
                          background: 'rgba(255, 255, 255, 1)',
                          borderRadius: '300px',
                          WebkitTransition: '1s', /* Safari prior 6.1 */
                          transition: '1s',
                      }}
                  />
                  <div
                      style={{
                          height: !['/', '/projects'].includes(location.pathname) || this.state.scrollY > 0 ? '120px' : window.innerWidth < 500 ? '180px' : '300px',
                          position: 'absolute',
                          left: '50%',
                          top: !['/', '/projects'].includes(location.pathname) ||  this.state.scrollY > 0 ? '50%' : '80%',
                          transform: !['/', '/projects'].includes(location.pathname) || this.state.scrollY > 0 ? 'translate(-50%, -78%)': window.innerWidth < 500 ? 'translate(-50%, -65%)' : 'translate(-50%, -50%)',
                          borderRadius: '300px',
                          overflow: 'hidden',
                          WebkitTransition: '1s', /* Safari prior 6.1 */
                          transition: '1s',
                      }}
                  >
                      <img
                          style={{
                              height: !['/', '/projects'].includes(location.pathname) || this.state.scrollY > 0 ? '180px' : window.innerWidth < 500 ? '240px' : '300px',
                              WebkitTransition: '1s', /* Safari prior 6.1 */
                              transition: '1s',
                          }}
                          alt="ashtonspina"
                          src="/logo.svg"
                      />
                  </div>
                  <Link to="/">
                      <div
                          style={{
                              opacity: 0,
                              left: '50%',
                              top: '10%',
                              transform: !['/', '/projects'].includes(location.pathname) || this.state.scrollY > 0 ? 'translate(-50%, -85%)' : 'translate(-50%, -68%)',
                              position: 'absolute',
                              width: window.innerWidth < 500 ? '320px' : '400px',
                              height: window.innerWidth < 500 ? '320px' : '400px',
                              background: 'rgba(255, 255, 255, 1)',
                              borderRadius: '300px',
                              WebkitTransition: '1s', /* Safari prior 6.1 */
                              transition: '1s',
                          }}
                      />
                  </Link>
              </div>
            <div className={classes.rightButton}>
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
                            <Avatar alt='Android' src={require('../images/thumbs/android_tn.jpg')}/>
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

export default withRouter(withStyles(styles, { withTheme: true })(props => <PersistentDrawerLeft {...props}/>));
