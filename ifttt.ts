let request = require('request');
import {config} from './config';

export function iftttPost(event: string, val1: any = undefined, val2: any = undefined, val3: any = undefined) {

    request({
        url: 'https://maker.ifttt.com/trigger/' + event + '/with/key/' + config.ifttt.key,
        method: 'POST',
        json: true,
        body: {
            value1 : val1,
            value2: val2,
            value3: val3
        }
    }, function (err, response, body) {
        // TODO: Error handling, etc
        console.log(response);
    });
}