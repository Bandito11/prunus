import { Injectable } from '@angular/core';
import { IResponse, ILog } from './common/models';

@Injectable({
    providedIn: 'root'
  })
export class CSVService {

    exportCSV(records: ILog[]): IResponse<string> {
        let response: IResponse<string> = {
            success: false,
            error: null,
            data: undefined,
            dateStamp: new Date().toString()
        };
        try {
            const data = this.createCSV(records);
            response = {
                ...response,
                success: true,
                data: data
            };
            return response;
        } catch (error) {
            response = {
                ...response,
                error: error
            };
            return error;
        }
    }

    private createCSV(records: ILog[]): string {
        let value = 'Date|Time|Description %\n';
        try {
            // tslint:disable-next-line:no-unused-expression
            records.length;
        } catch (error) {
            return 'There are no logs created on DB!';
        }
        records.map(tableRecord => {
            value += `${tableRecord.date}|`;
            value += `${tableRecord.time}|`;
            value += `${tableRecord.description}\n`;
        });
        return value;
    }
}
