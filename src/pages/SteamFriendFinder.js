import React from 'react';
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

const friends = [
  {
    name: 'Jake',
    id: '76561198088011811',
  },
  {
    name: 'Matt',
    id: '76561198072808772',
  },
  {
    name: 'Alex',
    id: '76561199014752451',
  },
  {
    name: 'Darren',
    id: '76561198108301525',
  },
  {
    name: 'Dan',
    id: '76561198104361940',
  },
  {
    name: 'Taylor',
    id: '76561198038416248',
  },
  {
    name: 'Nathan',
    id: '76561198271731685',
  },
  {
    name: 'Ashton',
    id: '76561198028184744',
  },
  {
    name: 'Mike',
    id: '76561198106148866',
  },
];

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
  const [allFriends, setAllFriends] = React.useState(friends);
  const [includedFriends, setIncludedFriends] = React.useState([]);
  const [games, setGames] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);

  const handleIncludeFriend = async (friend) => {
    const newlyIncludedFriends = includedFriends;
    newlyIncludedFriends.push(friend);
    const filteredAllFriends = allFriends.filter(function (el) {
      return el.id !== friend.id;
    });
    setIncludedFriends(newlyIncludedFriends);
    setAllFriends(filteredAllFriends);
  };

  const handleExcludeFriend = async (friend) => {
    const newAllFriends = allFriends;
    newAllFriends.push(friend);
    const filteredIncludedFriends = includedFriends.filter(function (el) {
      return el.id !== friend.id;
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

  return (
    <div className={classes.root}>
      <Snackbar
        open={error}
        autoHideDuration={6000}
        onClose={() => setError(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(false)} severity="error">
          Steam Web API has limited calls. Try again in a bit when the limit has
          reset.
        </Alert>
      </Snackbar>
      <Grid container spacing={4} justify="center" alignItems="center">
        <Paper className={classes.content}>
          <Grid container justify="center">
            <Grid item xs={6}>
              <div style={{ marginLeft: '48px' }}>
                <Typography variant="h5">Included Friends</Typography>
              </div>
              <Grid container className={classes.friendSection}>
                {includedFriends.map((friend) => (
                  <Paper
                    key={`included-${friend.id}`}
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
                        {friend.name}
                      </Typography>
                      <ChevronRightIcon className={classes.rightChev} />
                    </Grid>
                  </Paper>
                ))}
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <div style={{ marginLeft: '48px' }}>
                <Typography variant="h5">Friends</Typography>
              </div>
              <Grid container className={classes.friendSection}>
                {allFriends.map((friend) => (
                  <Paper
                    key={`all-${friend.id}`}
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
                        {friend.name}
                      </Typography>
                    </Grid>
                  </Paper>
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
                  <Grid xs={12}>
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
                  <Grid xs={12}>
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
                        <Grid xs={2}>
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
                        <Grid xs={5}>
                          <Typography className={classes.type} variant="h6">
                            {games[game].key}
                          </Typography>
                        </Grid>
                        <Grid xs={5}>
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
