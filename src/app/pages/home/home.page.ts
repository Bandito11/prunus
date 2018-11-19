import { ILog } from '../../common/models';
import { Component, ElementRef, ViewChild, AfterContentInit } from '@angular/core';
import { PrunusDBService } from '../../prunusdb.service';
import { formattedTime, formattedDate } from '../../common/formatted';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterContentInit {
  logs: ILog[];
  @ViewChild('notes') notesElement: ElementRef;
  timer: number;
  toggle;
  currentDate = '';
  constructor(public db: PrunusDBService) { }

  ngAfterContentInit() {
    this.timer = 0;
    const interval = setInterval(_ => {
      this.logs = [...this.db.getAllLogs()];
      if (this.logs.length) {
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

  updateNotes(opts: { id: string, description: string }) {
    this.logs[opts.id].description = opts.description;
  }

  logTime() {
    const date = new Date();
    const time = formattedTime(date);
    const currentDate = formattedDate(date);
    // this.logs.push({ date: currentDate, time: time, description: '', dateObj: new Date().toString() });
    try {
      this.db.insert({ date: currentDate, time: time, description: '', dateObj: '' });
    } catch (error) {
      console.error(error);
    }
    this.logs = [{ date: currentDate, time: time, description: '', dateObj: new Date().toString() }, ...this.logs];
  }
}
