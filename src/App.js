import React, { Component } from 'react';
import PersistentDrawerLeft from './components/ToolbarDrawer';
import GridLayout from './components/GridLayout';
import ContentPage from './components/ContentPage';
import NoMatch from './components/NoMatch';
import Grid from '@material-ui/core/Grid';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Parallax } from 'react-parallax';
import ReactGA from 'react-ga';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#ffffff',
        },
        secondary: {
            main: '#000000',
        },
        success: green
    },
});

const myItems = [
    { 
        title: 'Universal Cloud Monitoring', 
        text: "The result of thesis research, this project was created with the goal of monitoring cloud-based virtual machines in a potentially hybrid network.", 
        url: '/content/universalcloudmonitoring',
        imageUrl: require('./universalCloudMonitoring.png'),
        githubLink: 'https://github.com/a-d-spina-student/waste-cloud-computing',
        href: 'https://www.universalcloudmonitoring.com/'
    }, 
    { 
        title: 'Tulip Assist', 
        text: "I worked almost entirely as a Backend Developer for this project which already existed before I came onboard.  Here I made sure that tools were available for workers that used the website for internal purposes, financial reporting, and customer service.  As well I was in charge of making sure the website was stable and optimized when needed.", 
        url: '/content/tulipassist', 
        imageUrl: require('./tulipAssist.png'),
        githubLink: '',
        href: 'https://www.tulipassist.nl/'
    },
    { 
        title: 'Device Database', 
        text: "I acted as a lead, full-stack developer for this project from start to finish.  I made sure that the project had the back-end functionality needed to support the systems that would rely on it and a easy-to-use, clean front-end.", 
        url: '/content/devicedatabase', 
        imageUrl: require('./deviceDB.png'),
        githubLink: '',
        href: ''
    },
    { 
        title: 'Ashton Spina Website', 
        text: "This project is a personal project, and likely the website where you're readying this text.", 
        url: '/content/project_one', 
        imageUrl: require('./ashtonspina.png'),
        githubLink: '',
        href: '/'
    },
    { 
        title: 'Wander', 
        text: "This project is a personal project, and likely the website where you're readying this text.", 
        url: '/content/project_one', 
        imageUrl: require('./wander.png'),
        githubLink: 'https://github.com/RUGSoftEng/2017-Cognitive-Sensors',
        href: 'https://play.google.com/store/apps/details?id=com.teamwan.wander&hl=en'
    },
    { 
        title: 'University Work', 
        text: "Here I explain the collection of work that was a result of my education.", 
        url: '/content/project_one', 
        imageUrl: require('./school_work.png'),
        githubLink: 'https://github.com/spina-a-d/Ashton-s-School-Assignment-Collection',
        href: ''
    }, 
];



class App extends Component {
    render() {
        ReactGA.initialize('UA-131177225-1');
        ReactGA.pageview(window.location.pathname + window.location.search);
        return (
            <BrowserRouter>
                <div className="App">
                    <MuiThemeProvider theme={theme}>
                    <header>
                        <PersistentDrawerLeft>
                            <transition
                                name="fade"
                                mode="out-in"
                              >
                                <Switch>
                                    <Route exact path='/' render={(props) => (
                                        <div>
                                            <Parallax
                                                bgImage={require('./background.jpg')}
                                                strength={400}
                                            >
                                                <div style={{margin: '20px', minHeight: 'calc(100vh - 72px)'}}>
                                                    <Grid item xs={12}>
                                                        <GridLayout items={ myItems.sort(() => Math.random() - 0.5) }/>
                                                    </Grid>
                                                </div>
                                            </Parallax>
                                        </div>
                                    )}/>
                                    <Route path='/content' render={(props) => (
                                        <ContentPage/>
                                    )}/>
                                    <Route component={NoMatch} />
                                </Switch>
                            </transition>
                        </PersistentDrawerLeft>
                    </header>
                    </MuiThemeProvider>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;