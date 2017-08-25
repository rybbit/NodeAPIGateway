# NodeAPIGateway
Working Code examples of using Node and Express as a web service API proxy or gateway.
Code also show how to host static content using Node and test web services using Jasmine and Frisby.

The Codebase provides:
1) A centralized location for front-end JavaScript applications to reference for data access
  a) API Proxy examples for Get and Posts
  b) Proxy local file requests to external domains to avoid XSS and CORs issues in the calling browser.
    ./file.js could be pulled from another domain but used as http://localhost/file.js
2) A way to serve static assets that could consume a local API
3) Tests to verify the proxy is behaving as expected

Potential uses (Not illustrated in code yet):
1) Proxy multiple web service resources to appear as one API served from the same domain as the client code.

Running the example site:
1) You will need Node and npm to get this project running.
2) Make sure to change the 'wwwPath' in config.json to the static site path.
3) 'npm install' -fetches all required libraries listed in package.json
4) 'npm start' Starts Proxy
5) 'npm test' Tests that prove proxy is working correctly. (Jasmine and Frisby)
