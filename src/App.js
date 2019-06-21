import React, { Component } from 'react';
import PersistentDrawerLeft from './components/ToolbarDrawer';
import GridLayout from './components/GridLayout';
import ContentPage from './components/ContentPage';
import NoMatch from './components/NoMatch';
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
        url: '/content/universalcloudmonitoring',
        imageUrl: require('./images/universalCloudMonitoring.png'),
    }, 
    { 
        title: 'Tulip Assist',
        url: '/content/tulipassist', 
        imageUrl: require('./images/tulipAssist.png'),
    },
    { 
        title: 'Device Database',
        url: '/content/devicedatabase', 
        imageUrl: require('./images/deviceDB.png'),
    },
    { 
        title: 'Ashton Spina Website',
        url: '/content/ashtonspina', 
        imageUrl: '/logo.svg',
    },
    { 
        title: 'Wander',
        url: '/content/wander', 
        imageUrl: require('./images/wander.png'),
    },
    { 
        title: 'University Work',
        url: '/content/university', 
        imageUrl: require('./images/school_work.png'),
        href: ''
    },
    {
        title: 'Travel-Atlas',
        url: '/content/travel-atlas',
        imageUrl: require('./images/travel-atlas.svg'),
    },
];

const blogPosts = [
    { 
        title: 'Ontario\'s City Problem',
        url: '/content/ontario-city-problem',
        imageUrl: require('./images/gta_space_usage.jpg')
    },
    { 
        title: 'Placeholder',
        url: '#',
        imageUrl: require('./futureContent.jpg')
    },
    { 
        title: 'Placeholder',
        url: '#',
        imageUrl: require('./futureContent.jpg')
    },
];  

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            backgroundBlog: "url("+require('./blog.jpg')+")",
            backgroundProjects: "url("+require('./projects.jpg')+")",
        };
    }

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
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: 0,
                                                left: 0,
                                                height: 'calc(100vh - 64px)',
                                                width: "100vw",
                                                background: 'white',
                                                zIndex: 0
                                            }}
                                        >
                                            <Particles
                                                params={{
                                                    "particles": {
                                                        "number": {
                                                            "value": 100,
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
                                                                "speed": 50,
                                                                "size_min": 0.1,
                                                                "sync": false
                                                            }
                                                        },
                                                        "color": {
                                                            "value": "#000000"
                                                        },
                                                        "shape": {
                                                            "type": "circle",
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
                                                            "color": "#000000",
                                                            "opacity": 0.4,
                                                            "width": 2
                                                        },
                                                        "move": {
                                                            "enable": true,
                                                            "speed": 5,
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
                                                                    "color": "#000000",
                                                                },
                                                                "shape": {
                                                                    "type": "polygon",
                                                                    "stroke": {
                                                                        "width": 2,
                                                                        "color": "#000000"
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
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    height: "60vh",
                                                    width: "100%",
                                                }}
                                            />
                                        </div>
                                        <div
                                            style={{
                                                height: 'calc(100vh - 64px)',
                                                width: "100vw",
                                                zIndex: 1
                                            }}
                                        >

                                            <GridLayout style={{ background: '#ffddda' }} items={ blogPosts }/>
                                        </div>
                                    </div>
                                )}/>
                                <Route exact path='/projects' render={(props) => (
                                    <div>
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: 0,
                                                left: 0,
                                                height: 'calc(100vh - 64px)',
                                                width: "100vw",
                                                background: 'white',
                                            }}
                                        >
                                            <Particles
                                                params={{
                                                    "particles": {
                                                        "number": {
                                                            "value": 100,
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
                                                                "speed": 50,
                                                                "size_min": 0.1,
                                                                "sync": false
                                                            }
                                                        },
                                                        "color": {
                                                            "value": "#000000"
                                                        },
                                                        "shape": {
                                                          "type": "circle",
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
                                                          "color": "#000000",
                                                          "opacity": 0.4,
                                                          "width": 2
                                                        },
                                                        "move": {
                                                          "enable": true,
                                                          "speed": 5,
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
                                                              "color": "#000000",
                                                            },
                                                            "shape": {
                                                              "type": "polygon",
                                                              "stroke": {
                                                                    "width": 2,
                                                                    "color": "#000000"
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
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    height: "60vh",
                                                    width: "100%",
                                                }}
                                            />
                                        </div>
                                        <div
                                            style={{
                                                height: 'calc(100vh - 64px)',
                                                width: "100vw",
                                                zIndex: 1
                                            }}
                                        >
                                            <GridLayout items={ projects.sort(() => Math.random() - 0.5) }/>
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