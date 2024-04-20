const axios = require('axios');
const NodeHelper = require('node_helper');

// Mapping of team names to their abbreviations
const teamAbbreviations = {
    'Arizona Diamondbacks': 'ARI',
    'Atlanta Braves': 'ATL',
    'Baltimore Orioles': 'BAL',
    'Boston Red Sox': 'BOS',
    'Chicago White Sox': 'CWS',
    'Chicago Cubs': 'CHC',
    'Cincinnati Reds': 'CIN',
    'Cleveland Guardians': 'CLE',
    'Colorado Rockies': 'COL',
    'Detroit Tigers': 'DET',
    'Houston Astros': 'HOU',
    'Kansas City Royals': 'KC',
    'Los Angeles Angels': 'LAA',
    'Los Angeles Dodgers': 'LAD',
    'Miami Marlins': 'MIA',
    'Milwaukee Brewers': 'MIL',
    'Minnesota Twins': 'MIN',
    'New York Mets': 'NYM',
    'New York Yankees': 'NYY',
    'Oakland Athletics': 'OAK',
    'Philadelphia Phillies': 'PHI',
    'Pittsburgh Pirates': 'PIT',
    'San Diego Padres': 'SD',
    'San Francisco Giants': 'SF',
    'Seattle Mariners': 'SEA',
    'St. Louis Cardinals': 'STL',
    'Tampa Bay Rays': 'TB',
    'Texas Rangers': 'TEX',
    'Toronto Blue Jays': 'TOR',
    'Washington Nationals': 'WAS'
};

module.exports = NodeHelper.create({
    start: function () {
        console.log('MMM-MLB-Scoreoard helper started...');
        
        // Initial scraping when the module starts
        this.scrapeScoreBoardData();
        
        // Schedule periodic updates every 5 minutes (300,000 milliseconds).
        setInterval(() => {
            this.scrapeScoreBoardData();
        }, 300000); // 5 minutes
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "START_ScoreBoard_SCRAPE" || notification === "UPDATE_ScoreBoard_DATA") {
            console.log('Received START_ScoreBoard_SCRAPE or UPDATE_ScoreBoard_DATA notification with payload:', payload);
            this.scrapeScoreBoardData();
        }
    },

    // Function to scrape ScoreBoard data from the specified URL.
    scrapeScoreBoardData: function () {
      const scoreboardUrl = 'https://statsapi.mlb.com/api/v1/schedule/games/?sportId=1';
      
        axios.get(scoreboardUrl)
            .then((response) => {
                if (response.status === 200) {
                    console.log('Successfully fetched game data');

                    const games = response.data.dates[0].games;

                                        const gameStatus = [];
                    
                                        const scores = {
                                                home:[],
                                                away:[]
                                        };

                                        for (i=0; i<games.length; i++){
                                                if (games[i].teams.home.score === undefined){
                                                        scores.home[i] = "0";
                                                }
                                                else{
                                                        scores.home[i] = games[i].teams.home.score;
                                                }

                                                if (games[i].teams.away.score === undefined){
                                                        scores.away[i] = "0";
                                                }
                                                else{
                                                        scores.away[i] = games[i].teams.away.score;
                                                }
                                        }
                    
                                        for (i = 0; i<games.length; i++){
                                                if (games[i].status.abstractGameState === "Preview"){
                                                        gameStatus[i] = "Pregame";
                                                }
                                                else if (scores.away[i] == 0 && scores.home[i] == 0 && games[i].status.abstractGameState === "Final"){
                                                        gamesStatus[i] = "Postponed";
                                                }
                                                else{
                                                        gameStatus[i] = games[i].status.abstractGameState;
                                                }

                                        }

                    //console.log('Fetched games:', games);

                    const scrapedGames = [];

                    for (let i = 0; i < games.length; i++) {
                        const obj = {
                            home: teamAbbreviations[games[i].teams.home.team.name] || games[i].teams.home.team.name,
                            away: teamAbbreviations[games[i].teams.away.team.name] || games[i].teams.away.team.name,
                            homeScore: scores.home[i],
                            awayScore: scores.away[i],
                            status: gameStatus[i],
                        };
                        scrapedGames.push(obj);
                      }

                    console.log('Scraped games:', scrapedGames);

                    // Send the scraped data to the frontend for display.
                    this.sendSocketNotification('ScoreBoard_Data', { scrapedGames });
                } else {
                    console.error('Failed to fetch game data. Status:', response.status);
                }
            })
            .catch((error) => {
                console.error('Error scraping ScoreBoard:', error);
            });
    },
});
