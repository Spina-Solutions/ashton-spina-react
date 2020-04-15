import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Avatar from "@material-ui/core/Avatar";

const friends = [
  {
    name: 'Shane',
    id: '76561198148150200'
  },
  {
    name: 'Jake',
    id: '76561198088011811'
  },
  {
    name: 'Matt',
    id: '76561198072808772'
  },
  {
    name: 'Alex',
    id: '76561199014752451'
  },
  {
    name: 'Darren',
    id: '76561198108301525'
  },
  {
    name: 'Dan',
    id: '76561198104361940'
  },
  {
    name: 'Taylor',
    id: '76561198038416248'
  },
  {
    name: 'Nathan',
    id: '76561198271731685'
  },
  {
    name: 'Ashton',
    id: '76561198028184744'
  },
  {
    name: 'Mike',
    id: '76561198106148866'
  }
];

const useStyles = makeStyles(theme => ({
  root: {
    padding: '24px',
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  content: {
    padding: '18px'
  },
  friendSection: {
    maxHeight: '40vh',
    overflowY: 'scroll',
    padding: '12px',
    margin: '12px'
  },
  friendCard: {
    padding: '12px',
    width: '100%',
    margin: '6px'
  },
  leftChev: {
    cursor: 'pointer',
    marginTop: '10px',
    marginRight: '12px'
  },
  rightChev: {
    cursor: 'pointer',
    marginTop: '10px',
    marginLeft: '12px'
  },
  type: {
    padding: '6px'
  },
  gameSection: {
    margin: '12px',
    padding: '12px'
  }
}));

function SteamFriendFinder(props) {
  const classes = useStyles();
  const [allFriends, setAllFriends] = React.useState(friends);
  const [includedFriends, setIncludedFriends] = React.useState([]);
  const [games, setGames] = React.useState([]);

  const handleIncludeFriend = (friend) => {
    const newlyIncludedFriends = includedFriends;
    newlyIncludedFriends.push(friend);
    const filteredAllFriends = allFriends.filter(function(el) { return el.id != friend.id; });
    setIncludedFriends(newlyIncludedFriends);
    setAllFriends(filteredAllFriends);
  };

  const handleExcludeFriend = (friend) => {
    const newAllFriends = allFriends;
    newAllFriends.push(friend);
    const filteredIncludedFriends = includedFriends.filter(function(el) { return el.id != friend.id; });
    setIncludedFriends(filteredIncludedFriends);
    setAllFriends(newAllFriends);
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={4} justify="center" alignItems="center">
        <Paper className={classes.content}>
          <Grid container justify="center">
            <Grid item xs={6} >
              <div style={{marginLeft: '48px'}}>
                <Typography variant="h5">Included Friends</Typography>
              </div>
              <Grid container className={classes.friendSection}>
                {includedFriends.map(friend =>
                  <Paper key={`included-${friend.id}`} className={classes.friendCard} elevation={4}>
                    <Grid container>
                      <Avatar
                        alt="User Profile"
                        src={friend.avatar ? friend.avatar : require('../images/steam.svg')}
                      />
                      <Typography className={classes.type} variant="h6">{friend.name}</Typography>
                      <ChevronRightIcon onClick={() => handleExcludeFriend(friend)} className={classes.rightChev}/>
                    </Grid>
                  </Paper>
                )}
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <div style={{marginLeft: '48px'}}>
                <Typography variant="h5">Friends</Typography>
              </div>
              <Grid container className={classes.friendSection}>
                {allFriends.map(friend =>
                  <Paper key={`all-${friend.id}`} className={classes.friendCard} elevation={4}>
                    <Grid container>
                      <ChevronLeftIcon onClick={() => handleIncludeFriend(friend)} className={classes.leftChev}/>
                      <Avatar
                        alt="User Profile"
                        src={friend.avatar ? friend.avatar : require('../images/steam.svg')}
                      />
                      <Typography className={classes.type} variant="h6">{friend.name}</Typography>
                    </Grid>
                  </Paper>
                )}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <div className={classes.gameSection}>
              <Typography className={classes.type} variant="h4">Games</Typography>
              <Grid container className={classes.friendSection}>
                {games.map(game =>
                  <Paper key={`${game.appid}`} className={classes.friendCard} elevation={4}>
                    <Grid container>
                      <Avatar
                        alt="User Profile"
                        src={game.avatar ? game.avatar : require('../images/steam.svg')}
                      />
                      <Typography className={classes.type} variant="h6">{game.name}</Typography>
                    </Grid>
                  </Paper>
                )}
              </Grid>
            </div>
          </Grid>
        </Paper>
      </Grid>
    </div>
  );
}

export default SteamFriendFinder;