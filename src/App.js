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
import Typography from '@material-ui/core/Typography';

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
    { 
        title: 'Ontario\'s City Problem', 
        subtitle: "A discussion of urban planning in Ontarian cities.", 
        url: '/content/ontario-city-problem',
        imageUrl: require('./images/gta_space_usage.jpg')
    },
    { 
        title: 'Placeholder', 
        subtitle: "Future content", 
        url: '#',
        imageUrl: require('./futureContent.jpg')
    },
    { 
        title: 'Placeholder', 
        subtitle: "Future content", 
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
                                                right: 0,
                                                height: "100vh",
                                                width: "100%",
                                                background: '#000036',
                                                backgroundImage: this.state.backgroundBlog,
                                                backgroundPosition: "center"
                                            }}
                                        >
                                            <Particles
                                                params={{
                                                    "particles": {
                                                        "number": {
                                                            "value": 160,
                                                            "density": {
                                                                "enable": false
                                                            }
                                                        },
                                                        "size": {
                                                            "value": 20,
                                                            "random": true
                                                        },
                                                        "move": {
                                                            "direction": "bottom",
                                                            "out_mode": "out"
                                                        },
                                                        "line_linked": {
                                                            "enable": false
                                                        }
                                                    },
                                                    "interactivity": {
                                                        "events": {
                                                            "onhover": {
                                                                "enable": true,
                                                                "mode": "bubble"
                                                            },
                                                            "onclick": {
                                                                "enable": true,
                                                                "mode": "remove"
                                                            }
                                                        },
                                                        "modes": {
                                                            "remove": {
                                                                "particles_nb": 10
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
                                                    height: "100vh",
                                                    width: "100%",
                                                }}
                                            />
                                        </div>
                                        <div style={{
                                                position: 'absolute',
                                                zIndex: 5,
                                                top: '25vh',
                                                left: '50vw',
                                                color: '#ffffff',
                                                transform: 'translate(-50%, -50%)',
                                                textAlign: 'center'
                                            }}
                                        >
                                            <Typography component="h2" variant="h2" gutterBottom color="primary" style={{textShadow: '2px 4px 3px rgba(0,0,0,0.3)'}}>
                                                I am
                                            </Typography>
                                            <div 
                                                style={{
                                                    height: '150px',
                                                    width: '400px',
                                                    overflow: 'hidden',
                                                    margin: 'auto'
                                                }}
                                            >
                                                <img 
                                                    src={require('./components/icons/AshtonSpina.svg')}
                                                    style={{
                                                        height: '500px',
                                                        width: '500px',
                                                        margin: '-200px 0 -300px -50px'
                                                    }}
                                                    alt=""
                                                />
                                            </div>
                                             <Typography variant="subtitle1" gutterBottom color="primary" style={{textShadow: '2px 4px 3px rgba(0,0,0,0.3)'}}>
                                                Read what I wrote
                                            </Typography>
                                        </div>
                                        <div 
                                            style={{
                                                position: "absolute",
                                                top: "60vh",
                                                left: 0,
                                                right: 0,
                                                height: "40vh",
                                                background: '#ffffff'
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
                                                height: "100vh",
                                                width: "100%",
                                                backgroundImage: this.state.backgroundProjects,
                                                backgroundPosition: '45% 50%'
                                            }}
                                        >
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
                                                            "value": "#FFA500"
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
                                                          "color": "#FFA500",
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
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    height: "60vh",
                                                    width: "100%",
                                                }}
                                            />
                                        </div>
                                        <div style={{
                                                position: 'absolute',
                                                zIndex: 5,
                                                top: '25vh',
                                                left: '50vw',
                                                color: '#ffffff',
                                                transform: 'translate(-50%, -50%)',
                                                textAlign: 'center'
                                            }}
                                        >
                                            <Typography component="h2" variant="h2" gutterBottom color="primary" style={{textShadow: '2px 4px 3px rgba(0,0,0,0.3)'}}>
                                                I am
                                            </Typography>
                                            <div 
                                                style={{
                                                    height: '150px',
                                                    width: '400px',
                                                    overflow: 'hidden',
                                                    margin: 'auto'
                                                }}
                                            >
                                                <img 
                                                    src={require('./components/icons/AshtonSpina.svg')}
                                                    style={{
                                                        height: '500px',
                                                        width: '500px',
                                                        margin: '-200px 0 -300px -50px'
                                                    }}
                                                    alt=""
                                                />
                                            </div>
                                             <Typography variant="subtitle1" gutterBottom color="primary" style={{textShadow: '2px 4px 3px rgba(0,0,0,0.3)'}}>
                                                Look what I made
                                            </Typography>
                                        </div>
                                        <div 
                                            style={{
                                                position: "absolute",
                                                top: "60vh",
                                                left: 0,
                                                right: 0,
                                                height: "40vh",
                                                background: '#ffffff'
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