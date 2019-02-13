import React, { Component } from 'react';
import PersistentDrawerLeft from './components/ToolbarDrawer';
import GridLayout from './components/GridLayout';
import ContentPage from './components/ContentPage';
import NoMatch from './components/NoMatch';
import Grid from '@material-ui/core/Grid';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import { BrowserRouter, Route } from 'react-router-dom';
import Particles from 'react-particles-js';
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
                                        
                                        <div style={{margin: '20px', minHeight: 'calc(100vh - 72px)'}}>
                                            <Grid item xs={12}>
                                                <GridLayout items={ blogPosts.sort(() => Math.random() - 0.5) }/>
                                            </Grid>
                                        </div>
                                    </div>
                                )}/>
                                <Route exact path='/projects' render={(props) => (
                                    <div>
                                        <Particles
                                            params={{
                                                "particles": {
                                                    "number": {
                                                        "value": 250,
                                                        "density": {
                                                            "enable": true,
                                                            "value_area": 800
                                                        }
                                                    },
                                                    "size": {
                                                        "value": 5,
                                                        "random": true,
                                                        "anim": {
                                                            "enable": false,
                                                            "speed": 100,
                                                            "size_min": 0.1,
                                                            "sync": false
                                                        }
                                                    },
                                                    "color": {
                                                        "value": "random"
                                                    },
                                                    "shape": {
                                                      "type": "polygon",
                                                      "stroke": {
                                                        "width": 1,
                                                        "color": "random"
                                                      },
                                                      "polygon": {
                                                        "nb_sides": 6
                                                      }, 
                                                    },
                                                    "opacity": {
                                                        "value": 0.5,
                                                        "anim": {
                                                            "enable": false,
                                                            "speed": 1,
                                                            "opacity_min": 0.4,
                                                            "sync": false
                                                        } 
                                                    },
                                                    "line_linked": {
                                                      "enable": true,
                                                      "distance": 100,
                                                      "color": "#ff0000",
                                                      "opacity": 0.4,
                                                      "width": 2
                                                    },
                                                    "move": {
                                                      "enable": true,
                                                      "speed": 1,
                                                      "direction": "none",
                                                      "random": false,
                                                      "straight": false,
                                                      "out_mode": "out",
                                                      "bounce": false,
                                                      "attract": {
                                                        "enable": false,
                                                        "rotateX": 600,
                                                        "rotateY": 1200
                                                      }
                                                    }
                                                },
                                                "interactivity": {
                                                    "events": {
                                                        "onhover": {
                                                            "enable": true,
                                                            "mode": "grab"
                                                        },
                                                        "onclick": {
                                                            "enable": true,
                                                            "mode": "push"
                                                          },
                                                        "resize": true
                                                    },
                                                    "modes": {
                                                      "grab": {
                                                        "distance": 100,
                                                        "line_linked": {
                                                          "color": "#ff0000",
                                                        },
                                                        "shape": {
                                                          "type": "polygon",
                                                          "stroke": {
                                                                "width": 2,
                                                                "color": "#ff0000"
                                                          },
                                                          "polygon": {
                                                                "nb_sides": 6
                                                        }, 
                                                    },
                                                      },
                                                      "bubble": {
                                                        "distance": 400,
                                                        "size": 10,
                                                        "duration": 2,
                                                        "opacity": 0.6,
                                                        "speed": 0.2
                                                      },
                                                      "repulse": {
                                                        "distance": 100,
                                                        "duration": 2
                                                      },
                                                      "push": {
                                                        "particles_nb": 4
                                                      },
                                                      "remove": {
                                                        "particles_nb": 2
                                                      }
                                                    }
                                                },
                                                "retina_detect": true
                                            }}
                                            style={{
                                                position: "absolute",
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                top: -5,
                                                width: "100%",
                                                height: "100%",
                                                background: '#ffffff'
                                            }}
                                        />
                                        <div style={{margin: '20px', minHeight: 'calc(100vh - 72px)'}}>
                                            <Grid item xs={12}>
                                                <GridLayout items={ projects.sort(() => Math.random() - 0.5) }/>
                                            </Grid>
                                        </div>
                                    </div>  
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