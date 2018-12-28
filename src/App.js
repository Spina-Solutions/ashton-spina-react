import React, { Component } from 'react';
import PersistentDrawerLeft from './components/ToolbarDrawer';
import GridLayout from './components/GridLayout';
import ContentPage from './components/ContentPage';
import RoadTrafficSim from './components/RoadTrafficSim';
import NoMatch from './components/NoMatch';
import Grid from '@material-ui/core/Grid';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import { BrowserRouter, Route } from 'react-router-dom';
import { Parallax } from 'react-parallax';
import ReactGA from 'react-ga';
import SwitchWithSlide from "./SwitchWithSlide";

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
    typography: {
        useNextVariants: true,
    },
});

const projects = [
    { 
        title: 'Universal Cloud Monitoring', 
        subtitle: "Research on monitoring cloud-based virtual machines.", 
        url: '/content/universalcloudmonitoring',
        imageUrl: require('./images/universalCloudMonitoring.png'),
        githubLink: 'https://github.com/a-d-spina-student/waste-cloud-computing',
        href: 'http://www.universalcloudmonitoring.com/'
    }, 
    { 
        title: 'Tulip Assist', 
        subtitle: "A web service for mobile phone insurance.", 
        url: '/content/tulipassist', 
        imageUrl: require('./images/tulipAssist.png'),
        githubLink: '',
        href: 'https://www.tulipassist.nl/'
    },
    { 
        title: 'Device Database', 
        subtitle: "A database service for mobile devices.", 
        url: '/content/devicedatabase', 
        imageUrl: require('./images/deviceDB.png'),
        githubLink: '',
        href: ''
    },
    { 
        title: 'Ashton Spina Website', 
        subtitle: "A personal website", 
        url: '/content/ashtonspina', 
        imageUrl: require('./images/ashtonspina.png'),
        githubLink: 'https://github.com/spina-a-d/ashton-spina-react',
        href: '/'
    },
    { 
        title: 'Wander', 
        subtitle: "An App for Psychological Testing", 
        url: '/content/wander', 
        imageUrl: require('./images/wander.png'),
        githubLink: 'https://github.com/RUGSoftEng/2017-Cognitive-Sensors',
        href: 'https://play.google.com/store/apps/details?id=com.teamwan.wander&hl=en'
    },
    { 
        title: 'University Work', 
        subtitle: "Code snippets from university courses.", 
        url: '/content/university', 
        imageUrl: require('./images/school_work.png'),
        githubLink: 'https://github.com/spina-a-d/Ashton-s-School-Assignment-Collection',
        href: ''
    }, 
];

const blogPosts = [
    /*{ 
        title: 'Laravel vs. NodeJS', 
        subtitle: "A comparison of major back-end frameworks for web development.", 
        url: '/content/laravel-vs-nodejs',
        imageUrl: require('./comingSoon.png')
    },*/
    { 
        title: 'Ontario\'s City Problem', 
        subtitle: "A discussion of urban planning in Ontarian cities.", 
        url: '/content/ontario-city-problem',
        imageUrl: require('./images/gta_space_usage.jpg')
    }
];  

class App extends Component {

    componentDidMount() {
        ReactGA.initialize('UA-131177225-1');
        ReactGA.set({ page: window.location.pathname });
        ReactGA.pageview(window.location.pathname + window.location.search);
    }

    componentDidUpdate() {
        ReactGA.initialize('UA-131177225-1');
        ReactGA.set({ page: window.location.pathname });
        ReactGA.pageview(window.location.pathname + window.location.search);
    }

    render() {
        return (
            <BrowserRouter>
                <div className="App">
                    <MuiThemeProvider theme={theme}>
                    <header>
                        <PersistentDrawerLeft>
                           <SwitchWithSlide
                                updateStep={(...currentStep) => this.setState({ currentStep })}
                            >
                                <Route exact path='/' render={(props) => (
                                    <div>
                                        <Parallax
                                            bgImage={require('./images/background.jpg')}
                                            strength={400}
                                        >
                                            <div style={{margin: '20px', minHeight: 'calc(100vh - 72px)'}}>
                                                <Grid item xs={12}>
                                                    <GridLayout items={ blogPosts.sort(() => Math.random() - 0.5) }/>
                                                </Grid>
                                            </div>
                                        </Parallax>
                                    </div>
                                )}/>
                                <Route exact path='/projects' render={(props) => (
                                    <div>
                                        <Parallax
                                            bgImage={require('./images/background.jpg')}
                                            strength={400}
                                        >
                                            <div style={{margin: '20px', minHeight: 'calc(100vh - 72px)'}}>
                                                <Grid item xs={12}>
                                                    <GridLayout items={ projects.sort(() => Math.random() - 0.5) }/>
                                                </Grid>
                                            </div>
                                        </Parallax>
                                    </div>
                                )}/>
                                <Route exact path='/road-traffic-sim' render={(props) => (
                                    <RoadTrafficSim/>
                                )}/>
                                <Route path='/content' render={(props) => (
                                    <ContentPage/>
                                )}/>
                                <Route component={NoMatch} />
                            </SwitchWithSlide>
                        </PersistentDrawerLeft>
                    </header>
                    </MuiThemeProvider>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;