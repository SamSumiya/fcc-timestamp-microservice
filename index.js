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
// A request to /api/:date? with a valid date should return a JSON object with a
// unix key that is a Unix timestamp of the input date in milliseconds (as type Number)
  // 01, 23 , 31
const validateDate = (rawDate) => {     
  const regex = /^\d{4}-(0?[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
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




app.get('/api/:date?', function(req, res) {
  let dateOfToday; 

  const year = new Date().getUTCFullYear()
  const month = new Date().getUTCMonth() + 1
  const day = new Date().getUTCDate();

  dateOfToday=`${year}-${month}-${day}`

  try {
    const dateParam = req.params.date ? req.params.date : dateOfToday

    const isValidDate = validateDate(dateParam)
    if (isValidDate) {
      const formattedDate = new Date(dateParam)
      const unixTimestamp = formattedDate.getTime();
      res.json({
        unix: unixTimestamp, 
        utc: formattedDate.toUTCString()
      })
    } else {
      console.log(`Input date ${dateParam} format is invalid`)
    }
  } catch(err) {
    console.error(`error : "Invalid Date"`)
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
