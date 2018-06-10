var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data
var app = express();
const util = require('util');

// parse application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(express.urlencoded());
// app.use(express.json());

const hostname = '0.0.0.0';
const port = 9001;

const eosaccname = 'chantaman';

// EOS basic config
// eos host
// EOS Host: http://10.101.2.135:8888/
// const eoshost = 'http://10.101.2.135:8888';
const eoshost = 'http://localhost:8888';

Eos = require('eosjs') // Eos = require('./src')

prikey = '5Hvq68y7jLzfQaVhQNT9qVaiTDdEyfcTiBhQ9To1W4qBgWYYXmm'
pubkey = 'EOS7EnzgPsYPYdw6ywSRu4L2cV5bxcTzrcYxjgCjSsvpaRWau5zEg'

// eos = Eos({keyProvider: prikey})

config = {
  chainId: null, // 32 byte (64 char) hex string
  keyProvider: prikey, // WIF string or array of keys..
  httpEndpoint: eoshost,
  // mockTransactions: () => 'pass', // or 'fail'
  // transactionHeaders: (expireInSeconds, callback) => {
  //   callback(null/*error*/, headers)
  // },
  expireInSeconds: 60,
  broadcast: true,
  debug: false, // API and transactions
  sign: true
}

eos = Eos(config)

// ROUTES
// client ip : 10.101.1.178:63342/EOShackathon/index.html

// for testing frontend
app.get('/get_info', function (req, res) {
   console.log("**** GET request for get info ****");
   console.log("Get Account info");
   request
    .get(eoshost + '/v1/chain/get_info')
    .on('response', function(response) {
      console.log('    Response code: ' + response.statusCode) // 200
      console.log('    Response content type: ' + response.headers['content-type']) // 'image/png'
      console.log('    Response body: ' + JSON.stringify(response));
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, accept');
      res.setHeader('Content-Type', 'application/x-www-form-urlencoded');
      // res.setHeader('Access-Control-Allow-Credentials', true);
      response.on('data', function (chunk) {
        console.log('BODY: ' + chunk);
        res.end('{ "status": 200, "date": "17th May 2019", "rating": "4.5", "reward": "0.9"}');
      });
    })
});

// This responds with account info json on the homepage
app.get('/profile', function (req, res) {
   console.log("**** GET request for get account ****");
   console.log("Get Account info");

    request
    .post(
      { url: 'http://localhost:8888/v1/chain/get_account',
        json: {
                  "account_name":"user"
              }
      })
    .on('response', function(response) {
      console.log('    Response code: ' + response.statusCode) // 200
      console.log('    Response content type: ' + response.headers['content-type']) // 'image/png'
      console.log('    Response body: ' + JSON.stringify(response));
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
      res.setHeader('Access-Control-Allow-Credentials', true);
      response.on('data', function (chunk) {
        console.log('BODY: ' + chunk);
        res.end(chunk);
      });
    })
});

// client can make review by posting product id and user id
app.post('/makeReview', function (req, res) {
   console.log("**** POST request for the make review ****");
   // request body: productid userid rating comment
   // post body: productid userid rating comment currenttime
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
   res.setHeader('Access-Control-Allow-Credentials', true);
   res.setHeader('Content-Type', 'application/x-www-form-urlencoded');

   var resObject = JSON.parse(JSON.stringify(req.body));
   console.log(util.inspect(resObject));
   var productid = resObject.productid;
   var userid = resObject.userid;
   var rating = resObject.rating;
   var comment = resObject.comment;
   var currenttime = String(new Date());
   console.log(productid);
   console.log(currenttime);

   console.log("**** Make transaction ****");
   var transactionPromise =  eos.transaction({
                                       actions: [
                                         {
                                           account: 'drate.code',
                                           name: 'create',
                                           authorization: [{
                                             actor: eosaccname,
                                             permission: 'active'
                                           }],
                                           data: {
                                             code_account: eosaccname,
                                             review_desc: comment,
                                             review_date: currenttime,
                                             transaction_date: currenttime,
                                             product_name: productid,
                                             username: userid,
                                             rating: rating
                                           }
                                         }
                                       ]
                                     });
                                     // , res => { console.log(res); });//.then(res => { console.log(res) })
                                     //.catch(e => { console.log(e); });
   transactionPromise.then(
     // Log the fulfillment value
     function(val) {
         console.log(val);
         res.send({ status: "successful"});
   }).catch(
     // Log the rejection reason
    (reason) => {
         console.log('Handle rejected promise ('+reason+') here.');
         res.send('{ "status": "failed"}');
   });

   // res.send({
   //   status: 200
   // });

   res.send(util.inspect(req.body));
   // post a request to EOS host
   // return value (EOS) -> return value -> web client

});

// user can get review by user id and product id
app.post('/getReviewById', function (req, res) {
   console.log("**** POST request for the get review ****");

   var resObject = JSON.parse(JSON.stringify(req.body));
   console.log(util.inspect(resObject));
   var productid = resObject.productid;
   var userid = resObject.userid;
   console.log(productid);
   console.log(userid);

   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
   res.setHeader('Access-Control-Allow-Credentials', true);

   eos.getTableRows({
      json: true,
      table_key: "ratestable",
      scope: eosaccname,
      code: eosaccname,
      table: "ratestable"
   }).then(result => {
     var jsonResult = JSON.stringify(result.rows[0]);
     console.log(jsonResult);
     res.send(jsonResult);
   });
});

// testing function for communicating with EOS cpp side
app.get('/get', function (req, res) {
  console.log("**** Make transaction ****");
  var transactionPromise =  eos.transaction({
                                      actions: [
                                        {
                                          account: 'hello.code',
                                          name: 'hi',
                                          authorization: [{
                                            actor: 'tester',
                                            permission: 'active'
                                          }],
                                          data: {
                                            user: 'tester'
                                          }
                                        }
                                      ]
                                    }, res => { console.log(res); });//.then(res => { console.log(res) })
                                    //.catch(e => { console.log(e); });
  console.log(String(transactionPromise));
  transactionPromise.then(
    // Log the fulfillment value
    function(val) {
        console.log(val);
        res.send(val);
  }).catch(
    // Log the rejection reason
   (reason) => {
        console.log('Handle rejected promise ('+reason+') here.');
        res.send(reason);
  });

});


// user can get item average rating by product id
app.post('/getItemAverageRating', function (req, res) {
   console.log("**** POST request for the get review ****");
   var jsondata = JSON.parse(JSON.stringify(req.body));
   var productid = jsondata.product.id;

   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
   res.setHeader('Access-Control-Allow-Credentials', true);

   eos.getTableRows({
      json: true,
      table_key: "ratestable",
      scope: eosaccname,
      code: eosaccname,
      table: "ratestable"
   }).then(result => {
     var jsonResult = JSON.stringify(result.rows[0]);
     console.log(jsonResult);
     res.send(jsonResult);
   });

});


// user can get all review product id
app.post('/listOfUserReview', function (req, res) {
   console.log("**** POST request for the get review ****");
   var jsondata = JSON.parse(JSON.stringify(req.body));
   var userid =  jsondata.user.id;
   var productid = jsondata.product.id;

   var postTableData = {
    "json": { "type": "bool", "default": false},
    "table_key": "string",
    "scope": "name",
    "code": "name",
    "table": "name",
    "lower_bound": {"type": "uint64", "default": "0"},
    "upper_bound": {"type": "uint64", "default": "-1"},
    "limit": {"type": "uint32", "default": "10"}
  }


   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
   res.setHeader('Access-Control-Allow-Credentials', true);

   eos.getTableRows({
      json: true,
      table_key: "ratestable",
      scope: eosaccname,
      code: eosaccname,
      table: "ratestable"
   }).then(result => {
     var jsonResult = JSON.stringify(result.rows);
     console.log(jsonResult);
     res.send(jsonResult);
   });

});


var server = app.listen(port, function () {
   var host = hostname;
   var port = server.address().port;
   console.log("EOS Hackathon MediChain Server starts listening at http://%s:%s", host, port);
});
