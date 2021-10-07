const express = require("express");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");
// begin{debug setting}
const fs = require("fs-extra");
const out = fs.createWriteStream("info.log");
const logger = new console.Console(out);
logger.log('---ERROR STORAGE---');
// end{debug setting}

const connectOption = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

mongoose.connect("mongodb://localhost/farmers", connectOption);
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

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

app.listen(3000);
// process.env.PORT || 