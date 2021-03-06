import { Component, OnInit, Input, ViewEncapsulation, forwardRef, Provider, EventEmitter, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CalendarDefinitions, SelectionMode } from './objects/calendar-definitions';

export const CALENDAR_CONTROL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CalendarComponent),
  multi: true
};

@Component({
  selector: 'dp-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss', '../../../infralib.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [CALENDAR_CONTROL_VALUE_ACCESSOR]

})
export class CalendarComponent implements OnInit, ControlValueAccessor {

  lastInputDate: Date;
  isInputByUser: boolean;
  @Input() definition: CalendarDefinitions;
  @Output() selectEvent: EventEmitter<number> = new EventEmitter();

  private _innerValue: Date;
  constructor() { }


  private onChangeCallback: (_: any) => void = () => { };
  private onTouchedCallback: () => void = () => { };


  ngOnInit(): void {
    if (this.definition == null) {
      this.definition = new CalendarDefinitions({ isStandAlone: false });
    }
  }

  public get innerValue(): Date {
    return this._innerValue;
  }

  public set innerValue(newValue: Date) {
    if (newValue) {
      this._innerValue = new Date(newValue);
    }
    this.onChangeCallback(newValue);
  }

  public onBlur() {
    this.onTouchedCallback();
  }

  public writeValue(value: Date) {
    if (value !== this.innerValue) {
      this.innerValue = value;
    }
  }


  public registerOnChange(callback: (_: Date) => void) {
    this.onChangeCallback = callback;
  }


  public registerOnTouched(callback: () => void) {
    this.onTouchedCallback = callback;
  }

  validateTime(aHouers, aMinute) {
    if (aHouers.trim() === '' || isNaN(aHouers)) { return false; }
    if (aMinute.trim() === '' || isNaN(aMinute)) { return false; }
    if (+aHouers < 0 || +aHouers > 23) { return false; }
    if (+aMinute < 0 || +aMinute > 59) { return false; }

    return true;
  }

  // change 12/5/20 to 120520
  // change 12.5.20 to 120520
  setCorrectFormat(insertedFormat, delimiter) {
    let retVal = '';
    const temp = insertedFormat.toString().split(delimiter);
    if (temp.length !== 3) {
      retVal = insertedFormat;
      return retVal;
    }

    temp.forEach(function (ele) {
      if (ele.length === 1) {
        ele = '0' + ele;
      }
      retVal = retVal + ele;
    });

    return retVal;
  }

  // gets value formatted in 6 or 8 chars e.g. 120520 / 12052020 and changes to date object.
  getValidDateMonth(a_day, a_month, a_year, a_TopYear, a_LowYear) {

    let iDay, iMonth, iYear;

    if (+a_day < 1 || +a_day > 31) { return null; }
    if (+a_month < 1 || +a_month > 12) { return null; }

    if (a_day.length > 2 || a_month.length > 2 || a_year.length < 1 || a_year.length > 4) { return null; }

    if (parseInt(a_day, 10) <= 0 || parseInt(a_day, 10) > 31) {
      return null;
    }

    iMonth = parseInt(a_month, 10);
    iDay = parseInt(a_day, 10);
    iYear = parseInt(a_year, 10);

    if (iDay.toString().length === 1) {
      iDay = '0' + iDay;
    }
    if (iMonth.toString().length === 1) {
      iMonth = '0' + iMonth;
    }
    if (iYear.toString().length === 1) {
      iYear = '0' + iYear;
    }

    if (iYear.toString().length === 2) {
      if (parseInt(iYear, 10) > 30) {
        iYear = 1900 + parseInt(iYear, 10);
      } else {
        iYear = 2000 + parseInt(iYear, 10);
      }
    }

    if (iYear > a_TopYear || iYear < a_LowYear) { return null; }
    switch (iMonth) {
      case 4 || 6 || 9 || 11:
        if (iDay > 30) { return null; }
        break;
      case 2:
        if (iMonth % 4 === 0) {
          if (iDay > 29) { return null; } else if (iDay > 28) { return null; }
        }
        break;
    }
    try {
      return new Date(iYear, iMonth - 1, iDay);
    } catch (e) { return null; }
  }
}
