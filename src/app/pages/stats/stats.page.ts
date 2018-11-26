import { PrunusDBService } from './../../prunusdb.service';
import { Component, OnInit } from '@angular/core';
import { IResponse } from '../../common/models';
import { formattedDate, shortFormattedDate } from '../../common/formatted';

@Component({
  selector: 'app-stats',
  templateUrl: 'stats.page.html',
  styleUrls: ['stats.page.scss']
})
export class StatsPage implements OnInit {

  todayLogs: number;
  chosenDateLogs: number;
  thisDay: string;
  today = new Date();
  timer: number;
  currentDate: string;
  constructor(public db: PrunusDBService) { }

  ngOnInit() {
    this.currentDate = `${this.today.getFullYear()}-${(this.today.getMonth() + 1).toString()}-${this.today.getDate()}`;
    this.timer = 0;
    const interval = setInterval(_ => {
      this.getTodayLogs();
      this.thisDay = formattedDate(this.today, 'stats');
      this.getDateLogs(`${this.today.getFullYear()}-${this.today.getMonth() + 1}-${this.today.getDate()}`);
      if (this.todayLogs > -1) {
        clearInterval(interval);
      }
    }, 50);
  }

  getDateLogs(opts: string) {
    const date = {
      // tslint:disable-next-line:radix
      getFullYear: () => parseInt(opts.substring(0, 4)),
      // tslint:disable-next-line:radix
      getMonth: () => parseInt(opts.substring(5, 7)) - 1,
      // tslint:disable-next-line:radix
      getDate: () => parseInt(opts.substring(8, opts.length))
    };
    this.thisDay = shortFormattedDate(opts);
    const response = this.db.getLogs(formattedDate(<Date>date));
    if (response.success) {
      this.chosenDateLogs = response.data;
    } else {
      console.error(response.error);
    }
  }

  getTodayLogs() {
    let todayResponse: IResponse<number> = {
      success: false,
      error: null,
      data: undefined,
      dateStamp: this.today.toString()
    };
    try {
      todayResponse = {
        ...this.db.getLogs(formattedDate(this.today))
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
