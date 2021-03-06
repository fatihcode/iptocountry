/*
 * IP to Country
 * For the full copyright and license information, please view the LICENSE.txt file.
 */

/* jslint node: true */
'use strict';

var ip2co  = require('../'),
    utilex = require('utilex');

var appArgs   = utilex.args(),
    appConfig = {isHeapdump: false, listenOpt: {http: {hostname: '0.0.0.0', port: 12080}}};

// config
if(typeof appArgs.heapdump !== 'undefined') {
  var heapdump = require('heapdump');
  appConfig.isHeapdump = true;
}

if(typeof appArgs['listen-http'] !== 'undefined') {
  var httpAddr = ('' + appArgs['listen-http']).split(':', 2);
  if(httpAddr[0]) {
    appConfig.listenOpt.http.hostname  = httpAddr[0].trim();
    appConfig.listenOpt.http.port      = (httpAddr[1] || null);
  }
}

// Loads the database and listen http requests.
function loadAndServe() {
  ip2co.dbLoad();
  ip2co.listenHTTP({hostname: appConfig.listenOpt.http.hostname, port: appConfig.listenOpt.http.port});
}

if(ip2co.dbCSVCheckExp(48)) {
  ip2co.dbGet().then(function() {
    loadAndServe();
  }, function(err) {
    console.log(err);
  });
} else {
  loadAndServe();
}

// heapdump
if(appConfig.isHeapdump === true) {
  heapdump.writeSnapshot(__dirname + '/dump-' + Date.now() + '.heapsnapshot');
}