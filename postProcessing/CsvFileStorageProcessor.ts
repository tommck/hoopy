import {IStatsProcessor} from './IStatsProcessor';
import {ITableEntry} from '../TableEntry';
import {config} from '../config';

const fs = require('fs');

export class CsvFileStorageProcessor implements IStatsProcessor {

    constructor(
        private _fileName: string = 'stats.csv',
        private _logToConsole: boolean = false) {
    }

    processEntries(hostName: string, entries: ITableEntry[]) {

        let self = this;
        entries.forEach((entry) => {

            let output = `${entry.deviceId}, ${entry.date}, ${entry.temp}, ${entry.humidity}, ${entry.battery}, ${entry.soilTemp}`;

            if (self._logToConsole) {
                console.log(output);
            }

            fs.appendFile(self._fileName, `${output}\r\n`);
        });
    }
}


