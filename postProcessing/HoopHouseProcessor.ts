import {IStatsProcessor} from './IStatsProcessor';
import {config} from '../config';
import {sendPushbulletNotification} from '../services/pushbullet';
import {ITableEntry} from '../TableEntry';

export class HoopHouseProcessor implements IStatsProcessor {

    processEntries(hostName: string, entries: ITableEntry[]) {
        if (hostName !== 'hoopy-inside') {
            return;
        }

        let exceededMax: ITableEntry = null;
        let exceededMin: ITableEntry = null;
        let exceededSoilMin: ITableEntry = null;
        let exceededSoilMax: ITableEntry = null;

        let ambientLimits = config.hoopHouseThresholds.ambient;
        let soilLimits = config.hoopHouseThresholds.soil;

        entries.forEach(function(entry) {
            if (entry.temp > ambientLimits.max) {
                exceededMax = entry;
            }
            else if (entry.temp < ambientLimits.min) {
                exceededMin = entry;
            }

            if (entry.soilTemp !== -1) {
                if (entry.soilTemp > soilLimits.max) {
                    exceededSoilMax = entry;
                }
                else if (entry.soilTemp < soilLimits.min) {
                    exceededSoilMin = entry;
                }
            }
        });

        if (exceededMax) {
            const msg = 'Hoopy House is HOT!';
            let body = `Exceeded Maximum temperature of ${ambientLimits.max}F.\nLast Temp: ${exceededMax.temp}F\nSoil Temp: ${exceededMax.soilTemp}F`;
            sendPushbulletNotification(config.hoopHouseThresholds.email, msg, body);
            sendPushbulletNotification(config.pushbullet.devices.tomsPhone, msg, body);

        }
        if (exceededMin) {
            const msg = 'Hoopy House is COLD!';
            let body = `Hit Temp below min of ${ambientLimits.min}F.\nLast Temp: ${exceededMin.temp}F\nSoil Temp: ${exceededMin.soilTemp}F`;
            sendPushbulletNotification(config.hoopHouseThresholds.email, msg, body);
            sendPushbulletNotification(config.pushbullet.devices.tomsPhone, msg, body);
        }

        if (exceededSoilMin) {
            const msg = 'Hoopy House SOIL is COLD!';
            let body = `Hit Temp below min of ${soilLimits.min}F.\nLast Temp: ${exceededSoilMin.soilTemp}F\nAmbient Temp: ${exceededSoilMin.temp}F`;
            sendPushbulletNotification(config.hoopHouseThresholds.email, msg, body);
            sendPushbulletNotification(config.pushbullet.devices.tomsPhone, msg, body);
        }

        if (exceededSoilMax) {
            const msg = 'Hoopy House SOIL is HOT!';
            let body = `Exceeded Maximum temperature of ${soilLimits.max}F.\nLast Temp: ${exceededSoilMax.soilTemp}F\nAmbient Temp: ${exceededSoilMax.temp}F`;
            sendPushbulletNotification(config.hoopHouseThresholds.email, msg, body);
            sendPushbulletNotification(config.pushbullet.devices.tomsPhone, msg, body);
        }
    }
}
