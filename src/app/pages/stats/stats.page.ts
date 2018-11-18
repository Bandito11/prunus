import { PrunusDBService } from './../../prunusdb.service';
import { Component, OnInit } from '@angular/core';
import { IResponse } from '../../common/models';

@Component({
  selector: 'app-stats',
  templateUrl: 'stats.page.html',
  styleUrls: ['stats.page.scss']
})
export class StatsPage implements OnInit {

  todayLogs;

  constructor(public db: PrunusDBService) { }

  ngOnInit() {
    this.getTodayLogs();
  }

  getTodayLogs() {
    let todayResponse: IResponse<number> = {
      success: false,
      error: null,
      data: undefined,
      dateStamp: new Date().toString()
    };
    try {
      todayResponse = {
        ...this.db.getTodayLogs()
      };
    } catch (error) {
      console.error(error);
    }
    if (todayResponse.success) {
      this.todayLogs = todayResponse.data;
    } else if (todayResponse.error) {
      console.error(todayResponse.error);
    }
  }
}
