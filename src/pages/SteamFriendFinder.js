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
import VideoGameAssetIcon from '@material-ui/icons/VideogameAsset'
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import CardMedia from "@material-ui/core/CardMedia";
import Container from "@material-ui/core/Container";
import {useWindowSize} from "./windowSize";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { cyan, orange } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: '24px'
  },
  content: {
    padding: '18px',
  },
  friendSection: {
    height: '40vh',
    overflowY: 'scroll',
    overflowX: 'hidden',
    padding: '6px'
  },
  friendCard: {
    padding: '6px',
    margin: '6px',
    cursor: 'pointer'
  },
  leftChev: {
    cursor: 'pointer',
    marginTop: '10px'
  },
  rightChev: {
    cursor: 'pointer',
    marginTop: '10px'
  },
  type: {
    padding: '6px',
  },
  gameSection: {
    padding: '6px'
  },
  noMaxWidth: {
    maxWidth: 'none',
  },
  searchRoot: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    minWidth: 360,
    width: '100%',
    minHeight: '60px'
  },
  searchInput: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  media: {
    height: 0,
    paddingTop: '38.5%', // 16:9 = 56.25, should switch to this for real image or similar
    borderTopLeftRadius: '6px',
    borderTopRightRadius: '6px'
  }
}));

const isMobile = (size) => {
  return size.width < 720;
};

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const steamTheme = createMuiTheme({
  palette: {
    primary: {
      main: cyan[700],
    },
    secondary: {
      main: orange[700],
    },
  },
});

function SteamFriendFinder(props) {
  const classes = useStyles();
  const size = useWindowSize();

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
  const [resultsFilter, setResultsFilter] = React.useState('none');
  const [friendsFilter, setFriendsFilter] = React.useState('');

  const handleIncludeFriend = async (friend) => {
    setGames([]);
    const newlyIncludedFriends = includedFriends;
    newlyIncludedFriends.push(friend);
    const filteredAllFriends = allFriends.filter(function (el) {
      return el.steamid !== friend.steamid;
    });
    setIncludedFriends(newlyIncludedFriends);
    setAllFriends(filteredAllFriends);
  };

  const handleExcludeFriend = async (friend) => {
    setGames([]);
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
      setGames(response.data.games);
      const errors = [];
      for (const friend of response.data.friends) {
        if (friend.error) {
          errors.push(`${friend.personaname} has ${friend.error}`);
          handleExcludeFriend(friend);
        }
      }

      if (errors.length) {
        setError(true);
        setErrorText(errors.join('. '));
      }
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
      setGames([]);
      setAllFriends([]);
      setIncludedFriends([]);
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
        'Couldn\'t find a user with this information. Steam doesn\'t always make steam names publicly available.  Try with one of the other methods.  If you can\'t get your profile to show up with any method, check to make sure it is public.'
      );
    }
    setLoading(false);
  };

  return (
    <div className={classes.root}>
      <ThemeProvider theme={steamTheme}>
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
        <Container maxWidth="md">
          <Paper className={classes.content}>
            <Container maxWidth="sm">
              <CardMedia
                className={classes.media}
                image={require('./gaming.jpg')}
                title="Gaming with Friends"
              />
            </Container>
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
                      <Grid
                        direction="column"
                        justify="flex-start"
                        alignItems="flex-start"
                        className={classes.friendSection}
                      >
                        {includedFriends.map((friend) => (
                          <Grid item key={`included-${friend.steamid}`}>
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
                                  <Grid item xs={3}>
                                    <Avatar
                                      alt="User Profile"
                                      src={
                                        friend.avatar
                                          ? friend.avatar
                                          : require('./steam.svg')
                                      }
                                    />
                                  </Grid>
                                  <Grid item xs={7}>
                                    <Typography
                                      className={classes.type}
                                      variant={isMobile(size) ? 'body2' : 'h6'}
                                    >
                                      {friend.personaname}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={2}>
                                    <ChevronRightIcon className={classes.rightChev} />
                                  </Grid>
                                </Grid>
                              </Paper>
                            </Tooltip>
                          </Grid>
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
                      <Grid
                        direction="column"
                        justify="flex-start"
                        alignItems="flex-start"
                        className={classes.friendSection}
                      >
                        {allFriends.map((friend) => (
                          (friendsFilter === '' || (friend.personaname !== undefined && friend.personaname.toLowerCase().includes(friendsFilter.toLowerCase())) || (friend.realname !== undefined && friend.realname.toLowerCase().includes(friendsFilter.toLowerCase())) ?
                            <Grid item xs={12} key={`${friend.steamid}`}>
                              <Tooltip
                                classes={{ tooltip: classes.noMaxWidth }}
                                title={
                                  <React.Fragment>
                                    {friend.error ?
                                        <Typography variant="body1">
                                          {friend.personaname} has {friend.error}.
                                        </Typography>
                                      : (
                                        <div>
                                          <Typography variant="body1">
                                            Real name: {friend.realname}
                                          </Typography>
                                          <Typography variant="body1">
                                            Last Online:{' '}
                                            {new Date(
                                              friend.lastlogoff * 1000
                                            ).toLocaleString()}
                                          </Typography>
                                        </div>
                                      )
                                    }
                                  </React.Fragment>
                                }
                                placement="left"
                                aria-label={`Extra information`}
                                arrow
                              >
                                <Paper
                                  className={classes.friendCard}
                                  elevation={3}
                                  onClick={() => !friend.error ? handleIncludeFriend(friend) : null}
                                  style={{ backgroundColor: friend.error ? 'grey' : 'white', cursor: friend.error ? 'auto' : 'pointer'}}
                                >
                                  <Grid container align="center" justify="center">
                                    <Grid item xs={2}>
                                      <ChevronLeftIcon className={classes.leftChev} />
                                    </Grid>
                                    <Grid item xs={3}>
                                      <Avatar
                                        alt="User Profile"
                                        src={
                                          friend.avatar
                                            ? friend.avatar
                                            : require('./steam.svg')
                                        }
                                      />
                                    </Grid>
                                    <Grid item xs={7}>
                                      <Typography
                                        className={classes.type}
                                        variant={isMobile(size) ? 'body2' : 'h6'}
                                      >
                                        {friend.personaname}
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                </Paper>
                              </Tooltip>
                            </Grid>
                          : null)
                        ))}
                      </Grid>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container justify="center" align="center">
                <Paper
                    className={classes.searchRoot}
                    elevation={0}
                    variant="outlined"
                >
                  <InputBase
                      className={classes.searchInput}
                      placeholder="Enter Steam Name of Friend to Find in your Friends List"
                      inputProps={{ 'aria-label': 'steam info' }}
                      value={friendsFilter}
                      onChange={(e) => setFriendsFilter(e.target.value)}
                  />
                  <IconButton
                      className={classes.iconButton}
                      aria-label="account"
                      onClick={() => setFriendsFilter('')}
                  >
                    <CloseIcon />
                  </IconButton>
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
                      {loading && <CircularProgress color="secondary" />}
                      {(!loading && Object.keys(games).length) ? (
                        <Grid item xs={12}>
                          <Grid container justify="center">
                            <ToggleButtonGroup
                                value={resultsFilter}
                                exclusive
                                onChange={(e, newFilter) => setResultsFilter(newFilter)}
                                aria-label="text alignment"
                            >
                              <ToggleButton value="none" aria-label="left aligned">
                                Show All Games
                              </ToggleButton>
                              <ToggleButton value="all" aria-label="centered">
                                Show Only Games Entire Group Owns
                              </ToggleButton>
                            </ToggleButtonGroup>
                          </Grid>
                        </Grid>
                      ) : null}
                      {(!loading && !Object.keys(games).length) && (
                        <Grid item xs={12}>
                          <Button
                            style={{margin: '16px'}}
                            color="primary"
                            onClick={() => handleSearchGames()}
                            variant="contained"
                            size="large"
                          >
                            <VideoGameAssetIcon style={{marginRight: '12px'}}/>
                            Find Games for this Group
                          </Button>
                        </Grid>
                      )}
                    </Grid>
                    <br />
                    <Divider />
                    <br />
                    <Grid
                      container
                      className={classes.gameSection}
                      justify="center"
                    >
                      {!loading && !Object.keys(games).length && (
                        <Grid item>
                          <Typography className={classes.type} variant="h6">
                            No Results
                          </Typography>
                        </Grid>
                      )}
                      {!loading &&
                        Object.keys(games).map((game) => (
                          (resultsFilter === 'none' || (resultsFilter === 'all' && games[game].value.people.length === includedFriends.length)) ?
                            <Grid item xs={12} style={{ cursor: 'auto'}}>
                              <Paper
                                key={`${game}`}
                                className={classes.friendCard}
                                elevation={4}
                                style={{ cursor: 'auto', width: '100%', paddingLeft: '24px', paddingRight: '12px' }}
                              >
                                <Grid container alignContent="space-between">
                                  <Grid item xs={2}>
                                    <LazyLoadComponent>
                                      <Avatar
                                        alt="Game Image"
                                        src={
                                          games[game].value.appid
                                            ? `https://steamcdn-a.akamaihd.net/steam/apps/${games[game].value.appid}/header.jpg`
                                            : require('./steam.svg')
                                        }
                                        style={{minWidth: '72px', minHeight: '72px'}}
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
                            </Grid>
                          : null
                        ))}
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            ) : null}
          </Paper>
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default SteamFriendFinder;
