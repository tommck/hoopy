import {IStatsProcessor} from './IStatsProcessor';
import {TomsOfficeProcessor} from './TomsOfficeProcessor';
import {CsvFileStorageProcessor} from './CsvFileStorageProcessor';
import {AzureTableStorageProcessor} from './AzureTableStorageProcessor';
import {HoopHouseProcessor} from './HoopHouseProcessor';
import {ThingSpeakProcessor} from './ThingSpeakProcessor';

export const AllProcessors: IStatsProcessor[] = [
    new HoopHouseProcessor(),
    new TomsOfficeProcessor(),
    new AzureTableStorageProcessor(),
    new CsvFileStorageProcessor('stats.csv', true),
    new ThingSpeakProcessor()
];