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

/**
 * 
 * Validates an array of 4 time-related values to ensure each can be successfully parsed by JavaScript's Date constructor.
 * FCC-style requirement: any input that can be passed to `new Date(value)` and not return "Invalid Date" is considered valid.
 * 
 * Acceptable input formats include:
 * - ISO 8601 date strings (e.g., "2011-01-01", "2025-12-25T14:30:00")
 * - Unix timestamps (as strings or numbers, e.g., "1451001600000")
 * - RFC 2822 date strings (e.g., "Mon, 25 Dec 1995 13:30:00 GMT")
 * 
 */

// Validate Unix timestamps 
const isValidUnixTimeStamp = ( dateString ) =>{ 
  return typeof dateString === 'string' && /^\d+$/.test(String(dateString)) 
}

// converting user input date to UTC and UNIX 
const parseDateInput = ( dateString ) => {
  if ( isValidUnixTimeStamp(dateString)) {
    const ms = Number(dateString)
    return new Date(ms)
  } else {
    return new Date(dateString)
  }
}

const buildDateResponse = (date) => {
  if (date.toString() === 'Invalid Date') {
    return { error: 'Invalid Date' };
  } else {
    return {
      unix: date.getTime(), 
      utc: date.toUTCString()
    }
  }
}

app.get('/api/:date?', function(req, res) {
  try {
    const userInput = req.params.date ? req.params.date : new Date()

    const parsedDate = parseDateInput (userInput)

    const response = buildDateResponse(parsedDate)
    res.json(response)
  } catch ( err ) {
    console.log("Error message: ", err)
    res.status(500).json({ error: 'Internal Server Error' });
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
