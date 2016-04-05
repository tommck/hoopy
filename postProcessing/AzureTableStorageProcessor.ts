import {IStatsProcessor} from './IStatsProcessor';
import {ITableEntry} from '../TableEntry';
import {config} from '../config';

let azure = require('azure-storage');

export class AzureTableStorageProcessor implements IStatsProcessor {
    private _tableService;
    private _tableName = 'HoopyMeasurements';

    constructor() {
        let connectionString = config && config.azure.storageConnectionString;
        if (!connectionString) {
            throw new Error('Environment letiable "HOOPY_CONNECTION_STRING" must be defined');
        }

        let retryOperations = new azure.ExponentialRetryPolicyFilter();

        this._tableService = azure.createTableService(connectionString).withFilter(retryOperations);

        this._tableService.createTableIfNotExists(this._tableName, function(error, result, response) {
            if (error) {
                console.error('FAILED creating table: ', error);
            }
            else {
                console.log('Table Created (or already there)');
            }
        });
    }

    processEntries(hostName: string, entries: ITableEntry[]) {

        // TODO: BATCH
        entries.forEach((entry) => {
            this.uploadEntryToAzure(entry);
        });
    }

    private uploadEntryToAzure(entry) {
        this._tableService.insertEntity(
            this._tableName,
            entry.toTableEntity(),
            { echoContent: true },
            function(error, result, response) {
                if (error) {
                    console.error('ERROR INSERTING ENTITY:', error);
                }
                else {
                    // console.info('Uploaded');
                }
            });
    }

}


