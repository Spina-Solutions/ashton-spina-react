import React, { Component } from 'react';
import PersistentDrawerLeft from './components/ToolbarDrawer';
import ContentPage from './components/ContentPage';
import NoMatch from './components/NoMatch';
import BlogLayout from './components/BlogLayout';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import { BrowserRouter, Route } from 'react-router-dom';
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
        hook: 'The project I did for my Bachelor Thesis which focused on providing a universal solution to monitoring Virtual Machines and visualizing and analyzing their cost and specifically waste.',
        iconUrl: '/icons/clouds.svg',
        paperBackground: '#00796b',
        url: '/content/universalcloudmonitoring',
        imageUrl: require('./images/thumbs/universalCloudMonitoring_tn.jpg'),
    }, 
    { 
        title: 'Tulip Assist',
        hook: 'The insurance company for which I worked and the details of my efforts to automate and improve the company.',
        iconUrl: '/icons/tulips.svg',
        paperBackground: '#2e7d32',
        url: '/content/tulipassist',
        imageUrl: require('./images/thumbs/tulipAssist_tn.jpg'),
    },
    { 
        title: 'Device Database',
        hook: 'A SaaS source of truth data base for more accurate API communication in a microservice system architecture.',
        iconUrl: '/icons/smartphone.svg',
        paperBackground: '#bf360c',
        url: '/content/devicedatabase', 
        imageUrl: require('./images/thumbs/deviceDB_tn.jpg'),
    },
    { 
        title: 'Ashton Spina Website',
        hook: 'My personal showcase website and blog.',
        iconUrl: '/icons/freelance.svg',
        paperBackground: '#00838f',
        url: '/content/ashtonspina', 
        imageUrl: '/logo.svg',
    },
    { 
        title: 'Wander',
        hook: 'An android application which allows the psychology department at the University of Groningen and other universities to run a specific test on study participants in a variety of conditions from their smartphones.',
        iconUrl: '/icons/brain.svg',
        paperBackground: '#d81b60',
        url: '/content/wander', 
        imageUrl: require('./images/thumbs/wander_tn.jpg'),
    },
    { 
        title: 'University Work',
        hook: 'Available on request, a collection of my code that I wrote for university projects.',
        iconUrl: '/icons/student.svg',
        paperBackground: '#b71c1c',
        url: '/content/university', 
        imageUrl: require('./images/thumbs/school_work_tn.jpg'),
    },
    {
        title: 'Travel-Atlas',
        hook: 'A website dedicated to matching users with a destination that suits their needs.',
        iconUrl: '/icons/suitcase.svg',
        paperBackground: '#4a148c',
        url: '/content/travel-atlas',
        imageUrl: require('./images/thumbs/travel-atlas_tn.jpg'),
    },
];

const blogPosts = [
    {
        title: 'Who Am I?',
        hook: 'Who is the mysterious man who made this site and how can you find him?',
        url: '/content/aboutme',
        iconUrl: '/icons/man.svg',
        paperBackground: '#b71c1c',
        imageUrl: require('./images/thumbs/gta_space_usage_tn.jpg')
    },
    {
        title: 'What I\'ve Done',
        hook: 'I\'ve worked on some interesting stuff in my relatively short time as a Software Engineer.  Read about stuff I\'ve made and maybe even stuff I\'m planning to make!',
        url: '/projects',
        iconUrl: '/icons/cash-flow.svg',
        paperBackground: '#4a148c',
        imageUrl: require('./images/thumbs/gta_space_usage_tn.jpg')
    },
    { 
        title: 'Ontario\'s City Problem',
        hook: 'Ontario has a problem with how it handles urbanization and cities. Read my opinion on what that problem is and how to change it.',
        url: '/content/ontario-city-problem',
        iconUrl: '/icons/cityscape.svg',
        paperBackground: '#0277bd',
        imageUrl: require('./images/thumbs/gta_space_usage_tn.jpg'),
        category: 'Blog',
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
                                    <BlogLayout style={{ background: '#ffddda' }} items={ blogPosts }/>
                                )}/>
                                <Route exact path='/projects' render={(props) => (
                                    <BlogLayout items={ projects.sort(() => Math.random() - 0.5) }/>
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