// server.js
// where your node app starts

// init project
const express = require("express");
const app = express();
const multer = require("multer");
const fs = require("fs");

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// init sqlite db
const dbFile = "./.data/sqlite.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbFile);
const db2 = new sqlite3.Database(dbFile);
app.set('trust proxy', true);

db.serialize(() => {
  if (!exists) {
    db.run(
      "CREATE TABLE Stories (id INTEGER PRIMARY KEY AUTOINCREMENT, stories TEXT)"
    );
    console.log("New table  created!");
  } else {
    console.log('Database "Stories" ready to go!');
  }
});

db2.serialize(() => {
if (!exists) {
   db2.run(
      "CREATE TABLE Ip (id INTEGER PRIMARY KEY AUTOINCREMENT, addresses TEXT, date TEXT)"
    );
    console.log("New table addresses created!");
 } else {
    console.log('Database "Ip" ready to go!');
  }
});



app.post("/addStory", (request, response) => {
  if (!process.env.DISALLOW_WRITE) {
    var formatStory = request.body;
    db.run('INSERT INTO Stories(stories) VALUES(?)', JSON.stringify(request.body), function(err) {
      if (err) {
        console.log(err)
        response.send({ message: "error!" , stuff: request.body});
      } else {
        response.send({ message: "sucsesses" });
      }
    });
  };
});

app.get("/addStory", (request, response) => {
  db.all("SELECT * from Stories", (err, rows) => {
    response.send(rows);
  });
}) 

app.get("/", (request, response) => {
  response.sendFile(`${__dirname}/views/index.html`);
});

app.post("/getIP", (request, response) => {
   if (!process.env.DISALLOW_WRITE) {
     var date = new Date();
    db2.run('INSERT INTO Ip(addresses, date) VALUES(?, ?)', [request.ip, date], function(err) {
      if (err) {
        console.log(err)
        response.send({ message: "error!" , stuff: request.body});
      } else {
        response.send({ message: "sucsesses" });
      }
    });
  };
  
});

app.get("/getIP", (request, response) => {
  db2.all("SELECT * from Ip", (err, rows) => {
    response.send(rows);
  });
}) 

// helper function that prevents html/css/script malice
const cleanseString = function(string) {
  return string.replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

// listen for requests :)
var listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});

// http://expressjs.com/en/starter/basic-routing.htm

// SET STORAGE
var storage = multer.memoryStorage(); /*diskStorage({
  inMemory: true,
  destination: function(req, file, cb) {
    cb(null, './uploadfile');
 },
filename: function (req, file, cb) {
    cb(null , file.originalname);
},
  fileFilter: function (req, file, cb) {
    if (file.mimetype !== 'txt') {
      req.fileValidationError = 'goes wrong on the mimetype';
      return cb(null, false, new Error('goes wrong on the mimetype'));
    }
    cb(null, true);
  }
})*/

var upload = multer({ storage: storage });

app.post("/uploadfile", upload.single("myFile"), (req, res) => {
  const file = req.buffer;
  if (!file) {
  }
  console.log(req.file);
  res.json(req.file);
});

app.get("/uploadfile", (req, res) => {
  //localStorage.setItem("result", JSON.stringify(file))
  res.json(req.file);
});

app.get("/clearDreams", (request, response) => {
  // DISALLOW_WRITE is an ENV variable that gets reset for new projects so you can write to the database
  if (!process.env.DISALLOW_WRITE) {
    db.each(
      "SELECT * from IpAddresses",
      (err, row) => {
        console.log("row", row);
        db.run(`DELETE FROM IpAddresses WHERE ID=?`, row.id, error => {
          if (row) {
            console.log(`deleted row ${row.id}`);
          }
        });
      },
      err => {
        if (err) {
          response.send({ message: "error!" });
        } else {
          response.send({ message: "success" });
        }
      }
    );
  }
});

const parser = require("./parser.js");


// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(request, response) {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/qrst", function(request, response) {
  response.sendFile(__dirname + "/views/qrst.html");
});

app.get("/parser", async function(req, res, next) {
  var result = await parser.getResults();
  res.json(result);
});
