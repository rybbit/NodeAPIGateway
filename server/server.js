//
// Required libraries
//

var http = require('http');
var fs = require('fs');
var path = require('path');
var request = require('request');
var express = require('express');
var app = express();
var server = http.createServer(app);

//
// configuration section
//

var config = JSON.parse(fs.readFileSync('./server/config.json'));
var wwwPath = path.resolve(__dirname, config.wwwPath);  // convenience of using node, also allows slick CORS resolution for older browser support.
var usersAPIendpoint = config.usersAPIendpoint;
var baseAPIendpoint = config.baseAPIendpoint;
var port = config.port;

//
// Example valid Endpoints:
// http://localhost:8002/users
// http://localhost:8002/posts
//

//
// Set up hosting of static site
//

console.log('Hosting Static Resources found in: ' + wwwPath);

app.use(express.static(wwwPath));

//
// Set up local api endpoints
//

app.get('/users', function (req, res) {
  proxyLocalRequest(req, res);
});

app.get('/posts', function (req, res) {
  proxyLocalRequest(req, res);
});

app.get('/posts/1/comments', function (req, res) {
  proxyLocalRequest(req, res);
});

app.post('/posts', function (req, res) {
  proxyPostLocalRequest(req, res);
});

//
// Example Express/Node rendered form
//

app.get('/api/form', function (req, res) {
  renderForm(res);
});

//
// Example of sending parameters via url
//
// app.get('/api//:userid/:dataDisposition', function (req, res) {
//   var reqUrlPath = realAPIendpoint + '/' + req.params.userid + '/' + req.params.dataDisposition;
//   res.writeHead(200, 'OK', {'Content-Type': 'text/html'});
//   request(reqUrlPath).pipe(res);
// });

//
// Pull file from another domain as if it is local /googlelogo_color_272x92dp.png
//
// app.get('/googlelogo_color_272x92dp.png', function (req, res) {
//   req = http.get(staticResourceURL, function (result) {
//     var bodyChunks = [];
//     result.on('data', function (chunk) {
//       bodyChunks.push(chunk);
//     }).on('end', function () {
//       var body = bodyChunks.join('');
//       res.writeHead(200, 'OK', { 'Content-Type': 'text/html', 'Access-Control-Allow-Origin': '*' });
//       res.write(removeDomain(body));
//       res.end();
//     });
//   });
// });

server.listen(port);

function proxyLocalRequest (req, res) {
  // var parsed = req.get('search');
  var fullUrl = usersAPIendpoint + req.originalUrl;
//  var fullUrl = usersAPIendpoint;
  console.log('Fetching:' + fullUrl);
  getSite(fullUrl, function (error, reply) {
    if (error) {
    // console.log("[200] ERROR " + req.method + " to " + req.url);
      res.writeHead(200, 'OK', {'Content-Type': 'text/html'});
      res.write(error);
      res.end();
    } else {
      res.writeHead(200, 'OK', {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});
      res.write(reply);
      res.end();
    }
  });
}

function proxyPostLocalRequest (req, res) {
  var fullUrl = baseAPIendpoint + req.originalUrl;
  req = http.get(fullUrl, function (result) {
    var bodyChunks = [];
    result.on('data', function (chunk) {
      bodyChunks.push(chunk);
    }).on('end', function () {
      var body = bodyChunks.join('');
      res.writeHead(200, 'OK', {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});
      res.write(body);
      res.end();
    });
  });
  req.on('error', function (e) {
  });
}

//
// This function strips domain from real api respose body, so content can be reference by '/' thus avoiding Cross site issues
// This is re-appended for all subsequent request coming into proxy from application code
//
function removeDomain (contents) {
  var re = new RegExp(usersAPIendpoint, 'g');
  var retstr = contents.replace(re, '');
  return retstr;
}

// function strReplace (strObj, strToFind, strToReplace) {
//   var str = strObj;
//   var re = new RegExp(strToFind, 'g');
//   str = str.replace(re, strToReplace);
//   return str;
// }

// var invokeGetSite = function (post_options, callback) {
//   request.post(post_options, function (error, response, body) {
//     if (!error && response.statusCode === 200) {
//       callback('', body);
//     } else {
//       console.log(error);
//       callback(error, '');
//     }
//   });
// };

var getSite = function (fullUrl, callback) {
  request(fullUrl, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      callback('', body);
    } else {
      console.log('Error' + response.statusCode);
      callback(error, '');
    }
  });
};

var renderForm = function (response) {
    // console.log("[200] " + request.method + " to " + request.url);
  response.writeHead(200, 'OK', { 'Content-Type': 'text/html' });
  response.write('<html><head><title>Search Proxied API</title></head><body>\n');
  response.write('<h1>Search Form</h1>\n');
  response.write('<form action="/" method="post" name="apiForm">\n');
  response.write('<table>\n');
  response.write('<tr><td>Name</td><td><input type="text" name="userId" value="rybbit">rybbit</input></td></tr>\n');
  response.write('<tr><td>Function</td><td><input type="text" name="dataSection" value="repos">repos</input></td></tr>\n');
  response.write('<tr><td colspan=2><input type="submit" /></td></tr>\n');
  response.write('</table>\n');
  response.write('</form></body></html><br />\n');
  response.end();
};
