import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'snakeCaseToSpaceCase'
})
export class SnakeCaseToSpaceCase implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    if (value && typeof value === 'string') {
      return value.replace(/_/g, ' ');
    }

    return '';
  }

}
