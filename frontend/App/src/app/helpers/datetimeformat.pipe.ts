import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { Constants } from '@app/util/constants';

@Pipe({
  name: 'datetimeformatpipe'
})
export class DatetimeformatPipe extends DatePipe implements PipeTransform {

  // transform(value: any): any {
  //   if(value !== undefined){

  //     const dia = value.substring(0, 2);
  //     const mes = value.substring(3, 5);
  //     const ano = value.substring(6, 10);
  //     const hora = value.substring(11, 16);
  //     return super.transform(`${mes}/${dia}/${ano} ${hora}`, Constants.DATE_FMT);
  //   }
  // }

  transform(value: any, args?: any): any {
    return super.transform(value, Constants.DATE_TIME_FMT);
  }
}
