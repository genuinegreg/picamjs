var Picam = require('./lib/Picam');
var config = require('./config');
// config.path =

var picam = new Picam(config);

picam.shoot();
setInterval(function() {
  picam.shoot();
}, config.interval * 1000);
