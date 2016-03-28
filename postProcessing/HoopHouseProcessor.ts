import {IStatsProcessor} from './IStatsProcessor';
import {config} from '../config';
import {sendPushbulletNotification} from '../pushbullet';
import {iftttPost} from '../ifttt';
import {ITableEntry} from '../TableEntry';

export class HoopHouseProcessor implements IStatsProcessor {

    processEntries(hostName: string, entries: ITableEntry[]) {
        if (hostName !== 'hoopy-inside') {
            return;
        }

        let exceededMax = null;
        let exceededMin = null;

        entries.forEach(function(entry) {
            if (entry.temp > config.hoopHouseThresholds.max) {
                exceededMax = entry;
            }
            else if (entry.temp < config.hoopHouseThresholds.min) {
                exceededMin = entry;
            }
        });

        if (exceededMax) {
            let msg = 'Hoopy House is HOT!';
            let body = 'Exceeded Maximum temperature of ' + config.hoopHouseThresholds.max + 'F.\nLast Temp: ' + exceededMax.temperature + 'F';
            sendPushbulletNotification(config.hoopHouseThresholds.email, msg, body);
            sendPushbulletNotification(config.pushbullet.devices.tomsPhone, msg, body);

        }
        else if (exceededMin) {
            let msg = 'Hoopy House is COLD!';
            let body = 'Hit Temp below min of ' + config.hoopHouseThresholds.min + 'F.\nLast Temp: ' + exceededMin.temperature + 'F';
            sendPushbulletNotification(config.hoopHouseThresholds.email, msg, body);
            sendPushbulletNotification(config.pushbullet.devices.tomsPhone, msg, body);
        }
    }
}
