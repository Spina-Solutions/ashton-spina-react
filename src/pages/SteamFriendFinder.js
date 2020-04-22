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
import Divider from '@material-ui/core/Divider';
import Tooltip from '@material-ui/core/Tooltip';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SearchIcon from '@material-ui/icons/Search';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';

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
    height: '40vh',
    overflowY: 'scroll',
    padding: '12px',
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
  noMaxWidth: {
    maxWidth: 'none',
  },
  searchRoot: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    minWidth: 360,
    width: '50vw',
  },
  searchInput: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
}));

const isMobile = () => {
  return window.innerWidth < 600;
};

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
  const [errorText, setErrorText] = React.useState(null);
  const [textFieldValue, setTextFieldValue] = React.useState(
    localStorage.getItem('user') === undefined
      ? ''
      : localStorage.getItem('user')
  );

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
      const response = await axios.post(
        `https://55dov46vm5.execute-api.eu-central-1.amazonaws.com/prod/ashtonsSpinaGetSteamGames`,
        { friends: includedFriends }
      );
      if (response.data.length === 0) {
        setError(true);
        setErrorText('No selected friend had a public steam profile');
      }
      setGames(response.data);
    } catch (error) {
      setError(true);
      setErrorText(
        `Something went wrong.  Maybe one of the selected friends doesn't have a public profile? Otherwise the steam API is probably overloaded, in which case wait a bit and try again.`
      );
    }
    setLoading(false);
  };

  const handleSearchFriends = async () => {
    try {
      setLoading(true);
      let personaName, steamId;
      const urlParts = textFieldValue.split('/');
      if (urlParts.length === 1) {
        if (isNaN(textFieldValue)) {
          personaName = textFieldValue;
        } else if (textFieldValue.length === 17) {
          steamId = textFieldValue;
        }
      } else if (urlParts[3] !== undefined) {
        if (urlParts[3] === 'id') {
          personaName = urlParts[4];
        } else if (urlParts[3] === 'profiles') {
          steamId = urlParts[4];
        }
      }
      if (personaName || steamId) {
        const response = await axios.post(
          'https://h181cyn1lb.execute-api.eu-central-1.amazonaws.com/default/ashtonSpinaPostUserFriends',
          { personaName, steamId }
        );
        localStorage.setItem('user', textFieldValue);
        setAllFriends(response.data.friends);
      } else {
        setError(true);
        setErrorText('This input is invalid');
      }
    } catch (error) {
      setError(true);
      setErrorText(
        'Something is wrong with this user info.  Otherwise the steam API is overloaded and you can try again shortly.'
      );
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
          {errorText}
        </Alert>
      </Snackbar>
      <Grid container spacing={4} justify="center" alignItems="center">
        <Paper className={classes.content}>
          <Grid container justify="center" align="center">
            <Grid item xs={12}>
              <Grid container justify="center" align="center">
                <Paper
                  className={classes.searchRoot}
                  elevation={0}
                  variant="outlined"
                >
                  <Tooltip
                    classes={{ tooltip: classes.noMaxWidth }}
                    title={
                      <React.Fragment>
                        <Typography variant="h6">Examples:</Typography>
                        <Divider style={{ backgroundColor: 'white' }} />
                        <Typography variant="body1">thiccjoe</Typography>
                        <Typography variant="body1">
                          https://steamcommunity.com/id/thiccjoe
                        </Typography>
                        <Typography variant="body1">
                          76561198091548059
                        </Typography>
                        <Typography variant="body1">
                          https://steamcommunity.com/profiles/76561198091548059
                        </Typography>
                      </React.Fragment>
                    }
                    placement="bottom"
                    aria-label={`Hints`}
                    arrow
                  >
                    <IconButton
                      className={classes.iconButton}
                      aria-label="account"
                    >
                      <AccountCircleIcon />
                    </IconButton>
                  </Tooltip>
                  <InputBase
                    className={classes.searchInput}
                    placeholder="Steam Name, ID, or Profile URL"
                    inputProps={{ 'aria-label': 'steam info' }}
                    value={textFieldValue}
                    onChange={(e) => setTextFieldValue(e.target.value)}
                  />
                  {loading && <CircularProgress color="secondary" />}
                  {!loading && (
                    <Tooltip
                      classes={{ tooltip: classes.noMaxWidth }}
                      title={
                        <React.Fragment>
                          <Typography variant="body1">Find Friends</Typography>
                        </React.Fragment>
                      }
                      placement="bottom"
                      aria-label={`Hints`}
                      arrow
                    >
                      <IconButton
                        className={classes.iconButton}
                        aria-label="search"
                        onClick={() => handleSearchFriends()}
                      >
                        <SearchIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </Paper>
              </Grid>
              <br />
              <Divider />
              <br />
            </Grid>
            <Grid item xs={12}>
              <Paper elevation={0} variant="outlined">
                <Grid container justify="center" align="center">
                  <Grid item xs={6}>
                    <div>
                      <br />
                      <Typography variant="h5">Playing With</Typography>
                      <br />
                      <Divider />
                      <br />
                    </div>
                    <Grid container className={classes.friendSection}>
                      {includedFriends.map((friend) => (
                        <Tooltip
                          classes={{ tooltip: classes.noMaxWidth }}
                          key={`included-${friend.steamid}`}
                          title={
                            <React.Fragment>
                              <Typography variant="body1">
                                Real name: {friend.realname}
                              </Typography>
                              <Typography variant="body1">
                                Last Online:{' '}
                                {new Date(
                                  friend.lastlogoff * 1000
                                ).toLocaleString()}
                              </Typography>
                            </React.Fragment>
                          }
                          placement="right"
                          aria-label={`Extra information`}
                          arrow
                        >
                          <Paper
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
                              <Typography
                                className={classes.type}
                                variant={isMobile() ? 'body2' : 'h6'}
                              >
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
                    <div>
                      <br />
                      <Typography variant="h5">Friends</Typography>
                      <br />
                      <Divider />
                      <br />
                    </div>
                    <Grid container className={classes.friendSection}>
                      {allFriends.map((friend) => (
                        <Tooltip
                          classes={{ tooltip: classes.noMaxWidth }}
                          key={`all-${friend.steamid}`}
                          title={
                            <React.Fragment>
                              <Typography variant="body1">
                                Real name: {friend.realname}
                              </Typography>
                              <Typography variant="body1">
                                Last Online:{' '}
                                {new Date(
                                  friend.lastlogoff * 1000
                                ).toLocaleString()}
                              </Typography>
                            </React.Fragment>
                          }
                          placement="left"
                          aria-label={`Extra information`}
                          arrow
                        >
                          <Paper
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
                              <Typography
                                className={classes.type}
                                variant={isMobile() ? 'body2' : 'h6'}
                              >
                                {friend.personaname}
                              </Typography>
                            </Grid>
                          </Paper>
                        </Tooltip>
                      ))}
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
          {allFriends.length || includedFriends.length ? (
            <Grid item xs={12}>
              <Paper elevation={0} variant="outlined">
                <Grid className={classes.gameSection}>
                  <Grid
                    container
                    className={classes.gameSection}
                    justify="center"
                    align="center"
                  >
                    <Grid item>
                      {loading && <CircularProgress color="secondary" />}
                      {!loading && (
                        <Grid item xs={12}>
                          <Button
                            color="secondary"
                            onClick={() => handleSearchGames()}
                          >
                            Find Games for this Group
                          </Button>
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                  <br />
                  <Divider />
                  <br />
                  <Grid
                    container
                    className={classes.gameSection}
                    justify="center"
                    align="center"
                  >
                    {!loading && !Object.keys(games).length && (
                      <Grid item xs={12}>
                        <Typography className={classes.type} variant="h6">
                          No Results
                        </Typography>
                      </Grid>
                    )}
                    {!loading &&
                      Object.keys(games).map((game) => (
                        <Paper
                          key={`${game}`}
                          className={classes.friendCard}
                          style={{ cursor: 'auto' }}
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
                            <Grid item xs={3}>
                              <Typography className={classes.type} variant="h6">
                                {games[game].key}
                              </Typography>
                            </Grid>
                            <Grid item xs={7}>
                              <TableContainer>
                                <Table
                                  className={classes.table}
                                  size="small"
                                  aria-label="a dense table"
                                >
                                  <TableBody>
                                    {games[game].value.people.map((person) => (
                                      <TableRow
                                        key={games[game].key + '-' + person}
                                      >
                                        <TableCell align="right">
                                          {person}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </Grid>
                          </Grid>
                        </Paper>
                      ))}
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          ) : null}
        </Paper>
      </Grid>
    </div>
  );
}

export default SteamFriendFinder;
