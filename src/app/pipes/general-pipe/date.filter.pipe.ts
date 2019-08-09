  
import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'dateFormatPipe',
})
export class dateFormatPipe implements PipeTransform {
    transform(value: string) {
       var datePipe = new DatePipe("en-US");
        // value = datePipe.transform(value, 'd MMM, y');
            value = datePipe.transform(value, 'medium');
        return value;
    }
}

