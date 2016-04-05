import {config} from './config';
import {TableEntry} from './TableEntry';
import {AllProcessors} from './postProcessing/Processors';

const http = require('http');
const dispatcher = require('httpdispatcher');
const moment = require('moment');

// use dispatcher
function handleRequest(request, response) {
    try {
        dispatcher.dispatch(request, response);
    } catch (err) {
        console.log(err);
    }
}

// Create a server
const server = http.createServer(handleRequest);

// start our server
server.listen(config.http.port, function() {
    // Callback triggered when server is successfully listening. Hurray!
    console.log('Server listening on: http://localhost:%s', config.http.port);
});

// GET request for simple testing
dispatcher.onGet('/stats', function(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('No Stats For You!');
});

// Post from sensors
dispatcher.onPost('/stats', function(req, res) {
    // get starting point for going back in time for values
    const postReceivedTime = moment();

    console.log('\u0007'); // BEEP!

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Got Post Data');

    try {
        const stats = JSON.parse(req.body);

        // note: i just picked a length because they're all the same length
        let length = stats.temps.length;
        let entries = [];
        for (let i = 0; i < length; ++i) {

            // entries are in time order, this needs to be (length-iteration-1) minutes old. (e.g. from 29-0 minutes ago)
            let entryTime = moment(postReceivedTime).subtract(length - i - 1, 'minutes');

            let entry = new TableEntry(
                req.headers.host,
                entryTime.toDate(),
                stats.temps[i],
                stats.humidity[i],
                stats.battery[i],
                stats.version > 5 ? stats.soilTemp[i] : -1);

            entries.push(entry);
        }
        if (config.hostsToIgnore.indexOf(req.headers.host) === -1) {

            AllProcessors.forEach(function(proc) {
                proc.processEntries(req.headers.host, entries);
            });
        }
    }
    catch (err) {
        console.error('Error processing stats:', err);
    }

});


// let batteryPerc = map(stats.battery[i], 580, 774, 0, 100);

function getMeanValue(valArray) {
    if (!valArray || valArray.length < 3) {
        console.error('Not Enough Values in value array:', valArray);
        return -1;
    }
    else {
        // sort and remove the first and last values
        let vals = valArray.sort().slice(1, valArray.length - 1);

        // average the rest
        let sum = vals.reduce(function(a, b) { return a + b; });
        return sum / vals.length;
    }
}

// copied from the arduino.cc site for the map implementation
function map(x, in_min, in_max, out_min, out_max) {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}