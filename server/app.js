var express    = require('express');
var bodyParser = require('body-parser');
var db         = require('./db.js');

var app = express();
app.use('/', express.static('client'));
app.use(bodyParser.json());

var server = app.listen(process.env.PORT, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('NomNow server is listening at http://%s:%s', host, port);
  db.init();
});


// This asks the database for the info the client needs.
// The client will use that info to make a marker on the map.
app.get('/wait', function (req, res) {
  db.getAvgWaitsLatestReportAllLocs (function (results){
    res.send(results);
  })
});

// This accepts data from the client.
// If the data looks good, it add a restaurant and report record.
app.post('/wait', function (req, res) {
  var data = req.body.data;
  if (
    data.google_id === undefined ||
    data.name      === undefined ||
    data.longitude === undefined ||
    data.latitude  === undefined ||
    data.wait      === undefined
    ) {
    res.sendStatus(400);
  }

  else {
    db.addReport(data.google_id, data.wait, data.name, data.website, data.longitude, data.latitude);
    db.addRestaurant(data.name, data.website, data.google_id, data.longitude, data.latitude);
    res.sendStatus(200);
  }
});
