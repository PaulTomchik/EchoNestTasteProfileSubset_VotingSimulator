#!/usr/bin/env node


/* This code is taken with little modification from here:
 *      https://www.npmjs.com/package/websocket
 */

'use strict'


let fs = require('fs')
let path = require('path')



let config = JSON.parse(fs.readFileSync('./config.json'))

let url = config.host + ':' + config.port

let dataPath = path.join(__dirname, '../data', config.dataset, 'train_triplets.txt')



let WebSocketClient = require('websocket').client

let client = new WebSocketClient()
 
let connection



client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString())
})

 
client.on('connect', function(conn) {
    console.log('WebSocket Client Connected')

    connection = conn

    conn.on('error', function(error) {
        console.log("Connection Error: " + error.toString())
    })
    
    conn.on('close', function() {
        console.log('voting Connection Closed')
    })

    conn.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log("Received: '" + message.utf8Data + "'")
        }
    })

    sendVotes()
})
 

let sendVotes = () => {

    let dataset  = config.dataset || 'subset'

    let lineReader = require('readline').createInterface({
        input: fs.createReadStream(dataPath)
    })

    lineReader.on('line', function (line) {
        let vote = line.split('\t')

        // Here, we want to change "number-of-listens" to thumb-up/down.
        // We consider multiple listens a thumb-up, a single listen a thumb-down.
        vote[2] = (parseInt(vote[2]) > 1) ? 1 : 0
        
        connection.sendUTF(vote.join(','))
    })
}



client.connect(url, config.protocol)
