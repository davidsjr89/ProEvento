import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { Constants } from '../util/constants';

@Pipe({
  name: 'datetimeformatpipe'
})
export class DatetimeformatPipe extends DatePipe implements PipeTransform {

  transform(value: any): any {
    return super.transform(value, Constants.DATE_TIME_FMT);
  }

}
