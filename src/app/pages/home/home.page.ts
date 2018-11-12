import { Component, ElementRef, ViewChild } from '@angular/core';

interface ILog {
  date: string;
  time: string;
  description: string;
}

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
export class HomePage {
  logs: ILog[] = [];
  @ViewChild('notes') notesElement: ElementRef;
  toggle;

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

  addNotes({ notes, id }) {

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
    this.logs.push({ date: currentDate, time: time, description: '' });
  }
}
