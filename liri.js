
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

var question = [
	{
    type: "list",
    message: "Which item would you like to work with?",
    choices: ["my-tweets about the BWCA", "spotify-this-song", "movie-this", "do-what-it-says"],
    name: "command"
	}
];

inquirer.prompt(question).then(function(user) {
	var selection = user.command;

	switch (selection) {
		case "my-tweets about the BWCA":
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

	function myTweets() {
		client.get("search/tweets", {q: "BWCA", count: 6}, function(error, data, response) {
  			var tweets = data.statuses;
  			for (var i = 0; i < tweets.length; i++) {
  				console.log((i+1) + ". " + tweets[i].text);
  			}
		});
	};

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
  				songName = "The Sign";
  			}
  			spotify.search({ type:"track", query:songName }, function(err, data) {
				var songInfo = data.tracks.items[0];
				console.log(songInfo.artists[0].name);
				console.log(songInfo.name);
				console.log(songInfo.preview_url);
				console.log(songInfo.album.name);
			});
		});
	};

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

	function doWhatItSays() {
		fs.readFile("random.txt", "utf8", function(error, data) {
			var separateIt = data.split(",").pop();
  			spotify.search({ type:"track", query:separateIt }, function(err, data) {
				var songInfo = data.tracks.items[0];
				console.log(songInfo.artists[0].name);
				console.log(songInfo.name);
				console.log(songInfo.preview_url);
				console.log(songInfo.album.name);
			});
		});
	};
});




