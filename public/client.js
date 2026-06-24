var nyt = true;

var myData = {
  currentScore: 0,
  currentAnswers: [],
  gaveUp: false,
  rank: ""
};

var yaysound = new Audio(
  "https://cdn.glitch.com/9269e55a-fa29-4b11-9ea9-4bc941fc78f2%2FYou%20win%20sound%20effect%20%234.mp3?v=1582762918088"
);
var sound = localStorage.getItem("sounds");

var classic = localStorage.getItem("classic");
var sort = localStorage.getItem("sort");

var gameData = {
  allAnswers: [],
  letters: ["1", "2", "3", "4", "5", "6"],
  centerLetter: "",
  maxScore: 0,
  date: ""
};

function formatDate(theDate) {
  return (
    theDate
      .getFullYear()
      .toString()
      .padStart(4, "0") +
    "-" +
    (theDate.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    theDate
      .getDate()
      .toString()
      .padStart(2, "0")
  );
}

var formatted_date = formatDate(new Date());

var intoCR;

function calcScoreTotal(game) {
  game.maxScore = 0;
  for (var i = 0; i < game.allAnswers.length; i++) {
    game.maxScore += scoring(game.allAnswers[i]);
  }
  putInLocalStorage();
}

function reload(gameDataDate) {
  var loadedGameData = localStorage.getItem("gameData" + gameDataDate);
  if (loadedGameData != null && loadedGameData != undefined) {
    gameData = JSON.parse(loadedGameData);
    if (gameData.date == null) {
      gameData.date = gameDataDate;
    }
    var answers = localStorage.getItem("myData" + gameDataDate);
    if (answers == null || answers == undefined) {
      myData = {
        currentScore: 0,
        currentAnswers: [],
        gaveUp: false,
        rank: ""
      };
    } else {
      myData = JSON.parse(answers);
      myData.gaveUp = answers.gaveUp;
        }
    putInLocalStorage();
    document.getElementById("currentScore").innerHTML = "0";
    document.getElementById("wordList").innerHTML = "";
    myData.currentScore = 0;
    //myData.currentAnswers = [];
    //  myData.gaveUp = answers.gaveUp;
    for (i = 0; i < myData.currentAnswers.length; i++) {
      addAnswer(myData.currentAnswers[i], false);
    }
    if (myData.gaveUp) {
      quit("none");
    } else {
      quit("block");
    }
    document.getElementById("todaysDate").innerHTML = gameData.date;
    calcScoreTotal(gameData);
    yourRank();
    localStorage.setItem(gameDataDate, "gameDataDate")
    putInLocalStorage();
    //console.log("answers" + answers, gameDataDate);
    //var loadedAnswers = (answers, JSON.parse(answers));
    //console.log(loadedAnswers.currentAnswers.length);
    //console.log("loaded" + loadedAnswers);
  } else{
    console.log("timed out, please retry");
    document.getElementById("timeOutOuter").style.display = "block";
  }
  var classiccheck = localStorage.getItem("classic");
  document.getElementById("soundBox").checked = JSON.parse(sound);
  document.getElementById("classicBox").checked = JSON.parse(classiccheck);
  putInLocalStorage();
  changeMode();
  lettersIntoDiv();
}

reload(localStorage.getItem("gameDataDate"));

function loadGameData() {
  // console.log(gameData.letters);
  calcScoreTotal(gameData);
  getRankings("queenBee", 1);
  getRankings("genius", 0.7);
  getRankings("funGi", 0.5);
  getRankings("wizahd", 0.3);
  getRankings("normalLoser", 0.15);
  getRankings("superLoser", 0.07);
}

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
  formatted_date = formatDate(new Date());
  //if(localStorage.getItem("gameDataDate") == formatted_date){
  if (this.readyState == 4 && this.status == 200) {
    // Typical action to be performed when the document is ready:
    var serverGameData = JSON.parse(xhttp.responseText);
    if (serverGameData != null && nyt == true) {
      console.log(serverGameData)
      localStorage.setItem("gameData" + serverGameData.date, JSON.stringify(serverGameData));
      //console.log(JSON.parse(localStorage.getItem("gameData"+ formatted_date)));
      //loadGameData();
    }
  }
  // }
};
xhttp.open("GET", "./parser", true);
xhttp.send();

var xhttpIP = new XMLHttpRequest();
xhttpIP.open("POST", "./getIP", true);
xhttpIP.send();

var badgeurls = [
  "https://cdn.glitch.com/9269e55a-fa29-4b11-9ea9-4bc941fc78f2%2Fsuper%20loss.jpg?v=1581554387691",
  "https://cdn.glitch.com/9269e55a-fa29-4b11-9ea9-4bc941fc78f2%2Fsuper%20loss.jpg?v=1581554387691",
  "https://cdn.glitch.com/9269e55a-fa29-4b11-9ea9-4bc941fc78f2%2Fnorm%20loss.jpg?v=1581555214586",
  "https://cdn.glitch.com/9269e55a-fa29-4b11-9ea9-4bc941fc78f2%2Fwiz.jpg?v=1581554388158",
  "https://cdn.glitch.com/9269e55a-fa29-4b11-9ea9-4bc941fc78f2%2Ffungi.jpg?v=1581554387740",
  "https://cdn.glitch.com/9269e55a-fa29-4b11-9ea9-4bc941fc78f2%2Fgenuis.jpg?v=1581554421138",
  "https://cdn.glitch.com/9269e55a-fa29-4b11-9ea9-4bc941fc78f2%2Fqueen%20bee.jpg?v=1581554388563",
  "https://cdn.glitch.com/9269e55a-fa29-4b11-9ea9-4bc941fc78f2%2Fqueen%20bee.jpg?v=1581554388563"
];

function calcRanks(max) {
  var queenBee1 = max;
  var genius1 = Math.floor(queenBee1 * 0.7);
  var funGi1 = Math.floor(queenBee1 * 0.5);
  var wizahd1 = Math.floor(queenBee1 * 0.3);
  var normalLoser1 = Math.floor(queenBee1 * 0.15);
  var superLoser1 = Math.floor(queenBee1 * 0.07);
  var nada1 = 0;
  var ranks1 = [nada1, superLoser1, normalLoser1, wizahd1, funGi1, genius1, queenBee1, queenBee1];
  return ranks1;
}

function rank(date) {
  var badges = badgeurls;
  for (i = 0; i < ranks.length; i++) {
    var av = Math.abs(i - 1);
    if (localStorage.getItem("myData" + date).currentScore <= ranks[i]) {
      document.getElementById(date).src = badges[av];
    }
  }
}

function enterAnswer() {
  var answer = document.getElementById("answerBox").innerHTML;
  document.getElementById("answerBox").innerHTML = "";
  scoreAnswer(answer, true);
  calcScoreTotal(gameData);
  yourRank();
}

function scoreAnswer(answer, showMessage) {
  if (checkAnswer(answer, showMessage)) {
    addAnswer(answer, showMessage);
  }
}

function checkAnswer(answer, showMessage) {
  //check length
  if (answer.length < 4) {
    if (showMessage == true) {
      showError("Not long enough");
    }
    return false;
  }
  //check center letter
  if (answer.indexOf(gameData.centerLetter) < 0) {
    if (showMessage == true) {
      showError(gameData.centerLetter + " not used");
        }
    return false;
  }
  //check already in word list
  if (myData.currentAnswers.includes(answer)) {
    if (showMessage == true) {
      showError("already in answers list");
        }
    return false;
  }
  //check all answers
  if (!gameData.allAnswers.includes(answer)) {
    if (showMessage == true) {
      showError("not a valid word");
        }
    return false;
  }
  return true;
}

function yourRank() {
  var queenBee = Math.floor(gameData.maxScore);
  var genius = Math.floor(queenBee * 0.7);
  var funGi = Math.floor(queenBee * 0.5);
  var wizahd = Math.floor(queenBee * 0.3);
  var normalLoser = Math.floor(queenBee * 0.15);
  var superLoser = Math.floor(queenBee * 0.07);
  var nada = 0;

  var ranks = [nada, superLoser, normalLoser, wizahd, funGi, genius, queenBee];
  var rankNames = [
    "Super Loser",
    "Super Loser",
    "Normal Loser",
    "Wizahd",
    "FunGi",
    "Genius",
    "Queen Bee"
  ];

  var badges = [
    "na",
    "badgeSL",
    "badgeNL",
    "badgeW",
    "badgeF",
    "badgeG",
    "badgeQ"
  ];

  for (i = 0; i < ranks.length; i++) {
    document.getElementById(badges[i]).style.display = "none";
    if (myData.currentScore >= ranks[i]) {
      document.getElementById("level").innerHTML = rankNames[i];
      document.getElementById(badges[i]).style.display = "inline";
    }
  }
  myData.rank = document.getElementById("level").innerHTML;
}

function addAnswer(answer, showMessage) {
  var score = scoring(answer);
  if (showMessage) {
    var scoreMessages = [
      "Cool!",
      "Awesome!",
      "Amazing!",
      "Great!",
      "Nice!",
      "Sweet!",
      "Hurrah!",
      "Huzzah!",
      "Yay!"
    ];
    if (document.getElementById("soundBox").checked == true) {
      yaysound.play();
    }
    var scoreMsg = scoreMessages[Math.floor(Math.random() * scoreMessages.length)];
    if (answer == "trait"){ 
      scoreMsg = "did he?"
    }
    document.getElementById("scoreAlert").innerHTML =
      score +
      " pt " +
      scoreMsg;
    document.getElementById("scoreAlert").style.display = "block";
    setTimeout(hideAlert, 2000);
    myData.currentAnswers.push(answer);
  }
  myData.currentScore += score;
  //add answer to array
  document.getElementById("currentScore").innerHTML = myData.currentScore;
  var sorted = myData.currentAnswers.sort();
  var prettyAnswers = "";
  if (sort == true) {
    for (var i = 0; i < sorted.length; i++) {
      prettyAnswers += "<div>" + sorted[i] + "</div>";
    }
  } else {
    for (var i = 0; i < myData.currentAnswers.length; i++) {
      prettyAnswers += "<div>" + myData.currentAnswers[i] + "</div>";
    }
  }
  document.getElementById("wordList").innerHTML = prettyAnswers;
  putInLocalStorage();
}

function hideAlert() {
  document.getElementById("scoreAlert").style.display = "none";
}

function shuffleLetters() { }
function showError(errorMessage) {
  document.getElementById("error").innerHTML = errorMessage;
  document.getElementById("error").style.display = "block";
  setTimeout(hideError, 1000);
}

function hideError() {
  document.getElementById("error").style.opacity = "0.25";
  setTimeout(function () {
    document.getElementById("error").style.display = "none";
  }, 500);
}

function scoring(answer) {
  var isAllLetters = true;
  for (var i = 0; i < gameData.letters.length; i++) {
    if (answer.indexOf(gameData.letters[i]) < 0) {
      isAllLetters = false;
      break;
    }
  }
  if (classic == false) {
    if (answer.length == 4) {
      return 1;
    }
    var plusSeven = 0;
    if (isAllLetters) {
      plusSeven = 7;
    }
    return answer.length + plusSeven;
  } else {
    if (answer.length <= 4) {
      return 0;
    }
    var plusSeven = 0;
    if (isAllLetters) {
      plusSeven = 2;
    }
    return 1 + plusSeven;
  }
}

function clearAnswers() {
  myData.currentAnswers = [];
  myData.currentScore = 0;
}

function lettersIntoDiv() {
  var buttons = document.getElementsByClassName("hiveButton");
  for (var i = 0; i < gameData.letters.length; i++) {
    buttons[i].innerHTML = gameData.letters[i];
  }
  document.getElementById("centerButton").innerHTML = gameData.centerLetter;
}

var allButtons = document.getElementsByClassName("allButtons");
for (var i = 0; i < allButtons.length; i++) {
  var item = allButtons[i];
  item.onclick = function () {
    if (myData.gaveUp == false) {
      document.getElementById("answerBox").innerHTML += this.innerHTML;
    }
  };
}

function deleteLetter() {
  var str = document.getElementById("answerBox").innerHTML;
  str = str.substring(0, str.length - 1);
  document.getElementById("answerBox").innerHTML = str;
}

var modal = document.getElementById("scoreModal");

// Get the button that opens the modal
var btn = document.getElementById("currentScoreContainer");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function () {
  putInCurrentScore();
  modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
  var modal2 = document.getElementById("othergamesouter");
  if (event.target == modal2) {
    modal2.style.display = "none";
  }
};

function getRankings(id, percent) {
  var levelNumber = Math.floor(gameData.maxScore * percent);
  document.getElementById(id).innerHTML = levelNumber;
}

function putInCurrentScore() {
  document.getElementById("yourScoreBox").innerHTML = myData.currentScore;
}
putInCurrentScore();

var testObject = { one: 1, two: 2, three: 3 };

function putInLocalStorage() {
  /*// Put the object into storage
  localStorage.setItem(
    "currentAnswers" + formatted_date,
    JSON.stringify(gameData.currentAnswers)
  );
  localStorage.setItem(
    "allAnswers" + formatted_date,
    JSON.stringify(gameData.allAnswers)
  );
  localStorage.setItem("score" + formatted_date, JSON.stringify(currentScore));
  localStorage.setItem(
    "centerLetter" + formatted_date,
    JSON.stringify(gameData.centerLetter)
  );
  localStorage.setItem("letters" + formatted_date, JSON.stringify(gameData.letters));
  localStorage.setItem("maxScore" + formatted_date, JSON.stringify(gameData.maxScore));
  // Retrieve the object from storage
  var answers = localStorage.getItem("currentAnswers" + formatted_date);
  var scores = localStorage.getItem("score" + formatted_date);

  console.log("answers" + formatted_date, JSON.parse(answers));
  console.log("scores" + formatted_date, JSON.parse(scores));
  */
  localStorage.setItem("gameData" + gameData.date, JSON.stringify(gameData));
  localStorage.setItem("myData" + gameData.date, JSON.stringify(myData));
  localStorage.setItem("classic", classic);
  localStorage.setItem("sounds", sound);
  localStorage.setItem("sort", sort);
  localStorage.setItem("gameDataDate", gameData.date);
}

function clearLocalStorage() {
  localStorage.setItem("myData" + formatted_date, []);
  localStorage.setItem("gameData" + formatted_date, []);
}

function shuffle() {
  for (var i = gameData.letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = gameData.letters[i];
    gameData.letters[i] = gameData.letters[j];
    gameData.letters[j] = temp;
    lettersIntoDiv();
  }
}

function giveUp() {
  if (
    confirm(
      "Are you sure you want to be a quitter??!\nThis will reveal all remaining answers"
    ) == true
  ) {
    if (confirm("Ya 105% sure?") == true) {
      quit("none");
    }
  }
}

function quit(none) {
  var quitterHTML = "";
  if (none == "none") {
    for (var i = 0; i < gameData.allAnswers.length; i++) {
      var ans = gameData.allAnswers[i];
      if (myData.currentAnswers.includes(ans) != true) {
        quitterHTML += '<div class="quita">' + ans + "</div>";
      } else {
        quitterHTML += "<div>" + ans + "</div>";
      }
      document.getElementById("wordList").innerHTML = quitterHTML;
    }
    myData.gaveUp = true;
  } else {
    myData.gaveUp = false;
  }
  document.getElementById("answerBox").style.display = none;
  document.getElementById("enterAnswer").style.display = none;
  document.getElementById("shuffle").style.display = none;
  document.getElementById("backspace").style.display = none;
  document.getElementById("level").style.display = none;
  putInLocalStorage();
}

function changeMode() {
  var checkBox = document.getElementById("classicBox");
  myData.currentScore = 0;
  if (checkBox.checked == true) {
    classic = true;
    for (i = 0; i < myData.currentAnswers.length; i++) {
      var score = scoring(myData.currentAnswers[i]);
      myData.currentScore += score;
    }
    document.getElementById("currentScore").innerHTML = myData.currentScore;
    document.getElementById("wordList").style.backgroundColor = "#FFE872";
    document.getElementById("answerBox").style.backgroundColor = "#FFE872";
    for (i = 0; i < document.getElementsByClassName("buttons").length; i++) {
      document.getElementsByClassName("buttons")[i].style.backgroundColor =
        "#FFE872";
    }
    putInLocalStorage();
    loadGameData();
    yourRank();
  } else {
    classic = false;
    for (i = 0; i < myData.currentAnswers.length; i++) {
      var score = scoring(myData.currentAnswers[i]);
      myData.currentScore += score;
    }
    document.getElementById("currentScore").innerHTML = myData.currentScore;
    document.getElementById("yourScoreBox").innerHTML = myData.currentScore;
    document.getElementById("wordList").style.backgroundColor = "#FFFF99";
    document.getElementById("answerBox").style.backgroundColor = "#FFFF99";
    for (i = 0; i < document.getElementsByClassName("buttons").length; i++) {
      document.getElementsByClassName("buttons")[i].style.backgroundColor =
        "#FFFF99";
    }
    putInLocalStorage();
    loadGameData();
    yourRank();
  }
}

function allStorage() {
  var existingGames = [];
  var existingGamesData = [];
  var existingDates = [];
  //var existingDates = []
  for (i = 0; i < localStorage.length; i++) {
    if (localStorage.key(i).includes("gameData") && localStorage.key(i).length == 18) {
      existingGames.push(localStorage.key(i));
      existingDates.push(localStorage.key(i).replace("gameData", ""));
    }
  }
  existingGames.sort();
  //  console.log(existingDates);
  existingDates = fixDate(existingDates);
  // console.log(existingGames);
  // console.log(existingDates);
  document.getElementById("prevGames").innerHTML = "";
  for (i = existingGames.length; i > 0; i--) {
    var getlet = localStorage.getItem("gameData" + existingDates[i]);
    var getmy = localStorage.getItem("myData" + existingDates[i]);
    if (getmy != null && getlet != null) {
      calcScoreTotal(JSON.parse(getlet));
      existingGamesData.push(existingDates[i] + getlet);
      for (j = 0; j < 6; j++) {
        if (JSON.parse(getmy).currentScore == JSON.parse(getlet).maxScore) {
          document.getElementById("prevGames").innerHTML +=
            "<img class='popupimgs' src=" + badgeurls[badgeurls.length - 1] + " width='30px' height='30px'>";
          break
        } else {
          if (JSON.parse(getmy).currentScore >= calcRanks(JSON.parse(getlet).maxScore)[j] && JSON.parse(getmy).currentScore < calcRanks(JSON.parse(getlet).maxScore)[j + 1]) {
            document.getElementById("prevGames").innerHTML +=
              "<img class='popupimgs' src=" + badgeurls[j] + " width='30px' height='30px'>";
            console.log(calcRanks(JSON.parse(getlet).maxScore));
          }
                }
      }
      document.getElementById("prevGames").innerHTML +=
        "<span styles='color:red;' class='otherDates popupimgs' onclick='changeletter(\"" +
        existingDates[i] +
        "\")'>" +
        //  "<div id= '" + existingDates[i] + "'>" + "</div>"+
        //"<img id= \""+existingDates[i]+"\">" +
        existingDates[i] +
        "<br>" +
        JSON.parse(getlet).letters.toString() +
        ";" +
        JSON.parse(getlet).centerLetter.toString() + "<br>"
        + JSON.parse(getmy).currentScore.toString() + "/" + JSON.parse(getlet).maxScore.toString() +
        "</span>" + " <br>" + "<br>";
    }
    //rank(existingDates[i])
    //  document.getElementById(existingDates[i]).innerHTML = JSON.parse(getmy).rank;
    // if (getmy.rank == undefined) {
    //  document.getElementById(existingDates[i]).innerHTML = ""; }
  }
  // sort(document.getElementById("otherGames").innerHTML);
}

function showPrevGames() {
  document.getElementById("otherGames").style.display = "block";
  document.getElementById("othergamesouter").style.display = "block";
}

function changeletter(existingDate) {
  reload(existingDate);
}

// Get the <span> element that closes the modal

var span2 = document.getElementsByClassName("closer")[0];

// When the user clicks on the button, open the modal

// When the user clicks on <span> (x), close the modal
function spanClick() {
  var modal2 = document.getElementById("othergamesouter");
  modal2.style.display = "none";
}

function changeSound() {
  var checkBox = document.getElementById("soundBox");
  var img = document.getElementById("soundImg");
  if (checkBox.checked == true) {
    sound = true;
    img.innerHTML = "<i class='fas fa-volume-up'></i>";
    putInLocalStorage();
  } else {
    sound = false;
    img.innerHTML = "<i class='fas fa-volume-mute'></i>";
    putInLocalStorage();
  }
}

function azSort() {
  var prettyAnswers = "";
  var sorted = myData.currentAnswers.sort();
  var checkBox = document.getElementById("sortBox");
  if (checkBox.checked == false) {
    for (var i = 0; i < myData.currentAnswers.length; i++) {
      prettyAnswers += "<div>" + sorted[i] + "</div>";
    }
    sort = true;
    putInLocalStorage();
  } else {
    for (var i = 0; i < myData.currentAnswers.length; i++) {
      prettyAnswers += "<div>" + myData.currentAnswers[i] + "</div>";
    }
    sort = false;
    putInLocalStorage();
  }
  document.getElementById("wordList").innerHTML = prettyAnswers;
}

function today() {
  document.getElementById("wordList").innerHTML = "";
  reload(formatDate(new Date()).toString());
  //location.reload();
}

function calcScore() {
  var words = myData.currentAnswers;
  myData.currentScore = "";
  for (i = 0; i < myData.currentAnswers.length; i++) {
    addAnswer(myData.currentAnswers[i], false);
  }
  putInLocalStorage();
}

function fixDate(datesArray) {
  for (i = 0; i < datesArray.length; i++) {
    if (datesArray[i].length > 8 && datesArray[i].length <= 8) {
      if (datesArray[i].length != 10) {
        var fix = datesArray[i].split("-")
        //var dash1 = datesArray[i].indexOf("-", 0);
        // var dash2 = datesArray[i].indexOf("-", 5);
        // console.log(dash1, dash2);
        var fixed = fix[0].padStart(4, "0") + "-" + fix[1].padStart(2, "0") + "-" + fix[2].padStart(2, "0");
        localStorage.setItem("gameData" + fixed, localStorage.getItem("gameData" + datesArray[i]));
        datesArray.splice(i, 1)
        datesArray.push(fixed);
      }
    }
  }
  // console.log(datesArray);
  datesArray.sort();
  return datesArray;
}

function cler() {
  localStorage.removeItem("gameData" + formatDate(new Date));
  localStorage.removeItem("myData" + formatDate(new Date));
  location.reload();
}

function uploadADB() {
  var myStorage = window.localStorage;
for(var i = 0; i<myStorage.length; i++){
  fetch("/addStory", {
          method: "POST",
          body: JSON.stringify({key:myStorage.key(i), value: myStorage.getItem(myStorage.key(i))}),
          headers: { "Content-Type": "application/json" }
        })
        .then(res => res.json())
        .then(response => {
    console.log(response);
  }
) 
} 
  alert("uploaded");
};

function getADB(){
   fetch("/addStory", {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        })
        .then(res => res.json())
        .then(response => {
    for(var i = 0; i<response.length; i++){
      console.log(JSON.parse(response[i].stories).key)
      localStorage.setItem(JSON.parse(response[i].stories).key, JSON.parse(response[i].stories).value);
    }
  }
) 
  alert("set");
}

function clearADB(){
  fetch("/clearDreams", {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        })
        .then(res => res.json())
        .then(response => {
    console.log(response);
  }
) 
}