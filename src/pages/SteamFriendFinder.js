import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Avatar from '@material-ui/core/Avatar';
import axios from 'axios';
import { LazyLoadComponent } from 'react-lazy-load-image-component';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import {useFetch} from "../util/effects";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import Tooltip from "@material-ui/core/Tooltip";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '24px',
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  content: {
    padding: '18px',
  },
  friendSection: {
    maxHeight: '40vh',
    overflowY: 'scroll',
    padding: '12px',
    margin: '12px',
  },
  friendCard: {
    padding: '12px',
    width: '100%',
    margin: '6px',
    cursor: 'pointer',
  },
  leftChev: {
    cursor: 'pointer',
    marginTop: '10px',
    marginRight: '12px',
  },
  rightChev: {
    cursor: 'pointer',
    marginTop: '10px',
    marginLeft: '12px',
  },
  type: {
    padding: '6px',
  },
  gameSection: {
    margin: '12px',
    padding: '12px',
  },
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function SteamFriendFinder(props) {
  const classes = useStyles();

  const [allFriends, setAllFriends] = React.useState([]);
  const [includedFriends, setIncludedFriends] = React.useState([]);
  const [games, setGames] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [textFieldValue, setTextFieldValue] = React.useState(localStorage.getItem('user') === undefined ? '' : localStorage.getItem('user'));

  const handleIncludeFriend = async (friend) => {
    const newlyIncludedFriends = includedFriends;
    newlyIncludedFriends.push(friend);
    const filteredAllFriends = allFriends.filter(function (el) {
      return el.steamid !== friend.steamid;
    });
    setIncludedFriends(newlyIncludedFriends);
    setAllFriends(filteredAllFriends);
  };

  const handleExcludeFriend = async (friend) => {
    const newAllFriends = allFriends;
    newAllFriends.push(friend);
    const filteredIncludedFriends = includedFriends.filter(function (el) {
      return el.steamid !== friend.steamid;
    });
    setIncludedFriends(filteredIncludedFriends);
    setAllFriends(newAllFriends);
  };

  const handleSearchGames = async () => {
    try {
      setLoading(true);
      console.log({ friends: includedFriends });
      const response = await axios.post(
        `https://55dov46vm5.execute-api.eu-central-1.amazonaws.com/prod/ashtonsSpinaGetSteamGames`,
        { friends: includedFriends }
      );
      setGames(response.data);
    } catch (error) {
      setError(true);
    }
    setLoading(false);
  };

  const handleSearchFriends = async () => {
    try {
      setLoading(true);
      let profileUrl, idUrl;
      // if (textFieldValue.split('/'))



      const response = await axios.post('https://h181cyn1lb.execute-api.eu-central-1.amazonaws.com/default/ashtonSpinaPostUserFriends', {userPersonaName: textFieldValue});
      localStorage.setItem('user', textFieldValue);
      setAllFriends(response.data.friends);
    } catch (error) {
      setError(true);
    }
    setLoading(false);
  };

  return (
    <div className={classes.root}>
      <Snackbar
        open={error}
        autoHideDuration={6000}
        onClose={() => setError(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(false)} severity="error">
          Something went wrong.  Maybe you typed something invalid?
          <br/>
          Otherwise, the problem is that the Steam Web API has limited capacity.
          <br/>
          Try again in a bit when the limit has reset.
        </Alert>
      </Snackbar>
      <Grid container spacing={4} justify="center" alignItems="center">
        <Paper className={classes.content}>
          <Grid container justify="center" align="center">
            <Grid item xs={12}>
              <Grid container justify="center" align="center">
                <Grid item xs={6} md={4}>
                  <TextField label="Enter your Steam Name" variant="outlined" value={textFieldValue} onChange={e => setTextFieldValue(e.target.value)}/>
                </Grid>
                <Grid item xs={6} md={4}>
                  <Button
                      color="secondary"
                      variant="contained"
                      disableElevation
                      onClick={() => handleSearchFriends()}
                  >
                    Search for Friends
                  </Button>
                </Grid>
              </Grid>
              <br/>
              <Divider/>
              <br/>
            </Grid>
            <Grid item xs={6}>
              <div style={{ marginLeft: '48px' }}>
                <Typography variant="h5">Included Friends</Typography>
              </div>
              <Grid container className={classes.friendSection}>
                {includedFriends.map((friend) => (
                  <Tooltip
                      title={
                        <React.Fragment>
                          <Typography variant="body1">
                            Real name: {friend.realname}
                          </Typography>
                          <Typography variant="body1">
                            Last Online: {(new Date(friend.lastlogoff)).toString()}
                          </Typography>
                        </React.Fragment>
                      }
                      placement="right"
                      aria-label={`Extra information`}
                      arrow
                  >
                    <Paper
                      key={`included-${friend.steamid}`}
                      className={classes.friendCard}
                      elevation={4}
                      onClick={() => handleExcludeFriend(friend)}
                    >
                      <Grid container>
                        <Avatar
                          alt="User Profile"
                          src={
                            friend.avatar
                              ? friend.avatar
                              : require('../images/steam.svg')
                          }
                        />
                        <Typography className={classes.type} variant="h6">
                          {friend.personaname}
                        </Typography>
                        <ChevronRightIcon className={classes.rightChev} />
                      </Grid>
                    </Paper>
                </Tooltip>
                ))}
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <div style={{ marginLeft: '48px' }}>
                <Typography variant="h5">Friends</Typography>
              </div>
              <Grid container className={classes.friendSection}>
                {allFriends.map((friend) => (
                  <Tooltip
                      title={
                        <React.Fragment>
                          <Typography variant="body1">
                            Real name: {friend.realname}
                          </Typography>
                          <Typography variant="body1">
                            Last Online: {(new Date(friend.lastlogoff)).toString()}
                          </Typography>
                        </React.Fragment>
                      }
                      placement="left"
                      aria-label={`Extra information`}
                      arrow
                  >
                    <Paper
                      key={`all-${friend.steamid}`}
                      className={classes.friendCard}
                      elevation={4}
                      onClick={() => handleIncludeFriend(friend)}
                    >
                      <Grid container>
                        <ChevronLeftIcon className={classes.leftChev} />
                        <Avatar
                          alt="User Profile"
                          src={
                            friend.avatar
                              ? friend.avatar
                              : require('../images/steam.svg')
                          }
                        />
                        <Typography className={classes.type} variant="h6">
                          {friend.personaname}
                        </Typography>
                      </Grid>
                    </Paper>
                  </Tooltip>
                ))}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <div className={classes.gameSection}>
              <Typography className={classes.type} variant="h4">
                Games
              </Typography>
              <Grid
                container
                className={classes.gameSection}
                justify="center"
                align="center"
              >
                {loading && <CircularProgress color="secondary" />}
                {!loading && (
                  <Grid item xs={12}>
                    <Button
                      color="secondary"
                      variant="contained"
                      disableElevation
                      onClick={() => handleSearchGames()}
                    >
                      Search for Joint Games
                    </Button>
                  </Grid>
                )}
                {!loading && !Object.keys(games).length && (
                  <Grid item xs={12}>
                    <Typography className={classes.type} variant="h6">
                      No friends selected
                    </Typography>
                  </Grid>
                )}
                {!loading &&
                  Object.keys(games).map((game) => (
                    <Paper
                      key={`${game}`}
                      className={classes.friendCard}
                      elevation={4}
                    >
                      <Grid container>
                        <Grid item xs={2}>
                          <LazyLoadComponent>
                            <Avatar
                              alt="User Profile"
                              src={
                                games[game].value.appid
                                  ? `https://steamcdn-a.akamaihd.net/steam/apps/${games[game].value.appid}/header.jpg`
                                  : require('../images/steam.svg')
                              }
                            />
                          </LazyLoadComponent>
                        </Grid>
                        <Grid item xs={5}>
                          <Typography className={classes.type} variant="h6">
                            {games[game].key}
                          </Typography>
                        </Grid>
                        <Grid item xs={5}>
                          {games[game].value.people.map((person) => (
                            <Typography
                              className={classes.type}
                              variant="body2"
                            >
                              {person}
                            </Typography>
                          ))}
                        </Grid>
                      </Grid>
                    </Paper>
                  ))}
              </Grid>
            </div>
          </Grid>
        </Paper>
      </Grid>
    </div>
  );
}

export default SteamFriendFinder;
