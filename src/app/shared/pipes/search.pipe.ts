import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (value && args && args.length && args[0]) {
      const searchText = args[0].toLowerCase();
      const options = value.filter((item: any) => {
        return item.value.toLowerCase().includes(searchText);
      });

      return options && options.length ? options : [{ id: null, value: 'No result found' }];
    }
    return value;
  }

}
