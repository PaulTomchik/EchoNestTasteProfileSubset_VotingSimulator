#!/usr/bin/env node

"use strict"

const fs = require('fs')
const path = require('path')
const readline = require('readline')

const songsIDsFilePath = path.join(__dirname, 'subsetSongIDs.txt')
const completeTastesTripletsPath = path.join(__dirname, '../data/complete/train_triplets.txt')
const tastesTripletsSubsetPath = path.join(__dirname, '../data/subset/train_triplets.txt')

let songsFilter = {}


const songIdsReader = readline.createInterface({
  input: fs.createReadStream(songsIDsFilePath)
});


songIdsReader.on('line', line => songsFilter[line] = 1);


songIdsReader.on('close', () => {
    let tripletSubset = []

    let subsetFileStream = fs.createWriteStream(tastesTripletsSubsetPath) 

    let tripletReader = readline.createInterface({
        input: fs.createReadStream(completeTastesTripletsPath)
    })

    tripletReader.on('line', line => {
        let triplet = line.split('\t')
        let songID = triplet[1]

        if (songsFilter[songID] ) {
            subsetFileStream.write(line + '\n')
        }
    })

    tripletReader.on('close', () => subsetFileStream.end())
})

