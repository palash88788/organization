import { Pipe, PipeTransform } from '@angular/core';
import { pipe } from './filter.model'


@Pipe({
    name: 'personSearch',
    pure: false
})
export class PersonSearchPipe implements PipeTransform {
    transform(items: pipe[], filter: pipe): any {
        if (!items || !filter) {
            return items;
        }
        return items.filter((item: pipe) => this.applyFilter(item, filter));
    }
    applyFilter(book: pipe, filter: pipe): boolean {
        for (const field in filter) {
           
            if (book[field]) {
                if (filter[field]) {
                    if (typeof filter[field] === 'string') {
                        
                        if (book[field].toLowerCase().indexOf(filter[field].toLowerCase()) === -1) {
                            return false;
                        }
                    } else if (typeof filter[field] === 'number') {
                        if (book[field] !== filter[field]) {
                            return false;
                        }
                    } else if (filter[field] === 'date') {
                        if (book[field] !== filter[field]) {
                            return false;
                        }
                    }
                    
                }
            }

        }
        return true;
    }
}