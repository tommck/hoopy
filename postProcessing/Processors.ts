import {IStatsProcessor} from './IStatsProcessor';
import {TomsOfficeProcessor} from './TomsOfficeProcessor';
import {CsvFileStorageProcessor} from './CsvFileStorageProcessor';
import {AzureTableStorageProcessor} from './AzureTableStorageProcessor';
import {HoopHouseProcessor} from './HoopHouseProcessor';
import {ThingSpeakProcessor} from './ThingSpeakProcessor';

interface ProcMap {
    name: string;
    proc: IStatsProcessor;
};

export const AllProcessors: ProcMap[] = [
    { name: 'HoopHouseProcessor', proc: new HoopHouseProcessor() },
    { name: 'TomsOfficeProcessor', proc: new TomsOfficeProcessor() },
    { name: 'AzureTableStorageProcessor', proc: new AzureTableStorageProcessor() },
    { name: 'CsvFileStorageProcessor', proc: new CsvFileStorageProcessor('stats.csv', true) },
    { name: 'ThingSpeakProcessor', proc: new ThingSpeakProcessor() }
];