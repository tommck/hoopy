import {config} from './config';

let PushBullet = require('pushbullet');
let pusher = new PushBullet(config.pushbullet.apiKey);

export function sendPushbulletNotification(dest, title, body) {

    pusher.note(
        dest,
        title,
        body,
        function(err, response) {
            if (err) {
                console.error('ERROR Pushing: ', err);
            }
        });
}
