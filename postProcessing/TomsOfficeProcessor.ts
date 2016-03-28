import {IStatsProcessor} from './IStatsProcessor';
import {ITableEntry} from '../TableEntry';
import {config} from '../config';
import {iftttPost} from '../ifttt';

export class TomsOfficeProcessor implements IStatsProcessor {
    processEntries(hostName: string, entries: ITableEntry[]) {
        if (hostName !== 'toms-office') {
            return;
        }
         
        let exceededMax = null; 
        let exceededMin = null;

        entries.forEach(function(entry) {
            if (entry.temp > config.tempThresholds.max) {
                exceededMax = entry;
            }
            else if (entry.temp < config.tempThresholds.min) {
                exceededMin = entry;
            }
        });
        
        if (exceededMax) {
            iftttPost('hot-office', exceededMax.temperature);
        }
        else if (exceededMin) {
            iftttPost('cold-office', exceededMin.temperature);
        }
    }
}