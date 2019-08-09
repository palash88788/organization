import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
    name: 'jobApplicantFilter',
    pure: false
})
export class JobApplicantPipe implements PipeTransform {
    transform(items: any[], filter: any): any {
        if (!items || !filter) {
            return items;
        }
       const t = items.filter((item: any) => this.applyFilter(item, filter));
        return t
        
        
    }
    
    applyFilter(book: any, filter: any): boolean {
        
        for (const field in filter) {

                if (filter[field]) {
                    if (typeof filter[field] === 'string') {
                        
                        if (book.user_detail[field].toLowerCase().indexOf(filter[field].toLowerCase()) == -1) {

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

        return true;
    }
}