
let azure = require('azure-storage');

export interface ITableEntry {
    deviceId: string;
    date: Date;
    temp: number;
    humidity: number;
    battery: number;
    soilTemp: number;
    toTableEntity(): any;
}

export class TableEntry implements ITableEntry {

    constructor(
        public deviceId: string,
        public date: Date,
        public temp: number,
        public humidity: number,
        public battery: number,
        public soilTemp: number) {
    }

    public toTableEntity(): any {
        // get date/time in reverse date order
        let currentTimeInMilliseconds = this.date.getTime();
        let endOfTime = 100000000 * 24 * 60 * 60 * 1000;
        let rowKey = endOfTime - currentTimeInMilliseconds;
        let entityGenerator = azure.TableUtilities.entityGenerator;

        return {
            PartitionKey: entityGenerator.String(this.deviceId),
            RowKey: entityGenerator.String(rowKey.toString()),
            temp: entityGenerator.Double(this.temp),
            humidity: entityGenerator.Double(this.humidity),
            battery: entityGenerator.Int32(this.battery),
            soilTemp: entityGenerator.Double(this.soilTemp)
        };
    };
}
