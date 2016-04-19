This project includes code that will send a stream of music preference "votes" over a websocket to a server.

There is a mock client that uses the The Echo Nest Taste Profile Subset data to simulate user voting in realtime.

#Instructions
    Download the Taste Profile Subset from http://labrosa.ee.columbia.edu/millionsong/sites/default/files/challenge/train_triplets.txt.zip into `data/complete`. Extract the data.

    To build the subset, `./subsetBuilder/traingingSubsetBuilder.js`

        This will generate the sample by keeping only the triplets whose song appears in the MillionSongDataset subset.
            This reduces the number of triplets from 48,373,586 to 772,661.

    Edit the config file `host` and `port` fields to point the client at your server.
        Start the client with `./votingSimulator/client.js`
        
    A simple server is provides in votingSimulator/
        Fire it up with `./votingSimulator/server.js`

