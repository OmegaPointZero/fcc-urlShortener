var mongo = require('mongodb').MongoClient;
var express = require('express');
var crypto = require('crypto');
var http = require('http');
var app = express();
var mongostr = 'mongodb://fccUser:fccPassword@ds149144.mlab.com:49144/fcc-urlservice';

app.use(express.static('public'));

app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get("/new/*", function(req, res){
  var urlStr = req.url.slice(5);
  if(/^https?:\/\/[0-9a-z]+\./.test(urlStr) == false){
    res.end('Not a valid URL');
  }else{
    var urlSHA = crypto.createHash('sha1').update(urlStr).digest('hex').slice(0,5);
    var SHAStr = 'https://fcc-urlshort.glitch.me/' + urlSHA;
    var myObj = {};
    myObj[urlStr] = SHAStr;
    var dbObj = {};
    dbObj['_id'] = urlSHA;
    dbObj['orig'] = urlStr;
    dbObj['short'] = SHAStr;
    
    
    mongo.connect(mongostr,function(err,db){
      if(err) throw err;
      var urls = db.collection('urls');
      urls.insert(dbObj, function(err, data){
        if (err) throw err;
        db.close();
      });
    })   
    res.writeHead(200, {'Content-Type':'application/JSON'});
    res.write(JSON.stringify(myObj));
  }
})

app.get('/*',function(req,res){
  if(req.url.length > 1 && req.url.slice(0,5) != "/new/"){
    var input = req.url.slice(1);
    mongo.connect(mongostr, function(err,db){
      if(err) throw err;
      var urls = db.collection('urls');
      urls.find({
        _id: input
      }).toArray(function(err,ids){
        if (err) throw err;
        var redirect = ids[0]['orig'];
        res.redirect(redirect);
      })
    })
  }
})

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
