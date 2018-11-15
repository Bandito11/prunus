import { ILog } from '../../common/models';
import { Component, ElementRef, ViewChild, AfterContentInit } from '@angular/core';
import { PrunusDBService } from '../../prunusdb.service';

const MONTHSLABELS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'];

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterContentInit {
  logs: ILog[] = [];
  @ViewChild('notes') notesElement: ElementRef;
  timer: number;
  toggle;
currentDate = '';
  constructor(public db: PrunusDBService) { }

  ngAfterContentInit() {
    this.timer = 0;
    const interval = setInterval(_ => {
      this.logs = [...this.db.getAllLogs()];
      if (this.logs.length > 0) {
        clearInterval(interval);
      }
    }, 50);

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

  updateNotes(opts: { id: string, description: string  }) {
    this.logs[opts.id].description = opts.description;
  }

  logTime() {
    const date = new Date();
    let time = '';
    if (date.getHours() === 0) {
      time = `12:`;
    } else {
      if (date.getHours() > 12) {
        if ((date.getHours() - 12) < 10) {
          time = `0${date.getHours() - 12}:`;
        } else {
          time = `${date.getHours() - 12}:`;
        }
      } else {
        time = `${date.getHours()}:`;
      }
    }
    if (date.getMinutes() < 10) {
      time += `0${date.getMinutes()}:`;
    } else {
      time += `${date.getMinutes()}:`;
    }
    if (date.getSeconds() < 10) {
      time += `0${date.getSeconds()}`;
    } else {
      time += `${date.getSeconds()}`;
    }
    if (date.getHours() > 12) {
      time += ' PM';
    } else {
      time += ' AM';
    }
    let currentDate = '';
    if (date.getMonth() < 10) {
      currentDate = `${MONTHSLABELS[date.getMonth()]} 0${date.getDate()}, ${date.getFullYear()}`;
    } else {
      currentDate = `${MONTHSLABELS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    }
    // this.logs.push({ date: currentDate, time: time, description: '', dateObj: new Date().toString() });
    this.db.insert({ date: currentDate, time: time, description: '', dateObj: '' });
    this.logs = [{ date: currentDate, time: time, description: '', dateObj: new Date().toString() }, ...this.logs];
  }
}
