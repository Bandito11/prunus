import { Component, ElementRef, ViewChild, AfterContentInit } from '@angular/core';
import { PrunusDBService } from '../../prunusdb.service';
import { formatTime, dateToString } from '../../common/formatted';
import { ILog } from '../../common/models';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterContentInit {
  logs: any[];
  @ViewChild('notes') notesElement: ElementRef;
  timer: number;
  toggle;
  currentDate = '';
  constructor(public db: PrunusDBService) { }

  ngAfterContentInit() {
    this.timer = 0;
    const interval = setInterval(_ => {
      this.logs = this.getLogs();
      if (this.logs.length > -1) {
        clearInterval(interval);
      }
    }, 50);
  }

  getLogs() {
    return this.addElapsedTime(this.db.getAllLogs());
  }

  addElapsedTime(logs: ILog[]) {
    const res = logs.map((log, index) => {
      if (index === 0) {
        return {
          ...log,
          elapsedTime: ''
        };
      } else {
        const logDate = new Date(`${log.date} ${log.time}`);
        const prevLogDate = new Date(`${logs[index - 1].date} ${logs[index - 1].time}`);
        const timeDifference = prevLogDate.valueOf() - logDate.valueOf();
        let seconds: number | string = (timeDifference / 1000) % 60;
        let minutes: number | string = ((timeDifference / (1000 * 60)) % 60);
        const hours = ((timeDifference / (1000 * 60 * 60)) % 24).toFixed(0);
        minutes = (minutes < 10) ? '0' + minutes.toFixed(0) : minutes.toFixed(0);
        seconds = (seconds < 10) ? '0' + seconds.toFixed(0) : seconds.toFixed(0);
        return {
          ...log,
          elapsedTime: `${hours}:${minutes}:${seconds}`
        };
      }
    });
    return res;
  }

  showNotes(id) {
    if (this.toggle) {
      this.toggle = '';
    } else {
      this.toggle = id;
      setTimeout(() => {
        this.notesElement.nativeElement.focus();
      }, 0);
    }
  }

  addNotes(opts: { id: string; log: ILog, description: string }) {
    clearTimeout(this.timer);
    const log = {
      ...opts.log,
      description: opts.description
    };
    this.db.update(log);
    this.updateNotes(opts);
  }

  updateNotes(opts: { id: string, description: string }) {
    this.logs[opts.id].description = opts.description;
  }

  logTime() {
    const date = new Date();
    const time = formatTime(date);
    const currentDate = dateToString(date);
    // this.logs.push({ date: currentDate, time: time, description: '', dateObj: new Date().toString() });
    try {
      this.db.insert({ date: currentDate, time: time, description: '', dateObj: '' });
    } catch (error) {
      console.error(error);
    }
    const logs = [{ date: currentDate, time: time, description: '', dateObj: new Date().toString() }, ...this.logs];
    this.logs = this.addElapsedTime(logs);
  }
}
