const fs = require('fs'); // pull in the file system module

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

const returnObj = {};

const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const getCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};

// function to respond with
// takes request, response, status code, and content type
const respond = (request, response, status, type) => {
  let returnStr; // var to write out in the response
  // for xml type
  if (type === 'text/xml') {
    returnStr = '<response>';
    returnStr = `${returnStr} <message>${returnObj.message}</message>`;
    if (status !== 200) { returnStr = `${returnStr} <id>${returnObj.id}</id>`; }
    returnStr = `${returnStr} </response>`;
  }
  returnStr = JSON.stringify(returnObj);

  response.writeHead(status, { 'Content-Type': type });
  response.write(returnStr);
  response.end();
};

const success = (request, response, acceptedTypes) => {
  returnObj.message = 'This is a successful response.';
  const statusCode = 200;
  delete returnObj.id;

  return respond(request, response, statusCode, acceptedTypes[0]);
};

const badRequest = (request, response, acceptedTypes, params) => {
  returnObj.message = 'This is a successful response.';
  let statusCode = 200;
  delete returnObj.id;

  if (!params.valid || params.valid !== 'true') {
    statusCode = 400;
    returnObj.id = 'badRequest';
    returnObj.message = 'Missing valid query parameter set to true.';
  }

  return respond(request, response, statusCode, acceptedTypes[0]);
};

const unauthorized = (request, response, acceptedTypes, params) => {
  returnObj.message = 'This is a successful response.';
  let statusCode = 200;
  delete returnObj.id;


  if (!params.loggedIn || params.loggedIn !== 'yes') {
    statusCode = 401;
    returnObj.id = 'unauthorized';
    returnObj.message = 'Missing loggedIn query parameter set to yes.';
  }

  return respond(request, response, statusCode, acceptedTypes[0]);
};

const forbidden = (request, response, acceptedTypes) => {
  returnObj.message = 'You do not have access to this content.';
  returnObj.id = 'forbidden';
  const statusCode = 403;

  return respond(request, response, statusCode, acceptedTypes[0]);
};

const internal = (request, response, acceptedTypes) => {
  returnObj.message = 'Internal server error.  Something went wrong.';
  returnObj.id = 'internalError';
  const statusCode = 500;

  return respond(request, response, statusCode, acceptedTypes[0]);
};

const notImplemented = (request, response, acceptedTypes) => {
  returnObj.message = 'A get request for this page has not been implemented yet.  Check again later for updated content.';
  returnObj.id = 'notImplemented';
  const statusCode = 501;

  return respond(request, response, statusCode, acceptedTypes[0]);
};

const notFound = (request, response, acceptedTypes) => {
  returnObj.message = 'The page you are looking for was not found.';
  returnObj.id = 'notFound';
  const statusCode = 404;

  return respond(request, response, statusCode, acceptedTypes[0]);
};

module.exports = {
  getIndex,
  getCSS,
  success,
  badRequest,
  unauthorized,
  forbidden,
  internal,
  notImplemented,
  notFound,
};
