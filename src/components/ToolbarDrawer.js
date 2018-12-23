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
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import Avatar from '@material-ui/core/Avatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import DeveloperBoardIcon from '@material-ui/icons/DeveloperBoard';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

const drawerWidth = 240;

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
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerOpen}
              className={classNames(classes.menuButton, open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            <div className={classes.toolbarButtons}>
                <Link to="/" style={{ textDecoration: 'none', color: 'black' }}> 
                    <Button color="inherit">Home</Button>
                </Link>
                <Link to="/content/aboutme" style={{ textDecoration: 'none', color: 'black' }}> 
                    <Button color="inherit">About Me</Button>
                </Link>
                <a href="https://github.com/spina-a-d" style={{ textDecoration: 'none', color: 'black' }}> 
                    <Button color="inherit">GitHub</Button>
                </a>
                <a href="https://www.linkedin.com/in/spinaadbusiness/" style={{ textDecoration: 'none', color: 'black' }}> 
                    <Button color="inherit">LinkedIn</Button>
                </a>
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
                <IconButton onClick={this.handleDrawerClose}>
                    {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
            </div>
            <Divider/>
            <List>
                <Link to='/' style={{ textDecoration: 'none', color: 'black' }}>
                    <ListItem button>
                        <ListItemIcon><HomeIcon/></ListItemIcon>
                        <ListItemText primary="Home"/>
                    </ListItem>
                </Link>
                <Link to='/' style={{ textDecoration: 'none', color: 'black' }}>
                    <ListItem button>
                        <ListItemIcon><DeveloperBoardIcon/></ListItemIcon>
                        <ListItemText primary="Blog"/>
                    </ListItem>
                </Link> 
            </List>
            <Divider />
            <List>
                <Link to='/content/laravel' style={{ textDecoration: 'none', color: 'black' }}>
                    <ListItem button>
                        <ListItemIcon>
                            <Avatar alt='Laravel' src={require('./Laravel.svg')}/>
                        </ListItemIcon>
                        <ListItemText primary='Laravel' />
                    </ListItem>
                </Link>
                <Link to='/content/nodejs' style={{ textDecoration: 'none', color: 'black' }}>
                  <ListItem button>
                      <ListItemIcon>
                          <Avatar alt='NodeJS' src={require('./NodeJS.svg')}/>
                      </ListItemIcon>
                      <ListItemText primary='NodeJS' />
                  </ListItem>
                </Link> 
                <Link to='/content/reactjs' style={{ textDecoration: 'none', color: 'black' }}>
                  <ListItem button>
                      <ListItemIcon>
                          <Avatar alt='ReactJS' src={require('./ReactJS.png')}/>
                      </ListItemIcon>
                      <ListItemText primary='ReactJS' />
                  </ListItem>
                </Link>
                <Link to='/content/vuejs' style={{ textDecoration: 'none', color: 'black' }}>
                    <ListItem button>
                        <ListItemIcon>
                            <Avatar alt='VueJS' src={require('./VueJS.png')}/>
                        </ListItemIcon>
                        <ListItemText primary='VueJS' />
                    </ListItem>
                </Link>
                <Link to='/content/android' style={{ textDecoration: 'none', color: 'black' }}>
                    <ListItem button>
                        <ListItemIcon>
                            <Avatar alt='Android' src={require('../android.jpg')}/>
                        </ListItemIcon>
                        <ListItemText primary='Android' />
                    </ListItem>
                </Link>
            </List>
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
