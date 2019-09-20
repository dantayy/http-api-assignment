const http = require('http'); // pull in http module
// url module for parsing url string
const url = require('url');
// querystring module for parsing querystrings from url
const query = require('querystring');
// pull in our custom file
const responseHandler = require('./responses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// here we create a object to route our requests to the proper
// handlers. the top level object is indexed by the request
// method (get, head, etc). We can use request.method to return
// the routing object for each type of method. Once we say
// urlStruct[request.method], we recieve another object which
// routes each individual url to a handler. We can index this
// object in the same way we have used urlStruct before.
const urlStruct = {
  '/': responseHandler.getIndex,
  '/style.css': responseHandler.getCSS,
  '/success': responseHandler.success,
  '/badRequest': responseHandler.badRequest,
  '/unauthorized': responseHandler.unauthorized,
  '/forbidden': responseHandler.forbidden,
  '/internal': responseHandler.internal,
  '/notImplemented': responseHandler.notImplemented,
  notFound: responseHandler.notFound,
};

// when a call is made to this server run this
const onRequest = (request, response) => {
  // parse the url using the url module
  // This will let us grab any section of the URL by name
  const parsedUrl = url.parse(request.url);

  // grab the query parameters (?key=value&key2=value2&etc=etc)
  // and parse them into a reusable object by field name
  const params = query.parse(parsedUrl.query);

  // grab the 'accept' headers (comma delimited) and split them into an array
  const acceptedTypes = request.headers.accept.split(',');

  // check if the path name (the /name part of the url) matches
  // any in our url object. If so call that function. If not, default to index.
  if (urlStruct[parsedUrl.pathname]) {
    urlStruct[parsedUrl.pathname](request, response, acceptedTypes, params);
  } else {
    urlStruct.notFound(request, response, acceptedTypes);
  }
};

// create a server that runs the onRequest function when pinged and listens at the specified port
http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
