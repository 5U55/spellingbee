const axios = require("axios");
const cheerio = require("cheerio");

var siteUrl = "https://www.nytimes.com/puzzles/spelling-bee";

const fetchData = async () => {
  const result = await axios.get(siteUrl);
  //console.log(result.data);
  return cheerio.load(result.data);
};

const getResults = async () => {
  var $ = await fetchData();
  var gameScript = $("script:not([src]):contains('window.gameData')")[0].children[0].data;
  console.log(gameScript);
  gameScript = gameScript.replace("window.gameData =", "");

  var nytGameData = JSON.parse(gameScript);

  var gameData = {
    allAnswers: [],
    letters: [],
    centerLetter: "",
    maxScore: 0,
    date:""
  };
  gameData.allAnswers = nytGameData.today.answers;
  gameData.centerLetter = nytGameData.today.centerLetter;
  gameData.letters = nytGameData.today.outerLetters;
  gameData.date= nytGameData.today.printDate;

  return gameData;
};

module.exports.getResults = getResults;