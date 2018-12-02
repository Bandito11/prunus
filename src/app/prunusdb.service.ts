import { ILog, IResponse } from './common/models';
import { Injectable } from '@angular/core';
import * as Loki from 'lokijs';
import { IonicStorageAdapter } from './adapter';
import { formatTime, dateToString } from './common/formatted';

/**
 * Collections
 */
let logsColl: Collection<ILog>;

/**
 * DB
 */
let prunusDB: Loki;

@Injectable({
  providedIn: 'root'
})
export class PrunusDBService {
  constructor() {
    this.createDB();
  }

  private createDB() {
    const ionicStorageAdapter = new IonicStorageAdapter();
    const lokiOptions: Partial<LokiConfigOptions> = {
      autosave: true,
      autoload: true,
      adapter: ionicStorageAdapter,
      autoloadCallback: this.loadDatabase
    };
    prunusDB = new Loki('prunus.db', lokiOptions);
  }

  private loadDatabase() {
    logsColl = prunusDB.getCollection<ILog>('students');
    if (!logsColl) {
      logsColl = prunusDB.addCollection<ILog>('students');
    }
  }

  insert(log: ILog) {
    let response: IResponse<null> = {
      success: false,
      error: null,
      data: undefined,
      dateStamp: new Date().toString()
    };
    const results = logsColl.findOne({
      date: {
        $eq: log.date
      },
      time: {
        $eq: log.time
      }
    });
    if (results) {
      response = {
        ...response,
        error: 'Cannot add log already created in the database.'
      };
    } else {
      logsColl.insertOne(log);
      response = {
        ...response,
        success: true
      };
    }
  }

  update(log: ILog) {
    let response: IResponse<string> = {
      success: false,
      error: null,
      data: undefined,
      dateStamp: new Date().toString()
    };
    const results = logsColl.findOne({
      date: {
        $eq: log.date
      },
      time: {
        $eq: log.time
      }
    });
    try {
      if (results) {
        logsColl.update(log);
        response = {
          ...response,
          success: true,
          data: 'Log was updated successfully!'
        };
      } else {
        logsColl.insertOne(log);
        response = {
          ...response,
          success: true,
          data: 'Log was added to Database successfully!'
        };
      }
    } catch (error) {
      response = {
        ...response,
        error: error
      };
    }
    return response;
  }

  remove(id: LokiObj): IResponse<string> {
    let response: IResponse<string> = {
      success: false,
      error: null,
      data: undefined,
      dateStamp: new Date().toString()
    };
    const results = logsColl.find({
      $loki: {
        $eq: id
      }
    });
    if (results) {
      logsColl.remove(results);
      response = {
        ...response,
        success: true,
        data: 'Log was removed successfully!'
      };
    } else {
      response = {
        ...response,
        error: 'This record doesn\'t exist on database.'
      };
    }
    return response;
  }

  getAllLogs() {
    try {
      // return logsColl
      //   .chain()
      //   .sort((rec1, rec2) => {
      //     if (rec1.$loki < rec2.$loki) {
      //       return 1;
      //     }
      //   })
      //   .data();
      return logsColl.data.reverse();
    } catch (error) {
      return [];
    }
  }

  getLogs(date) {
    let response: IResponse<number> = {
      success: false,
      error: null,
      data: undefined,
      dateStamp: new Date().toString()
    };
    try {
      const record = logsColl.find({
        date: {
          $eq: date
        }
      });
      if (record) {
        response = {
          ...response,
          success: true,
          data: record.length
        };
        return response;
      } else {
        response = {
          ...response,
          error: 'There was no record on DB for this date'
        };
        return response;
      }
    } catch (error) {
      if (logsColl) {
        console.error(error);
      }
      response = {
        ...response,
        success: true,
        data: -1
      };
      return response;
    }
  }
}
