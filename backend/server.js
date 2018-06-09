var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var app = express();

// parse application/json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const hostname = '0.0.0.0';
const port = 9001;
// eos host
const eoshost = 'https://10.101.2.135:8888';

Eos = require('eosjs') // Eos = require('./src')

prikey = '5JvM5RrhLD6aJL82CTTzGkhWR6V9NGgcsgRNpdqdoaLkMAZ4pXL'
pubkey = 'EOS69oKEP9BD7CX5Znnz5TV1wSfR33HqivnRtcZHaRGxYZ315VMDk'

// eos = Eos({keyProvider: prikey})

config = {
  chainId: null, // 32 byte (64 char) hex string
  keyProvider: prikey, // WIF string or array of keys..
  httpEndpoint: eoshost,
  mockTransactions: () => 'pass', // or 'fail'
  transactionHeaders: (expireInSeconds, callback) => {
    callback(null/*error*/, headers)
  },
  expireInSeconds: 60,
  broadcast: true,
  debug: false, // API and transactions
  sign: true
}

eos = Eos(config)

// client ip : 10.101.1.178:63342/EOShackathon/index.html
// EOS Host: http://10.101.2.135:8888/

// for testing frontend
app.get('/get_info', function (req, res) {
   console.log("**** GET request for get info ****");
   // res.send('GET'); // return Profile
   // post a request to EOS host
   // return value (EOS) -> return value -> web client
   // request('http://10.101.2.135:8888/v1/chain/get_info', function (error, response, body) {
   //   console.log('error:', error); // Print the error if one occurred
   //   console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
   //   console.log('body:', body); // Print the HTML for the Google homepage.
   // });
   console.log("Get Account info");
   request
    .get('https://10.101.2.135:8888/v1/chain/get_account')
    .on('response', function(response) {
      console.log('    Response code: ' + response.statusCode) // 200
      console.log('    Response content type: ' + response.headers['content-type']) // 'image/png'
      console.log('    Response body: ' + JSON.stringify(response));
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:63342');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
      res.setHeader('Access-Control-Allow-Credentials', true);
      // res.setEncoding('utf8');
      response.on('data', function (chunk) {
        console.log('BODY: ' + chunk);
        res.end(chunk);
      });
    })
});

// This responds with "Hello World" on the homepage
app.get('/profile', function (req, res) {
   console.log("**** GET request for get account ****");
   console.log("Get Account info");

    request
    .post(
      { url: 'https://10.101.2.135:8888/v1/chain/get_account',
        json: {
                    "account_name":"user"
                  }
      })
    .on('response', function(response) {
      console.log('    Response code: ' + response.statusCode) // 200
      console.log('    Response content type: ' + response.headers['content-type']) // 'image/png'
      console.log('    Response body: ' + JSON.stringify(response));
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:63342');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
      res.setHeader('Access-Control-Allow-Credentials', true);
      response.on('data', function (chunk) {
        console.log('BODY: ' + chunk);
        res.end(chunk);
      });
    })
});

app.post('/verification', function (req, res) {
   console.log("**** POST request for the homepage ****");
   res.send('POST');
   // post a request to EOS host
   // return value (EOS) -> return value -> web client

});


app.post('/makeReview', function (req, res) {
   console.log("**** POST request for the homepage ****");
   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:63342');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
   res.setHeader('Access-Control-Allow-Credentials', true);

   res.send({
     status: 200
   });
   // post a request to EOS host
   // return value (EOS) -> return value -> web client

});


app.post('/getReviewById', function (req, res) {
   console.log("**** POST request for the homepage ****");
   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:63342');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
   res.setHeader('Access-Control-Allow-Credentials', true);

   res.send({
     date: "10th June 2018",
     rating: 8.0,
     received: 5.5,
     currency: "usd"
   });
   // post a request to EOS host
   // return value (EOS) -> return value -> web client

});


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
                                    });
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


var server = app.listen(port, function () {
   var host = hostname;
   var port = server.address().port;
   console.log("EOS Hackathon MediChain Server starts listening at http://%s:%s", host, port);
});
