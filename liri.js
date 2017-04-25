
// var's of npm's that I will be using below
var inquirer = require('inquirer');
var request = require("request");
var spotify = require("spotify");
var Twitter = require("twitter");
var twitter = require("./keys.js");
var client = new Twitter({
	consumer_key: twitter.twitterKeys.consumer_key,
	consumer_secret: twitter.twitterKeys.consumer_secret,
	access_token_key: twitter.twitterKeys.access_token_key,
	access_token_secret: twitter.twitterKeys.access_token_secret
});
var fs = require("fs");

// Original question to user.  What do you want?
var question = [
	{
    type: "list",
    message: "Which item would you like to work with?",
    choices: ["tweets about NASA", "spotify-this-song", "movie-this", "do-what-it-says"],
    name: "command"
	}
];

// Grabs the user selection and directs to appropriate function
inquirer.prompt(question).then(function(user) {
	var selection = user.command;

	switch (selection) {
		case "tweets about NASA":
			myTweets();
			break;
		case "spotify-this-song":
			spotifyThisSong();
			break;
		case "movie-this":
			movieThis();
			break;
		case "do-what-it-says":
			doWhatItSays();
			break;
		default:
			console.log("Error");
	};

	// Get six tweets from NASA and display them with numbers
	function myTweets() {
		client.get("search/tweets", {q: "NASA", count: 6}, function(error, data, response) {
  			var tweets = data.statuses;
  			for (var i = 0; i < tweets.length; i++) {
  				console.log((i+1) + ". " + tweets[i].text);
  			}
		});
	};

	// Get information from Spotify for song that user entered and send to Spotify function
	// If user does not enter a song (blank) call function to get "Ace of Base, The Sign"
	function spotifyThisSong() {
		inquirer.prompt([
  		{
    	type: "input",
    	message: "Which song do you want to check?",
    	name: "song"
  		}
  		]).then(function(user) {
  			songName = user.song;
  			if (user.song === "") {
  				findTheSign();
  			}
  			else {
  				spotifyThis(songName);
  			}
		});
	};

	// Get information for movie that user entered and display
	function movieThis() {
		inquirer.prompt([
  		{
    	type: "input",
    	message: "Which movie do you want to check?",
    	name: "movie"
  		}
  		]).then(function(user) {
  			movieName = user.movie;
  			if (user.movie === "") {
  				movieName = "Mr. Nobody";
  			}
			var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&r=json";
  			request(queryUrl, function(error, response, body) {
				if (!error && response.statusCode === 200) {
					console.log("Title of the movie: " + JSON.parse(body).Title);
					console.log("Year the movie came out: " + JSON.parse(body).Year);
					console.log("IMBD Rating of the movie: " + JSON.parse(body).imbdRating);
					console.log("Country were the movie was produced: " + JSON.parse(body).Country);				
					console.log("Language of the movie: " + JSON.parse(body).Language);
					console.log("Plot of the movie: " + JSON.parse(body).Plot);
					console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
					console.log("Rotten Tomatoes URL: " + JSON.parse(body).Website);
				}
			});
		});
	};

// Function that gets song in random.txt and send to Spotify
	function doWhatItSays() {
		fs.readFile("random.txt", "utf8", function(error, data) {
			var separateIt = data.split(",").pop();
 			spotifyThis(separateIt);
		});
	};

// Function that displays info from Spotify for song passed to function
	function spotifyThis(checkThis) {
 		spotify.search({ type:"track", query:checkThis }, function(err, data) {
			var songInfo = data.tracks.items[0];
			console.log(songInfo.artists[0].name);
			console.log(songInfo.name);
			console.log(songInfo.preview_url);
			console.log(songInfo.album.name);
		});
	};

// Function to find "Ace of Base, The Sign" and list origianl release album
	function findTheSign() {
 		spotify.search({ type:"track", query:"The Sign" }, function(err, data) {
 			var firstStep = data.tracks;
 			var secondStep = data.tracks.items;
   			for (var i = 0; i < secondStep.length; i++) {
 	  			if (firstStep.items[i].artists[0].name === "Ace of Base") {
	  				if (firstStep.items[i].album.name != "Greatest Hits") {
	  					console.log(firstStep.items[i].artists[0].name);
						console.log(firstStep.items[i].name);
						console.log(firstStep.items[i].preview_url);
						console.log(firstStep.items[i].album.name);
					}
	  			}
  			}
  		});			
	};
});




