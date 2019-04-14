const express = require("express");
const bodyParser = require("body-parser");
const Pusher = require("pusher");
const app = express();
var fs = require("fs");
var FormData = require("form-data");
var axios = require("axios");
var FileAPI = require("file-api"),
  File = FileAPI.File,
  FileReader = FileAPI.FileReader;
// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Session middleware

// Create an instance of Pusher
const pusher = new Pusher({
  appId: "761584",
  key: "451fab013a7e18ea0008",
  secret: "eb700a8e677810ad2227",
  cluster: "us3",
  encrypted: true
});

app.get("/", (req, res) => {
  return res.sendFile(__dirname + "/index.html");
});

function getBase64(file, res) {
  var reader = new FileReader();

  reader.readAsDataURL(new File(file));

  reader.onload = function() {
    axios
      .post("http://192.168.13.42:5000/translate_accent/", {
        data: reader.result
      })
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
  };
  reader.onerror = function(error) {
    console.log("Error: ", error);
  };
}

app.get("/file", (req, res) => {
  getBase64("sample_final.mov", res);
});

app.post("/pusher/auth", (req, res) => {
  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;
  var presenceData = {
    user_id:
      Math.random()
        .toString(36)
        .slice(2) + Date.now()
  };
  const auth = pusher.authenticate(socketId, channel, presenceData);
  res.send(auth);
});

//listen on the app
const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Running Server at " + port));
