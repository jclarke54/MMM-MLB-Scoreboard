Module.register("MMM-MLB-Scoreboard", {
    // Default module config.
    defaults: {
        // Define placeholder for the scraped data.
        scrapedScoreBoardData: [],
    },
  
    // Override the start method.
    start: function () {
        console.log('Starting MagicMirror module: MMM-MLB-Scoreboard');
        this.sendSocketNotification("START_ScoreBoard_SCRAPE", this.config);

        // Schedule periodic updates every 5 minutes (300,000 milliseconds).
        setInterval(() => {
            this.sendSocketNotification("UPDATE_ScoreBoard_DATA", this.config);
        }, 300000); // 5 minutes
    },
  
    // Override the getDom method to generate module content.
    getDom: function () {
        // Create a wrapper div for the module content.
        const wrapper = document.createElement("div");
                wrapper.className = "scoreBoardWrapper";
  
        // Get the scraped game data from the module's config.
        const scrapedGames = this.config.scrapedScoreBoardData;
  
        // Check if there's any scraped data.
        if (scrapedGames && scrapedGames.length > 0) {
            // Iterate over the scraped game data and create elements to display the information.
            scrapedGames.forEach(game => {
                const gameWrapper = document.createElement("div");
                                gameWrapper.className = "gameWrapper"
                gameWrapper.innerHTML = `
                    <p class ="gameData">${game.home}: ${game.homeScore}</p>
                    <p class ="gameData">${game.away}: ${game.awayScore}</p>
                                        <p class ="gameData">${game.status}</p>
                `;
                wrapper.appendChild(gameWrapper);
            });
        } else {
            // Display a message if no data is available.
            wrapper.innerHTML = "No game data available";
        }
  
        return wrapper;
    },
  
    // Override the socketNotificationReceived method to handle data from node_helper.
    socketNotificationReceived: function (notification, payload) {
        if (notification === "ScoreBoard_Data") {
            // Update the module's config with the scraped data.
            this.config.scrapedScoreBoardData = payload.scrapedGames;
  
            // Update the module's DOM with the new data.
            this.updateDom();
        }
    },
    
    // Override the stop method to clear the interval when module is stopped
    stop: function () {
        // Not implemented for now.
    },
});
