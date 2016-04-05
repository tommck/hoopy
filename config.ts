const fs = require('fs');

// read and watch config json.
export let config = readConfig();

fs.watchFile('./config.json', function () {
    config = readConfig();

    console.info('*** CONFIG CHANGED ***');
    console.log('New Config: ', config);
});

function readConfig() {
    let cfg = JSON.parse(fs.readFileSync('./config.json'));

    // now override settings with secrets from environment variables
    cfg.azure.storageConnectionString = process.env.HOOPY_CONNECTION_STRING;
    cfg.pushbullet.apiKey = process.env.HOOPY_PUSHBULLET_KEY;
    cfg.hoopHouseThresholds.email = process.env.HOOPY_HOOP_HOUSE_EMAIL;
    cfg.ifttt.key = process.env.HOOPY_IFTTT_KEY;

    let channelMap = cfg.thingSpeak.channelMap;
    channelMap.find((e) => e.name === 'tom-office').key = process.env.HOOPY_THINGSPEAK_OFFICE_KEY;
    channelMap.find((e) => e.name === 'hoopy-inside').key = process.env.HOOPY_THINGSPEAK_HOOPHOUSE_KEY;

    return cfg;
}
