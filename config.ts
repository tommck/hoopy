let fs = require('fs');

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

    return cfg;
}
