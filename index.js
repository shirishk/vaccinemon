//Add required modules here
var express = require('express');
var router = express.Router();
var request = require('request');
var app = express();
var favicon = require('serve-favicon');
var path = require('path');
var moment = require('moment');
var bodyParser = require('body-parser');
var url = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/"
var today = new Date().toJSON().slice(0,10).split('-').reverse().join('-')

const id = require('./id.json')

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'pug')
app.set("views", path.join(__dirname, 'public', 'views'));

app.use('/',router);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')))

app.listen(process.env.PORT || 3000, function () {
    console.log('server running on port '+ app.get('port'));
});

const ten_days = () => {const days = []; const dateStart = moment(); const dateEnd = moment().add(10, 'days');
  while (dateEnd.diff(dateStart, 'days') >= 0) {
    days.push(dateStart.format('DD-MM-YYYY'));
    dateStart.add(1, 'days');
  }
  return days
 }

// Route method 'get' 
app.get('/', function (req, res){
  res.render("home", { title: "VaccineMON", district: id, today: today })
})

app.get('/:id/:date', function(req, res) {
  var district_id = req.params.id
  var date = req.params.date
  var state = id.find(item => item.id === Number(req.params.id)).state
  request.get({ url: url + "calendarByDistrict?district_id=" + district_id + "&date=" + date }, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      // console.log(ten_days())
      res.render("info", { "title": state, "results" : JSON.parse(body), "ten_days": ten_days()})
      // res.json(body);
    }
    else {
      res.render("error", {"title": pincode, "results" : JSON.parse(body)})
    }
  });
});

app.get('/pincode/:pincode/:date', function(req, res) {
  var pincode = req.params.pincode
  var date = req.params.date
  request.get({ url: url + "calendarByPin?pincode=" + pincode + "&date=" + date }, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      // console.log(JSON.parse(body))
      res.render("pincode", {"title": pincode, "results" : JSON.parse(body), "ten_days": ten_days()})
      // res.json(body);
    }
    else {
      res.render("error", {"title": pincode, "results" : JSON.parse(body)})
    }
  });
});

app.post('/', function(req, res) {
  var pincode = req.body.pincode 
  request.get({ url: url + "calendarByPin?pincode=" + pincode + "&date=" + today }, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      // console.log(JSON.parse(body))
      res.render("pincode", {"title": pincode, "results" : JSON.parse(body), "ten_days": ten_days()})
      // res.json(body);
    }
    else {
      res.render("error", {"title": pincode, "results" : JSON.parse(body)})
    }
  });
});

