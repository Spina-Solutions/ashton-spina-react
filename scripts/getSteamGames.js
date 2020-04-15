const axios = require('axios');
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

const apiKey = 'BFB0F2C4313E130850ED591FC31B04CB';


const fetchUserData = async friends => {
  // GET steam ID for vanity url
  // https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=BFB0F2C4313E130850ED591FC31B04CB&vanityurl=${friend.username}&format=json
  // GET friends list for seteam id
  // http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=BFB0F2C4313E130850ED591FC31B04CB&steamid=${friend.id}&relationship=friend
  // GET user info including avatar
  // http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=BFB0F2C4313E130850ED591FC31B04CB&steamids=${friend.id}
  await Promise.all(
    friends.map(async friend => {
      const url = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=BFB0F2C4313E130850ED591FC31B04CB&steamid=${friend.id}&format=json`;
      console.log('fetching', url);
      const response = await axios.get(url);
      friend['games'] = response.data.response.games;
    })
  );
  return friends;
};

/**
 * This function converts a csv file into usable JSON-formatted data
 *
 * @returns {Object}
 * @public
 */
const fetchSteamGames = async () => {
  return new Promise(async (resolve, reject) => {
    const results = await fetchUserData(friends);
    return resolve(results);
  });
};

/**
 * This function converts a csv file into usable JSON-formatted data
 *
 * @returns {Object}
 * @public
 */
const bucketMatches = (friends, gamesIndex) => {
  const games = {};
  for (const friend of friends) {
    for (const game of friend.games) {
      if (games[gamesIndex[game.appid].name] === undefined) {
        games[gamesIndex[game.appid].name] = [];
      }
      console.log('game', gamesIndex[game.appid]);
      games[gamesIndex[game.appid].name].push(friend.name);
    }
  }
  return games;
};

const indexByAppId = (rawGames) => {
  const indexedGames = {};
  for (const app of rawGames) {
    indexedGames[app.appid] = app;
  }
  return indexedGames;
};

const main = async () => {
  const rawGames = await axios.get('https://api.steampowered.com/ISteamApps/GetAppList/v2');
  console.log('Found ', rawGames.data.applist.apps.length, ' games');
  const response = await fetchSteamGames();
  const gamesIndex = indexByAppId(rawGames.data.applist.apps);
  let sorted = bucketMatches(response, gamesIndex);

  sorted = Object.keys(sorted)
  .map(function(k) { return { key: k, value: sorted[k] }; })
  .sort(function(a, b) { return b.value.length - a.value.length; });

  for (const game of sorted) {
    console.log(game.key, ' owned by: ', game.value);
  }
};

main();
