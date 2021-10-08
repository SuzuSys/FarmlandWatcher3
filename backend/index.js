const express = require("express");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");
const fs = require("fs-extra");
const https = require("https");

// begin{debug setting}
const out = fs.createWriteStream("info.log");
const logger = new console.Console(out);
logger.log('---ERROR STORAGE---');
// end{debug setting}

// begin{mongoose setting}
const connectOption = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};
mongoose.connect("mongodb://localhost/farmers", connectOption);
// end{mongoose setting}

// begin{express setting}
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
// end{express setting}

// begin{https setting}
const httpsOption = {
  key:  fs.readFileSync('/etc/letsencrypt/live/farmlandwatcher.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/farmlandwatcher.com/fullchain.pem')
};
const server = https.createServer(httpsOption, app);
// end{https setting}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'temp_file/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({storage: storage});

app.get('/', (req, res) => {
  res.send('Hello Farmers!');
});

app.post('/', upload.array('file[]'), (req, res) => {
  try {
    const contents = req.body;
    logger.log(contents);
    res.send('Thank you for sending a csv!');
  }
  catch (err) {
    logger.log(err);
  }
});

server.listen(3000);
