#!/usr/bin/env node


/* This code is taken with little modification from here:
 *      https://www.npmjs.com/package/websocket
 */



'use strict';

var WebSocketClient = require('websocket').client;
 
var client = new WebSocketClient();
 
var connection;

client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
});
 
client.on('connect', function(conn) {
    console.log('WebSocket Client Connected');

    connection = conn;

    conn.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });
    conn.on('close', function() {
        console.log('echo-protocol Connection Closed');
    });
    conn.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log("Received: '" + message.utf8Data + "'");
        }
    });

    sendVotes()
});
 
client.connect('ws://localhost:8080/', 'echo-protocol');


let sendVotes = () => {
    var lineReader = require('readline').createInterface({
      input: require('fs').createReadStream('./trainingData/train_triplets.txt')
    });

    lineReader.on('line', function (line) {
      let vote = line.split('\t')
      vote[2] = (parseInt(vote[2]) > 1) ? 1 : 0
      connection.sendUTF(vote.join(','))
    });
}
