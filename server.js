var express = require('express');
var WebSocket = require('ws');
var app = express();

app.use('/', express.static(__dirname));
app.use(express.bodyParser());

app.listen(8080);
console.log('listening on 8080');
