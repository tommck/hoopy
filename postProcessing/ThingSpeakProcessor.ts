import {IStatsProcessor} from './IStatsProcessor';
import {ITableEntry} from '../TableEntry';
import {config} from '../config';

const ThingSpeakClient = require('thingspeakclient');
const moment = require('moment');

interface IChannelMap {
    name: string;
    channel: number;
    key: string;
};

export class ThingSpeakProcessor implements IStatsProcessor {
    private _tableService;
    private _tableName = 'HoopyMeasurements';
    private _client = new ThingSpeakClient();

    private _channelMap: IChannelMap[] = [
        { name: 'tom-office', channel: 104075, key: '4FGTAIKZZC3ID91L' },
        { name: 'hoopy-inside', channel: 104078, key: '1952M66YVVG6BY2J' }
    ];

    constructor() {
        let self = this;
        this._channelMap.forEach((mapEntry) => {
            self._client.attachChannel(
                mapEntry.channel,
                { writeKey: mapEntry.key },
                (err, resp) => {
                    if (err || resp <= 0) {
                        console.error('ERROR Attaching to ThingSpeak:', err, resp);
                    }
                }
            );
        });
    }

    processEntries(hostName: string, entries: ITableEntry[]) {

        let mapEntry = this._channelMap.find((m) => m.name === hostName);
        let self = this;
        if (mapEntry) {
            console.info(`Sending entries to ThingSpeak for ${hostName}, channel: ${mapEntry.channel}`);
            entries.forEach((entry) => {
                let fields = {
                    field1: entry.temp,
                    field2: entry.humidity,
                    field3: entry.battery,
                    field4: entry.soilTemp,
                    created_at: moment(entry.date).format()
                };

                self._client.updateChannel(mapEntry.channel, fields, (err, resp) => {
                    if (err || resp <= 0) {
                        console.error('ERROR Uploading to ThingSpeak:', err, resp);
                    }
                });
            });
        }
    }

}


