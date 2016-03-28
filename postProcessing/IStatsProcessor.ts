import {ITableEntry} from '../TableEntry';

export interface IStatsProcessor {
    processEntries(hostName: string, entries: ITableEntry[]);
}



