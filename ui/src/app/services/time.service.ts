import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  private static weekdayNames = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
  private static dayMS = 86400000;

  constructor() { }

  static nextWorkDate(): Date {
    const
      d = new Date(),
      date = d.getDate(),
      day = d.getDay(),
      nextDate = (day >= 5) ? date + 8 - day : date + 1;
    d.setDate(nextDate);
    return d;
  }

  static nextDayName(): string {
    return TimeService.weekdayNames[this.nextWorkDate().getDay()];
  }

  static dateOfDay(weekday: string): Date {
    const day = this.weekdayNames.findIndex(d => d === weekday);
    if (day < 0) return null;
    else {
      const
        d = new Date(),
        today = d.getDay();
      const shift = (today === 0 || day > today) ? day - today : 7 - today + day;
      d.setDate(d.getDate() + shift);
      console.log(`Identified date of '${weekday}': ${d}`);
      return d;
    }
  }

  static millisecondsOfDay(weekday: string): number {
    return TimeService.millisecondsOfDate(TimeService.dateOfDay(weekday));
  }

  static millisecondsOfDate(date: Date): number {
    return date.getTime() - date.getTime() % this.dayMS;
  }

  static millisecondsToDate(milliseconds: number): Date {
    return new Date(milliseconds);
  }

  static millisecondsToDay(milliseconds: number): string {
    return this.weekdayNames[this.millisecondsToDate(milliseconds).getDay()];
  }

}
