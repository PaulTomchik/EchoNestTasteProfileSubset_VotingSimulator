#!/usr/bin/env node

"use strict"

/* This code is taken almost without modification from here:
 *      https://www.npmjs.com/package/websocket
 */

var WebSocketServer = require('websocket').server
var http = require('http')
let fs = require('fs')

let config = JSON.parse(fs.readFileSync('./config.json'))

 
var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url)
    response.writeHead(404)
    response.end()
})

server.listen(config.port, function() {
    console.log((new Date()) + ' Server is listening on port ' + config.port)
})
 
var wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production 
    // applications, as it defeats all standard cross-origin protection 
    // facilities built into the protocol and the browser.  You should 
    // *always* verify the connection's origin and decide whether or not 
    // to accept it. 
    autoAcceptConnections: false
})
 
function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed. 
  return true
}
 

let userVoteHistories = {}

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin 
      request.reject()
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.')
      return
    }
    
    var connection = request.accept(config.protocol, request.origin)
    
    console.log((new Date()) + ' Connection accepted.')

    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            let vote = message.utf8Data.split(',')

            let user = vote[0]
            let song = vote[1]
            let pref = vote[2]

            let userHistory = (userVoteHistories[user] || (userVoteHistories[user] = { votes: {}, lastTen: [] }))

            userHistory.votes[song] = pref
            userHistory.lastTen.push(song)

            if (userHistory.lastTen.length === 10) {

                let voteBatch = userHistory.lastTen.reduce((acc, s) => { 
                    acc[s] = userHistory.votes[s]
                    return acc 
                }, {}) 

                connection.sendUTF(JSON.stringify({ 
                    userID: user, 
                    lastTen: voteBatch, 
                    voteCt: Object.keys(userHistory.votes).length 
                }, null, 4))

                userHistory.lastTen.length = 0
            }

        }
    })

    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.')
    })
})
