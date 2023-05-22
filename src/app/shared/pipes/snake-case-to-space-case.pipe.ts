import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'snakeCaseToSpaceCase'
})
export class SnakeCaseToSpaceCase implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): string {
    if (value && typeof value === 'string') {
      let replacedValue = value.replace(/_/g, ' '); // Replace underscores with spaces
      replacedValue = replacedValue.replace(/%2f/gi, '/'); // Replace %2f with /
      replacedValue = replacedValue.replace(/%252f/gi, '/'); // Replace %252f with /
      return replacedValue;
    }

    return '';
  }
}
