import React, { Component } from 'react';
import PersistentDrawerLeft from './components/ToolbarDrawer';
import GridLayout from './components/GridLayout';
import ContentPage from './components/ContentPage';
import NoMatch from './components/NoMatch';
import Grid from '@material-ui/core/Grid';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import amber from '@material-ui/core/colors/amber';
import green from '@material-ui/core/colors/green';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Parallax } from 'react-parallax';

const theme = createMuiTheme({
    palette: {
        primary: blue,
        secondary: amber,
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
        imageUrl: require('./deviceDatabase.png'),
        githubLink: '',
        href: ''
    },
    { 
        title: 'Reprice', 
        text: "I was drafted into this project based on my strong performance in previous projects.  Here I mostly handled front-end development and reviewing backend work.", 
        url: '/content/reprice', 
        imageUrl: require('./rePrice.png'),
        githubLink: '',
        href: ''
    },
    { 
        title: 'Ashton Spina Website', 
        text: "This project is a personal project, and likely the website where you're readying this text.", 
        url: '/content/project_one', 
        imageUrl: require('./ashtonspina.png'),
        githubLink: '',
        href: ''
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
        imageUrl: require('./rug.jpg'),
        githubLink: 'https://github.com/a-d-spina-student/Ashton-s-School-Assignment-Collection',
        href: ''
    }, 
];

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <div className="App">
                    <MuiThemeProvider theme={theme}>
                    <header>
                        <PersistentDrawerLeft>
                            <Switch>
                                <Route exact path='/' render={(props) => (
                                    <div>
                                        <Parallax
                                            bgImage={'http://hdwpro.com/wp-content/uploads/2017/03/Art-Background-Image.png'}
                                            strength={400}
                                        >
                                            <div style={{margin: '20px', minHeight: '100vh'}}>
                                                <Grid item xs={12}>
                                                    <GridLayout items={myItems}/>
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
                        </PersistentDrawerLeft>
                    </header>
                    </MuiThemeProvider>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;