// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// 🐶 Step 1 
// A request to /api/:date? with a valid date should return a JSON object with a
// unix key that is a Unix timestamp of the input date in milliseconds (as type Number)
const validateDate = (rawDate) => {     
  const regex = /^\d{4}-(0?[1-9]|1[0-2])-(0?[1-9]|[12]\d|3[01])$/;
  const isValid = regex.test(rawDate)
  
  if (!isValid) return false
  
  const [ year, month, day ] = rawDate.split('-').map(Number); 
  const date = new Date(rawDate)

  return (
    date.getUTCFullYear() === year && 
    date.getUTCMonth() + 1 === month && 
    date.getUTCDate() === day
  ); 
}

const ValidateUnix = (rawMS) => {
  const ms = Number(rawMS)
  if (isNaN( ms )) {
    return false  
  }
 
  if (!/^\d+$/.test(ms)) return false; // not all digits
  return true 
}

const validateUserInput = (userInput) => {
  let parsed; 

  if (ValidateUnix(userInput)) {
    const numberedInput = Number(userInput)
    parsed =  new Date(numberedInput)
  } else {
    parsed = new Date(userInput)
  }
  return parsed 
}

app.get('/api/:date?', function(req, res) {
  try {
    const dateParam = req.params.date ? validateUserInput(req.params.date) : new Date()
    const isValidDate = validateDate(dateParam)

    if (isValidDate) {
      console.log('✅ input is valid date', dateParam)
      const formattedDate = new Date(dateParam)
      const unixTimestamp = formattedDate.getTime();
      res.json({
        unix: unixTimestamp, 
        utc: formattedDate.toUTCString()
      })
    } else if (ValidateUnix(dateParam)) {
      const unixTimestamp = Number(dateParam)
      const utcDate = new Date(unixTimestamp) 
      res.json({
        unix: unixTimestamp, 
        utc: utcDate.toUTCString() 
      })
    } else {
       res.json({
        "error" : "Invalid Date" 
      })
    }
  } catch(err) {
    console.error("error : Invalid Date")
  }
})



// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});



// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
