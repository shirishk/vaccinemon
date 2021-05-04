//Add required modules here
var express = require('express');
var router = express.Router();
var request = require('request');
var app = express();
var favicon = require('serve-favicon');
var path = require('path');

app.set('port', 4000);
app.set('view engine', 'pug')
app.set("views", path.join(__dirname, 'public', 'views'));

app.use('/',router);
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')))

app.listen(4000, function () {
    console.log('server running on port '+ app.get('port'));
});

// Route method 'get' 
app.get('/', function (req, res, next){
    res.render("frame", { title: "VaccineMON"})
})

app.get('/pune', function(req, res) {
    //    if (!req.params.id) {
    //        res.status(500);
    //        res.send({"Error": "Looks like you are not senging the product id to get the product details."});
    //        console.log("Looks like you are not senging the product id to get the product detsails.");
    //    }
    request.get({ url: "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=363&date='05-05-2021'" },      function(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(JSON.parse(body))
            res.render("info", { title: "Pune", results : JSON.parse(body)})
            // res.json(body);
        }
    });
});