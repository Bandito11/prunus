import { ILog, IResponse } from './common/models';
import { Injectable } from '@angular/core';
import * as Loki from 'lokijs';
import { IonicStorageAdapter } from './adapter';

/**
 * Collections
 */
let logsColl: Collection<ILog>;

/**
 * DB
 */
let prunusDB: Loki;

@Injectable({
  providedIn: 'root',
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
      data: undefined
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
        error: 'Cannot add log already created in the databse.'
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
      data: undefined
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
      data: undefined
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
      return logsColl.data;
    } catch (error) {
      return [];
    }
  }
}
