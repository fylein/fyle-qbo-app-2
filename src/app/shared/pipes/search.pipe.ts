import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    // TODO: search with no matching keywords and close the dropdown and reopen, options would be cleared
    if (value && args && args.length && args[0]) {
      const searchText = args[0].toLowerCase();
      return value.filter((item: any) => {
        return item.value.toLowerCase().includes(searchText);
      });
    }
    return value;
  }

}
